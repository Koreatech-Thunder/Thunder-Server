import mongoose from 'mongoose';
import {UserInfo} from '../interfaces/user/UserInfo';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    default: '',
    unique: true,
  },
  introduction: {
    type: String,
    default: '',
  },
  mannerTemperature: {
    type: Number,
    default: 36.5,
  },
  hashtags: {
    type: [String],
    default: [],
  },
  isLogOut: {
    type: Boolean,
    default: true,
  },
  kakaoId: {
    type: String,
  },
  fcmToken: {
    type: String,
    required: true,
  },
  thunderRecords: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'ThunderRecords',
    default: [],
  },
  isAlarms: [
    {
      type: Boolean,
      default: [true, true, true],
    },
  ],
});

export default mongoose.model<UserInfo & mongoose.Document>('User', UserSchema);
