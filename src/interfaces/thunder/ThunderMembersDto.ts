import mongoose from 'mongoose';

export interface ThunderMembersDto {
  name: String;
  userId: mongoose.Types.ObjectId;
  introduction: String;
  hashtags: [String];
  mannerTemperature: Number;
}
