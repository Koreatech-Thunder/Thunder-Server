import mongoose from 'mongoose';

export interface ThunderMembersDto {
  userId: mongoose.Types.ObjectId;
  name: String;
  introduction: String;
  hashtags: string[];
  mannerTemperature: Number;
}
