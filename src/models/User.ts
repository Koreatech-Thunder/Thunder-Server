import mongoose from "mongoose";
import { UserInfo } from "../interfaces/user/UserInfo";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "",
  },
  introduction: {
    type: String,
    default: "",
  },
  mannerTemperature: {
    type: Number,
    default: 36.5,
  },
  hashtags: {
    type: [String],
    default: [],
  },
  isLogout: {
    type: Boolean,
    default: true,
  },
  kakaoId: {
    type: String,
  },
  fcmToken: {
    type: [String],
    required: true,
  },
});

export default mongoose.model<UserInfo & mongoose.Document>("User", UserSchema);
