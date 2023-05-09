import mongoose from 'mongoose';
import {UserInfo} from '../interfaces/user/UserInfo';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    default: '',
  },
  introduction: {
    type: String,
    default: '',
  },
  mannerTemperature: {
    type: Number,
    default: 36,
  },
  hashtags: [
    {
      type: String,
      default: [],
    },
  ],
  isLogOut: {
    type: Boolean,
    default: true,
  },
  kakaoId: {
    type: String,
    unique: true,
  },
  fcmToken: {
    type: String,
    required: true,
    unique: true,
  },
  thunderRecords: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ThunderRecords',
      default: [],
    },
  ],
  isAlarms: {
    type: [Boolean],
    default: [true, true, true],
  },
  isReport: {
    type: Boolean,
    default: false,
  },
  reportCount: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model<UserInfo & mongoose.Document>('User', UserSchema);
