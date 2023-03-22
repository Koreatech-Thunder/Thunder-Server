import mongoose from 'mongoose';

export interface ChatInfo {
  id: mongoose.Schema.Types.ObjectId;
  message: String;
  sender: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}
