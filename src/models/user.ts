// src/models/user.ts
import  { Schema, models, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  username: string;
  otp?: string;
  otpExpiry?: Date;
  isVerified: boolean;
  createdAt: Date;
  hashedPassword: string;
  company?: string; // ✅ new field
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    otp: String,
    otpExpiry: Date,
    isVerified: { type: Boolean, default: false },
    hashedPassword: { type: String, required: true },
    company: { type: String }, // ✅ new field added
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const User = models.User || model<IUser>('User', UserSchema);
export default User;
