import mongoose from 'mongoose';
import {ThunderInfo} from '../interfaces/thunder/ThunderInfo';

const ThunderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  deadline: {
    //String -> Date 형변환
    type: Date,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  hashtags: [
    {
      type: String,
      required: true,
    },
  ],
  chats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
      default: [],
    },
  ],
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'PersonalChatRoom',
      default: [],
    },
  ],
  limitMembersCnt: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    required: false,
    default: Date.now() + 3600000 * 9,
  },
  updatedAt: {
    type: Date,
    required: false,
    default: Date.now() + 3600000 * 9,
  },
});

export default mongoose.model<ThunderInfo & mongoose.Document>(
  'Thunder',
  ThunderSchema,
);
