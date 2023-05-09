import mongoose from 'mongoose';

export interface ThunderMembersResponseDto {
  userId: mongoose.Types.ObjectId;
  name: String;
  introduction: String;
  hashtags: string[];
  mannerTemperature: Number;
}
