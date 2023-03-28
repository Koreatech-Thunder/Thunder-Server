import mongoose from 'mongoose';

export interface ThunderMembersDto {
  userId: mongoose.Types.ObjectId;
  name: String;
  userId: mongoose.Types.ObjectId;
  introduction: String;
  hashtags: string[];
  mannerTemperature: Number;
}
