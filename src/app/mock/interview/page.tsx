"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { LottieRefCurrentProps } from "lottie-react";
import dynamic from "next/dynamic";
import speakingAnimation from "../../../accets/speaking men.json";
import listeningAnimation from "../../../accets/listening.json";

import { setEvaluationData } from '@/store/slice/evaluationSlice';
import { useRouter } from 'next/navigation';
import { useDispatch } from "react-redux";
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { RootState } from "@/store";


const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
const FaceMonitor = dynamic(() => import("@/components/FaceMonitor"), { ssr: false });
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
type SpeechRecognition =
  typeof window.SpeechRecognition | typeof window.webkitSpeechRecognition;
const InterviewPage = () => {
  
  const interviewSession = useSelector((state: RootState) => state.interviewSession);
  const { name, email, phone, topic, experienceLevel, sessionId } =
    interviewSession;
 
  const speakingLottieRef = useRef<LottieRefCurrentProps | null>(null);
  const listeningLottieRef = useRef<LottieRefCurrentProps>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const router = useRouter();
const dispatch = useDispatch();
  // This line can be updated directly to faceapi variable without useState
 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 2;

  const [questions, setQuestions] = useState<QuestionAnswerPair[]>([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  // const [answer, setAnswer] = useState<string>("");
  const [answers, setAnswers] = useState<QuestionAnswerPair[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
 
  type QuestionAnswerPair = {
    question: string;
    answer: string;
    isSkipped?: boolean;
    retryCount?: number;
  };

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // User switched tab or minimized the window
      
      alert('You have switched tabs! The interview has been disqualified.');
      endInterview('Tab switch detected');
    } else {
      
    }
  });

  // End the interview
  function endInterview(reason: string): void {
    setInterviewStatus('disqualified', reason);
    showDisqualificationMessage(reason);
    logViolation('Tab switch detected during interview');
  }

  function showDisqualificationMessage(reason: string): void {
    alert(`Interview ended: ${reason}. You have been disqualified.`);
  }

  function setInterviewStatus(status: string, reason: string): void {
    // Send status and reason to the server to update the interview
    axios.post('/api/interviews/updateStatus', {
      status,
      reason,
      sessionId,
    }).catch((error) => {
      console.error("Failed to update interview status:", error);
    });
  }

  function logViolation(reason: string): void {
    console.log(`Violation logged: ${reason}`);
    // Log violation on the server for audit purposes
    axios.post('/api/interviews/logViolation', {
      sessionId,
      reason,
    }).catch((error) => {
      console.error("Failed to log violation:", error);
    });
  }

  // Sync animation states
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

  // Fetch interview questions
  useEffect(() => {
    if (!sessionId) return;
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(
          `/api/interview/${sessionId}`
        );
        setQuestions(res.data.session.responses);
      } catch (error) {
        console.error("Failed to fetch interview questions:", error);
      }
    };
    fetchQuestions();
  }, [sessionId]);

 
  const speakText = (text: string, callback?: () => void) => {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    const maleVoice = speechSynthesis
      .getVoices()
      .find((v) => v.name.includes("Male"));

    if (maleVoice) utterance.voice = maleVoice;

    utterance.onend = () => {
      setIsSpeaking(false);
      callback?.();
    };

    speechSynthesis.cancel();
    setIsSpeaking(true);
    speechSynthesis.speak(utterance);
  };
  
  useEffect(() => {
    if (
      questions.length &&
      currentIndex < questions.length &&
      !isSpeaking &&
      !isListening
    ) {
      const currentQuestion = questions[currentIndex];
      speakText(currentQuestion?.question, () => {
        startListening();
      });
    }
    console.log("Current question:", questions[currentIndex]?.question);
  }, [questions, currentIndex]);

  // Start voice recognition
  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognitionRef.current = recognition;
    setIsListening(true);

    let finalTranscript = "";
    let silenceTimeout: NodeJS.Timeout;

    const resetSilenceTimer = () => {
      clearTimeout(silenceTimeout);
      silenceTimeout = setTimeout(() => recognition.stop(), 3000);
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        if (result.isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      const fullText = finalTranscript + interimTranscript;
      // setAnswer(fullText);
      resetSilenceTimer();

      if (/repeat|again/i.test(fullText)) {
        recognition.stop();
        speakText(questions[currentIndex].question, () => startListening());
      }
    };

    recognition.onend = () => {
      clearTimeout(silenceTimeout);
      setIsListening(false);
      const cleaned = finalTranscript.trim();

      if (cleaned.length > 5) {
        setRetryCount(0);
        handleAnswer(cleaned);
      } else if (retryCount < MAX_RETRIES) {
        setRetryCount((prev) => prev + 1);
        startListening();
      } else {
        setRetryCount(0);
        setAnswers((prev) => [
          ...prev,
          {
            question: questions[currentIndex].question,
            answer: "",
            isSkipped: true,
          },
        ]);
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(currentIndex + 1);
        }
      }
    };

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => recognition.start())
      .catch((err) => {
        console.error("Microphone permission denied", err);
        alert("Please allow microphone access in your browser settings.");
      });

    resetSilenceTimer();
  };

  // Cleanup
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      recognitionRef.current = null;
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  // Webcam stream
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 320, height: 240, frameRate: 15 } })
      .then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream;
        streamRef.current = stream;
      })
      .catch((err) => console.error("Webcam access error:", err));
  }, []);

  const handleAnswer = (response: string) => {
    const question = questions[currentIndex];
    setAnswers((prev) => [...prev, { question: question.question, answer: response }]);
    // setAnswer("");
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleRetry = () => {
    // setAnswer("");
    startListening();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await axios.post("/api/interview/submit", {
        sessionId,
        candidate: { name, email, phone, topic, experienceLevel },
        answers,
      });
      console.log("➡️ Sending to backend:", {
       
        questions,
        answers,
      });
  
      if (res.data.success) {
        alert("Interview submitted successfully!");
  
        dispatch(setEvaluationData({
          totalScore: res.data.totalScore,
          feedback: res.data.feedback,
        }));
  
        router.push("/mock/evaluation");
      } else {
        alert("Interview submission failed.");
      }
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex px-4 py-6 gap-6">
      {/* LEFT PANEL */}
      <div className="w-7/12 flex flex-col gap-4">
        <div className="bg-white shadow-lg rounded-2xl p-6 flex-1">
          <h2 className="text-2xl font-bold text-indigo-600 mb-4">Live Interview</h2>

          <div className="h-80 flex items-center justify-center relative">
            <div className="relative h-72 w-42">
              <Lottie
                animationData={speakingAnimation}
                loop
                className="absolute top-0 left-0 w-full h-full z-10"
                lottieRef={speakingLottieRef}
              />
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <div className="flex gap-3">
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600"
              >
                Retry
              </button>

              {currentIndex === questions.length - 1 && (
  <button
    onClick={handleSubmit}
    disabled={isSubmitting}
    className={`px-4 py-2 flex items-center justify-center gap-2 rounded-xl text-white transition ${
      isSubmitting ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
    }`}
  >
    {isSubmitting ? (
      <>
        <AiOutlineLoading3Quarters className="animate-spin" />
        Submitting...
      </>
    ) : (
      'Submit'
    )}
  </button>
)}
            </div>

            <div className="h-80 bg-gray-200 rounded-lg flex items-center justify-center gap-2">
              <Lottie
                animationData={listeningAnimation}
                loop
                lottieRef={listeningLottieRef}
                className="h-20 w-20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-5/12">

      <div className="bg-white shadow-lg rounded-2xl p-4 flex justify-center items-center h-96">
    <FaceMonitor/>
  </div>
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Candidate Info</h3>
          <p>Name: {name}</p>
          <p>Email: {email}</p>
          <p>Phone: {phone}</p>
          <p>Topic: {topic}</p>
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
