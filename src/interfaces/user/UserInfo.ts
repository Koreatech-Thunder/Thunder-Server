import mongoose from 'mongoose';
export interface UserInfo {
  name?: String;
  introduction?: String;
  mannerTemperature?: Number;
  hashtags?: string[];
  isLogOut?: Boolean;
  kakaoId?: String;
  fcmToken?: String;
  thunderRecords?: mongoose.Schema.Types.ObjectId[];
  isAlarms?: [Boolean];
  isReport?: Boolean;
  reportCount?: number;
  profile: string;
}
