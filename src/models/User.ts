import mongoose from 'mongoose';
import { UserInfo } from '../interfaces/user/UserInfo';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
});

export default mongoose.model<UserInfo & mongoose.Document>('User', UserSchema);
