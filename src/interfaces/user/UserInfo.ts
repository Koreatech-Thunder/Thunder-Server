import mongoose from 'mongoose';
export interface UserInfo {
  name: String;
  introduction: String;
  mannerTemperature: Number;
  hashtags: [String];
  isLogOut: Boolean;
  kakaoId?: String;
  fcmToken: String;
  thunderRecords: [mongoose.Schema.Types.ObjectId];
  isAlarm: Boolean[];
}
