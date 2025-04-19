// models/Feedback.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface FeedbackType extends Document {
  name: string;
  email: string;
  topic: string;
  feedbackText: string;
  score: number;
  createdAt: Date;
}

const FeedbackSchema = new Schema<FeedbackType>(
  {
    name: { type: String, },
    email: { type: String, },
    topic: { type: String, },
    feedbackText: { type: String, required: true },
    score: { type: Number,  min: 1, max: 10 },
  },
  { timestamps: true }
);

export const Feedback =
  mongoose.models.Feedback || mongoose.model<FeedbackType>('Feedback', FeedbackSchema);
