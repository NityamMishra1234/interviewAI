'use client';

import { useEffect, useState } from 'react';

type Message = {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

type Feedback = {
  _id: string;
  name: string;
  email: string;
  feedbackText: string;
  score: number;
  createdAt: string;
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/contact?key=${process.env.NEXT_PUBLIC_ADMIN_KEY}`);
        const data = await res.json();

        if (data.success) {
          setMessages(data.messages);
        } else {
          setError(data.message || 'Failed to load messages');
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Something went wrong');
      }
    };

    const fetchFeedbacks = async () => {
      try {
        const res = await fetch(`/api/feedback?key=${process.env.NEXT_PUBLIC_ADMIN_KEY}`);
        const data = await res.json();

        if (data.success) {
          setFeedbacks(data.feedbacks);
        } else {
          setError(data.message || 'Failed to load feedback');
        }
      } catch (err) {
        console.error('Error fetching feedback:', err);
        setError('Something went wrong while fetching feedback');
      }
    };

    Promise.all([fetchMessages(), fetchFeedbacks()]).finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">📬 Admin Dashboard</h1>

      {loading && <p>Loading data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Contact Messages */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Contact Messages</h2>
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg._id} className="border border-white/10 p-4 rounded-xl bg-white/5">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{msg.name}</h3>
                <p className="text-sm text-gray-400">{new Date(msg.createdAt).toLocaleString()}</p>
              </div>
              <p className="text-sm text-blue-300">{msg.email}</p>
              <p className="mt-2 text-gray-200">{msg.message}</p>
            </div>
          ))}
          {messages.length === 0 && !loading && <p>No messages yet.</p>}
        </div>
      </section>

      {/* Feedbacks */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">📝 Feedback</h2>
        <div className="space-y-4">
          {feedbacks.map((fb) => (
            <div key={fb._id} className="border border-white/10 p-4 rounded-xl bg-white/5">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">{fb.name}</h3>
                <p className="text-sm text-gray-400">{new Date(fb.createdAt).toLocaleString()}</p>
              </div>
              <p className="text-sm text-blue-300">{fb.email}</p>
              <p className="text-yellow-300">Score: {fb.score}/10</p>
              <p className="mt-2 text-gray-200">feedbacK{fb.feedbackText}</p>
            </div>
          ))}
          {feedbacks.length === 0 && !loading && <p>No feedback yet.</p>}
        </div>
      </section>
    </div>
  );
}
