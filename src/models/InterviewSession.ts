// models/InterviewSession.ts
import mongoose from 'mongoose';

const responseSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String },
  score: { type: Number },
  feedback: { type: String },
  retryCount: { type: Number, default: 0 }, // for re-ask logic
  isSkipped: { type: Boolean, default: false },
});

const InterviewSessionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  topic: { type: String, required: true },
  experienceLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  responses: [responseSchema],
  totalScore: { type: Number, default: 0 },
  status: { type: String, enum: ['in-progress', 'completed'], default: 'in-progress' },
  currentQuestionIndex: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const InterviewSession = mongoose.models.InterviewSession || mongoose.model('InterviewSession', InterviewSessionSchema);
