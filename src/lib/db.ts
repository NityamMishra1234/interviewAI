import mongoose from 'mongoose';

let isConnected: boolean = false;
console.log("🔎 MONGO_URI from env:", process.env.MONGO_URI);
export const connectDB = async (): Promise<void> => {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    isConnected = true;
    console.log('🟢 MongoDB connected');
  } catch (err) {
    console.error('🔴 MongoDB connection error:', err);
    throw err;
  }
};
