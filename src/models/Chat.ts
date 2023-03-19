import mongoose from 'mongoose';
import {ChatInfo} from '../interfaces/chatting/ChatInfo';

const ChatSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  message: {
    type: String,
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
  },
  createdAt: {
    type: Date,
  },
});

export default mongoose.model<ChatInfo & mongoose.Document>('Chat', ChatSchema);
