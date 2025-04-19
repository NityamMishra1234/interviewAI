'use client';

import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
// Remove the direct component import, keep the type if needed
import type { LottieRefCurrentProps } from "lottie-react";
import speakingAnimation from "../../../accets/speaking men.json"; // Ensure path is correct
import listeningAnimation from "../../../accets/listening.json"; // Ensure path is correct
import dynamic from 'next/dynamic';
import { setEvaluationData } from '@/store/slice/evaluationSlice';
import { useRouter } from 'next/navigation';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { RootState } from "@/store";

// Dynamically import FaceMonitor (already done correctly)
const FaceMonitor = dynamic(() => import('@/components/FaceMonitor'), {
  ssr: false,
  loading: () => <p>Loading webcam...</p>,
});

// Dynamically import the Lottie component with SSR disabled
const DynamicLottie = dynamic(() => import('lottie-react'), {
  ssr: false
});


// --- (rest of your imports and type definitions like QuestionAnswerPair) ---
type QuestionAnswerPair = {
  question: string;
  answer: string;
  isSkipped?: boolean;
  retryCount?: number;
};

type SpeechRecognition =
  typeof window.SpeechRecognition | typeof window.webkitSpeechRecognition;


const InterviewPage = () => {
  const interviewSession = useSelector((state: RootState) => state.interviewSession);
  const { name, email, phone, topic, experienceLevel, sessionId } =
    interviewSession;

  // Use the imported type for the ref
  const speakingLottieRef = useRef<LottieRefCurrentProps | null>(null);
  const listeningLottieRef = useRef<LottieRefCurrentProps | null>(null); // Adjusted type slightly for consistency
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null); // videoRef doesn't seem to be used in FaceMonitor context here? Ensure it's needed.
  const streamRef = useRef<MediaStream | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 2;

  const [questions, setQuestions] = useState<QuestionAnswerPair[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuestionAnswerPair[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);


    const endInterview = (reason: string): void => {
        // Check if running on client before using alert
        if (typeof window !== 'undefined') {
            showDisqualificationMessage(reason);
        }
        setInterviewStatus('disqualified', reason);
        logViolation('Tab switch detected during interview');
    };

    const showDisqualificationMessage = (reason: string): void => {
        // Check if running on client before using alert
        if (typeof window !== 'undefined') {
            alert(`Interview ended: ${reason}. You have been disqualified.`);
        }
    };

    const setInterviewStatus = (status: string, reason: string): void => {
        axios.post('/api/interviews/updateStatus', {
            status,
            reason,
            sessionId,
        }).catch((error) => {
            console.error("Failed to update interview status:", error);
        });
    };

    const logViolation = (reason: string): void => {
        console.log(`Violation logged: ${reason}`);
        axios.post('/api/interviews/logViolation', {
            sessionId,
            reason,
        }).catch((error) => {
            console.error("Failed to log violation:", error);
        });
    };

    useEffect(() => {
      if (speakingLottieRef.current) {
          isSpeaking
              ? speakingLottieRef.current.play()
              : speakingLottieRef.current.pause();
      }
      if (listeningLottieRef.current) {
          isListening
              ? listeningLottieRef.current.play()
              : listeningLottieRef.current.pause();
      }
  }, [isSpeaking, isListening]);

  useEffect(() => {
    if (!sessionId) return;
    const fetchQuestions = async () => {
        try {
            const res = await axios.get(
                `/api/interview/${sessionId}`
            );
            setQuestions(res.data?.session?.responses || []);
        } catch (error) {
            console.error("Failed to fetch interview questions:", error);
            setQuestions([]);
        }
    };
    fetchQuestions();
}, [sessionId]);

    const speakText = (text: string, callback?: () => void) => {
        if (!text || typeof window === 'undefined' || !window.speechSynthesis) return; // Guard clause for server/missing API

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        // Getting voices might be async or need a moment, added check
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
            const maleVoice = voices.find((v) => v.name.includes("Male") && v.lang === "en-US"); // Be more specific
            if (maleVoice) utterance.voice = maleVoice;
        } else {
            // Handle case where voices aren't loaded yet (might need a listener for 'voiceschanged')
            console.warn("Speech synthesis voices not loaded yet.");
        }


        utterance.onstart = () => { // Use onstart to set speaking state
            setIsSpeaking(true);
        };

        utterance.onend = () => {
            setIsSpeaking(false);
            callback?.();
        };

        speechSynthesis.cancel(); // Cancel any previous speech
        speechSynthesis.speak(utterance);
    };

    const startListening = () => {
        // Check if running on client and API exists
        if (typeof window === 'undefined' || (!window.SpeechRecognition && !window.webkitSpeechRecognition)) {
            if (typeof window !== 'undefined') {
              alert("Speech recognition not supported in this browser.");
            }
            return;
          }

        const SpeechRecognitionImpl = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;


        const recognition = new SpeechRecognitionImpl();
        recognition.lang = "en-US";
        recognition.interimResults = true; // Keep true for live feedback
        recognition.continuous = false; // Set to false: typically you want it to stop after a pause

        recognitionRef.current = recognition;


        let finalTranscript = "";
        let silenceTimeout: NodeJS.Timeout | null = null; // Use NodeJS.Timeout for clarity with null

        // Function to reset silence timer (important for continuous=false too, to detect end of speech)
        const resetSilenceTimer = () => {
            if (silenceTimeout) clearTimeout(silenceTimeout);
            // Adjust timeout as needed - 3 seconds might be long for continuous=false
            silenceTimeout = setTimeout(() => {
                console.log("Silence detected, stopping recognition.");
                recognition.stop();
             }, 2000); // Shorter timeout
        };

        recognition.onstart = () => {
            console.log("Speech recognition started.");
            setIsListening(true);
            resetSilenceTimer(); // Start timer when recognition starts
        };


        recognition.onresult = (event: any) => {
            let interimTranscript = "";
            finalTranscript = ""; // Reset finalTranscript for each result event when continuous=false
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                const result = event.results[i];
                const transcript = result[0].transcript;
                if (result.isFinal) {
                    finalTranscript += transcript; // Append final results
                } else {
                    interimTranscript += transcript; // Build interim results
                }
            }
            console.log("Interim:", interimTranscript, "Final:", finalTranscript);


             // Handle "repeat" command (check final part of the transcript)
             const currentSpeech = (finalTranscript + interimTranscript).trim().toLowerCase();
             if (currentSpeech.endsWith('repeat') || currentSpeech.endsWith('again')) {
                 console.log("Repeat command detected.");
                 if (silenceTimeout) clearTimeout(silenceTimeout);
                 recognition.stop();
                 if (questions[currentIndex]?.question) {
                     speakText(questions[currentIndex].question, () => startListening());
                 }
                 return;
             }
 
             resetSilenceTimer();
         };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error:", event.error);
            setIsListening(false);
            if (silenceTimeout) clearTimeout(silenceTimeout);
            // Handle common errors
             if (event.error === 'no-speech') {
                console.log("No speech detected.");
                // Optionally retry or move on based on retry count
             } else if (event.error === 'audio-capture') {
                alert("Audio capture error. Please check microphone connection/permissions.");
             } else if (event.error === 'not-allowed') {
                alert("Microphone access denied. Please allow microphone access.");
             }
        };


        recognition.onend = () => {
            console.log("Speech recognition ended.");
            if (silenceTimeout) clearTimeout(silenceTimeout); // Clear timer
            setIsListening(false);
            const cleaned = finalTranscript.trim();
            console.log("Final transcript on end:", cleaned);


            if (cleaned.length > 3) { // Slightly lower threshold?
                setRetryCount(0); // Reset retries on successful answer
                handleAnswer(cleaned);
            } else if (retryCount < MAX_RETRIES) {
                 console.log(`Answer too short or empty. Retry ${retryCount + 1}.`);
                 setRetryCount((prev) => prev + 1);
                 // Optionally give feedback before retrying
                  speakText("Sorry, I didn't catch that. Could you please repeat?", () => {
                     startListening(); // Start listening again after prompt
                 });
            } else {
                console.log("Max retries reached. Skipping question.");
                setRetryCount(0); // Reset retries for next question
                handleAnswer("", true); // Handle answer with skip flag
            }
        };


        // Request microphone permission before starting
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then(() => {
                 console.log("Microphone access granted. Starting recognition.");
                recognition.start(); // Start recognition only after permission granted
            })
            .catch((err) => {
                console.error("Microphone permission denied or error:", err);
                alert("Please allow microphone access in your browser settings to proceed.");
                setIsListening(false); // Ensure listening state is false
            });
    };

    useEffect(() => {
        // Only speak question if questions are loaded, index is valid, and not already speaking/listening
        if (
            questions.length > 0 &&
            currentIndex < questions.length &&
            !isSpeaking &&
            !isListening &&
            questions[currentIndex]?.question // Ensure question exists
        ) {
            console.log("Attempting to speak question:", currentIndex);
            speakText(questions[currentIndex].question, () => {
                console.log("Finished speaking question, starting listening.");
                 startListening(); // Start listening only after speaking is done
            });
        }
    }, [questions, currentIndex, isSpeaking, isListening]); // Removed speakText and startListening from deps


    useEffect(() => {
         // Cleanup function
        return () => {
             console.log("Cleaning up InterviewPage component.");
            // Stop speech synthesis
             if (typeof window !== 'undefined' && window.speechSynthesis) {
                window.speechSynthesis.cancel();
             }
             // Stop speech recognition
             if (recognitionRef.current) {
                recognitionRef.current.abort();
                recognitionRef.current = null;
             }
             // Stop media stream
             if (streamRef.current) {
                 streamRef.current.getTracks().forEach((track) => track.stop());
                 streamRef.current = null;
             }
        };
    }, []);

    


    useEffect(() => {
        // Ensure document exists (runs only on client)
        if (typeof document === 'undefined') return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                console.log("Tab switched - disqualifying.");
                 // Check if interview should end based on state, maybe add a check if submission happened etc.
                 // Consider if alert is needed if already navigating away due to disqualification
                endInterview('Tab switch detected');
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [endInterview]); // endInterview dep might cause re-renders if not memoized, consider useCallback if needed


    const handleAnswer = (response: string, skipped = false) => {
        if (currentIndex >= questions.length) {
             console.warn("Attempted to handle answer when no more questions are left.");
             return; // Avoid processing if index is out of bounds
         }
        const question = questions[currentIndex];
        console.log(`Answer received for question ${currentIndex}: "${response}" ${skipped ? '(Skipped)' : ''}`);
        setAnswers((prev) => [
            ...prev,
            { question: question.question, answer: response, isSkipped: skipped },
        ]);

        // Move to next question or prepare for submission
        if (currentIndex < questions.length - 1) {
             console.log("Moving to next question.");
            setCurrentIndex(currentIndex + 1);
        } else {
            console.log("Last question answered.");
             // Optionally speak a closing message before enabling submit
              speakText("Thank you. You have completed all the questions. Please click Submit when you are ready.", () => {
                // Now the submit button logic will handle the actual submission
             });
        }
    };

    const handleRetry = () => {
         if (isListening || isSpeaking) {
             console.log("Cannot retry while speaking or listening.");
             return; // Don't allow retry if already active
         }
         if (currentIndex < questions.length) {
            console.log("Retrying last question.");
             setRetryCount(0); // Reset retry count for the manual retry
             // Re-speak the current question and start listening
              speakText(questions[currentIndex].question, () => {
                 startListening();
             });
         } else {
             console.log("No question to retry.");
         }
    };

    const handleSubmit = async () => {
      
      setIsSubmitting(true);
      
      
      if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
      if (recognitionRef.current) recognitionRef.current.abort();
  
      try {
          // Ensure all necessary data is present
          const submissionData = {
              sessionId,
              candidate: { name, email, phone, topic, experienceLevel },
              answers, // Ensure answers state is up-to-date
          };
          console.log("Submission Data:", submissionData);
  
          const res = await axios.post("/api/interview/submit", submissionData);
          console.log("Submission response:", res.data);
  
          if (res.data.success) {
              // Dispatch the evaluation data to Redux store
              dispatch(setEvaluationData({
                  totalScore: res.data.totalScore,
                  feedback: res.data.feedback,
              }));
              
              // Speak success message before navigating
              speakText("Your interview has been submitted successfully. Redirecting to evaluation.", () => {
                  router.push("/mock/evaluation");
              });
          } else {
              console.error("Interview submission failed:", res.data.message);
              
              // Speak failure message
              speakText("There was an error submitting your interview. Please try again later.", () => {
                  setIsSubmitting(false); // Re-enable button on failure
              });
          }
      } catch (error) {
          console.error("Submission failed:", error);
          
          // Speak error message
          speakText("An unexpected error occurred during submission. Please try again later.", () => {
              setIsSubmitting(false); // Re-enable button on error
          });
      }
  };
  

    // Ensure currentQuestion is accessed safely
    const currentQuestionText = questions.length > currentIndex ? questions[currentIndex]?.question : "Loading question...";


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col md:flex-row px-4 py-6 gap-6">
      {/* LEFT PANEL */}
      <div className="w-full md:w-7/12 flex flex-col gap-4">
        <div className="bg-white shadow-lg rounded-2xl p-6 flex-1 flex flex-col">
          <h2 className="text-xl md:text-2xl font-bold text-indigo-600 mb-4">Live Interview</h2>

          {/* Question Display Area */}
           <div className="mb-4 p-4 bg-indigo-50 rounded-lg min-h-[60px]">
             <p className="text-gray-800 font-medium">
               <span className="font-bold">Q{currentIndex + 1}: </span>
               {currentQuestionText}
             </p>
           </div>


          {/* Speaking Animation Area */}
          <div className="h-40 md:h-60 flex items-center justify-center relative mb-4">
            {isSpeaking && ( // Only show speaking animation when speaking
              <div className="relative h-full w-full max-w-xs">
                <DynamicLottie
                  animationData={speakingAnimation}
                  loop
                  autoplay // Autoplay when rendered
                  lottieRef={speakingLottieRef} // Assign ref
                  className="absolute top-0 left-0 w-full h-full object-contain" // Use object-contain
                />
              </div>
            )}
             {!isSpeaking && !isListening && questions.length === 0 && (
                <p className="text-gray-500">Loading questions...</p> // Initial loading state
             )}
             {!isSpeaking && !isListening && questions.length > 0 && currentIndex >= questions.length && (
                <p className="text-gray-500">Interview complete. Ready to submit.</p> // End state
             )}
          </div>

           {/* Listening Indicator Area */}
           <div className="h-20 flex items-center justify-center">
             {isListening && (
                <div className="flex flex-col items-center text-blue-600">
                  <DynamicLottie
                      animationData={listeningAnimation}
                      loop
                      autoplay // Autoplay when rendered
                      lottieRef={listeningLottieRef} // Assign ref
                      className="h-16 w-16" // Fixed size
                  />
                  <p className="text-sm font-medium">Listening...</p>
                </div>
             )}
           </div>


          {/* Controls Area */}
          <div className="mt-auto pt-4 flex gap-3"> {/* Pushes controls to bottom */}
            <button
              onClick={handleRetry}
              disabled={isListening || isSpeaking || currentIndex >= questions.length} // Disable during activity or after completion
              className="px-4 py-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 disabled:bg-gray-400"
            >
              Retry Question
            </button>

            {/* Show submit button only after last question is answered or skipped */}
            {currentIndex >= questions.length -1 && answers.length > currentIndex && (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || isListening || isSpeaking} // Disable during submission/activity
                className={`px-4 py-2 flex items-center justify-center gap-2 rounded-xl text-white transition ${
                  isSubmitting ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                } disabled:bg-gray-400`}
              >
                {isSubmitting ? (
                  <>
                    <AiOutlineLoading3Quarters className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Interview'
                )}
              </button>
            )}
          </div>

        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full md:w-5/12 flex flex-col gap-4">
         {/* Webcam Area */}
         <div className="bg-white shadow-lg rounded-2xl p-4 flex justify-center items-center h-60 md:h-80">
           {/* FaceMonitor should handle its own video element internally */}
           <FaceMonitor />
         </div>
         {/* Candidate Info Area */}
         <div className="bg-white shadow-lg rounded-2xl p-6">
           <h3 className="text-lg font-semibold text-gray-700 mb-4">Candidate Info</h3>
           <div className="space-y-1 text-sm text-gray-600"> {/* Improved spacing/sizing */}
              <p><span className="font-semibold">Name:</span> {name || 'N/A'}</p>
              <p><span className="font-semibold">Email:</span> {email || 'N/A'}</p>
              <p><span className="font-semibold">Phone:</span> {phone || 'N/A'}</p>
              <p><span className="font-semibold">Topic:</span> {topic || 'N/A'}</p>
              <p><span className="font-semibold">Experience:</span> {experienceLevel || 'N/A'}</p>
           </div>
         </div>
      </div>
    </div>
  );
};

export default InterviewPage;
