import mongoose from 'mongoose';
import {ThunderInfo} from '../interfaces/thunder/ThunderInfo';

const ThunderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: '',
  },
  deadline: {
    //String -> Date 형변환
    type: Date,
    required: true,
    defalut: Date.now,
  },
  content: {
    type: String,
    required: true,
    default: '',
  },
  hashtags: [
    {
      type: String,
      required: false,
    },
  ],
  members: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  ],
  limitMembersCnt: {
    type: Number,
    required: true,
  },
  ceatedAt: {
    type: Date,
  },
  updateAt: {
    type: Date,
  },
  thunderState: {
    type: String,
  },
});

export default mongoose.model<ThunderInfo & mongoose.Document>(
  'Thunder',
  ThunderSchema,
);
