import mongoose from 'mongoose';
import {ChatReportsInfo} from '../interfaces/report/ChatReportsInfo';

const ChatReportsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  thunderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Thunder',
    required: false,
  },
  reportIndex: {
    type: Number,
    required: false,
  },
  createdAt: {
    type: Date,
    required: false,
    defalut: Date.now() + 3600000 * 9,
  },
});

export default mongoose.model<ChatReportsInfo & mongoose.Document>(
  'ChatReports',
  ChatReportsSchema,
);
