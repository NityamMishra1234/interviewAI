// models/Notify.ts
import mongoose, { Schema, models, model } from 'mongoose';

const NotifySchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default models.Notify || model('Notify', NotifySchema);
