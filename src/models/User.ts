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
  },
  isAlarm: [
    {
      type: Boolean,
      default: [false, false, false],
    },
  ],
});

export default mongoose.model<UserInfo & mongoose.Document>('User', UserSchema);
