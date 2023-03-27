import mongoose from 'mongoose';

export interface UserUpdateDto {
  name?: String;
  introduction?: String;
  mannerTemperature?: Number;
  hashtags?: string[];
  isLogOut?: Boolean;
  kakaoId?: String;
  fcmToken?: String;
  thunderRecords?: [mongoose.Schema.Types.ObjectId];
  isAlarms?: [Boolean];
}
