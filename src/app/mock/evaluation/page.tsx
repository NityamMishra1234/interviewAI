'use client';

import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { useRouter } from 'next/navigation';
import { resetEvaluation } from '@/store/slice/evaluationSlice';

import Confetti from 'react-confetti';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Navbar from '@/components/Navigation/navbar';
import Footer from '@/components/footer/Footer';
import { toast } from 'sonner';

const EvaluationPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { totalScore, feedback } = useSelector((state: RootState) => state.evaluation);
  const { name, topic, experienceLevel, email } = useSelector((state: RootState) => state.interviewSession);
  const certificateRef = useRef<HTMLDivElement | null>(null);

  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Feedback form state
  const [userFeedback, setUserFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  const handleBackToHome = () => {
    dispatch(resetEvaluation());
    router.push('/');
  };

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    const canvas = await html2canvas(certificateRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('landscape', 'px', [canvas.width, canvas.height]);
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save('certificate.pdf');
  };

  const handleFeedbackSubmit = async () => {
    if (!userFeedback.trim()) {
      toast.error('Please enter your feedback');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, feedbackText: userFeedback }),
      });

      if (res.ok) {
        toast.success('Thank you for your feedback!');
        setUserFeedback('');
      } else {
        toast.error('Failed to submit feedback');
      }
    } catch (err) {
      toast.error('Something went wrong!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const shareText = `I just completed my AI-powered interview on Tumna.ai and scored ${totalScore}/100! 🚀 #TumnaInterviewDiyaKya`;

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen bg-gradient-to-r from-fuchsia-950 via-zinc-900 to-black px-4 py-10 flex flex-col items-center">
        {/* 🎉 Confetti */}
        <Confetti width={windowSize.width} height={windowSize.height} recycle={false} />

        {/* 🧾 Certificate Section */}
        <div
          ref={certificateRef}
          className="bg-white shadow-2xl rounded-2xl p-10 max-w-4xl w-full border-4 border-green-300 mb-8 animate-fade-in"
        >
          <h1 className="text-4xl font-bold text-center text-green-700 mb-2">Certificate of Achievement</h1>
          <p className="text-center text-gray-700 text-lg mb-4 italic">This is to certify that</p>
          <p className="text-3xl font-semibold text-center text-blue-900 mb-2">{name || 'Candidate'}</p>
          <p className="text-center text-gray-700 text-lg mb-4">
            has successfully completed the AI-Powered Interview in
            <span>
              <span className="bg-yellow-500 text-black mx-1.5 px-2 py-1 rounded-full text-sm font-semibold shadow">
                {topic} at the {experienceLevel}
              </span>
            </span>
            with a score of
          </p>
          <p className="text-2xl font-bold text-center text-green-800">{totalScore}/100</p>
          <p className="text-center mt-4 text-sm text-gray-500">Dated: {new Date().toLocaleDateString()}</p>
          <div className="mt-6 border-t pt-2 text-right pr-10">
            <span className="italic text-gray-600">AI Evaluator, Interview.ai</span>
          </div>
        </div>

        {/* 🔘 Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <button
            onClick={handleDownload}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Download Certificate
          </button>
          <button
            onClick={handleBackToHome}
            className="px-6 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700"
          >
            Back to Home
          </button>
        </div>

        {/* 📝 Evaluation Feedback */}
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full text-gray-800 mb-10 animate-fade-in">
          <h2 className="text-2xl font-semibold mb-2 text-green-600">AI Evaluation Summary</h2>
          <p className="whitespace-pre-line text-justify">{feedback}</p>
        </div>

        {/* 🧠 Feedback Form */}
        <div className="bg-white rounded-xl shadow-md p-6 max-w-2xl w-full mb-10 animate-slide-in">
          <h3 className="text-xl font-semibold mb-4 text-blue-600">Your Feedback Matters</h3>
          <textarea
            value={userFeedback}
            onChange={(e) => setUserFeedback(e.target.value)}
            placeholder="Let us know your thoughts, suggestions or experience..."
            className="w-full h-32 border border-gray-300 rounded-lg p-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          />
          <button
            onClick={handleFeedbackSubmit}
            disabled={isSubmitting}
            className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </div>

        {/* 🔗 Share Section */}
        <div className="bg-white rounded-xl shadow-md p-6 max-w-xl w-full mb-10 text-center animate-slide-in">
          <h3 className="text-xl font-semibold mb-2">Share your result on LinkedIn!</h3>
          <p className="mb-4">Help others discover Interview.ai and inspire them to test their skills.</p>
          <div className="bg-gray-100 rounded p-4 text-sm font-mono text-left">{shareText}</div>
          <div className="mt-3 px-4 py-2 bg-gray-200 text-sm text-gray-600 rounded-xl">
            Tap and hold to copy on mobile or Ctrl+C on desktop
          </div>
        </div>

        {/* ☕ Support Section */}
        <div className="bg-white rounded-xl shadow-md p-6 max-w-xl w-full text-center">
          <h3 className="text-xl font-semibold mb-2">Support This Project 💚</h3>
          <p className="mb-4 text-gray-600">
            If you loved
            <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-sm font-semibold shadow mx-1.5">
              Interview.ai
            </span>
            and want to keep it free forever, buy the dev a coffee!
          </p>
          <img
            src="/qrcode.png"
            alt="QR Code"
            className="mx-auto w-40 h-40 mb-4 rounded-lg border-2 border-gray-300"
          />
          <p className="text-sm text-gray-500">Scan to contribute ☕ #TumnaInterviewDiyaKya</p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EvaluationPage;
