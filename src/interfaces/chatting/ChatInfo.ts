import mongoose from "mongoose";

export interface ChatInfo {
  id: String;
  message: String;
  sender: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  }
