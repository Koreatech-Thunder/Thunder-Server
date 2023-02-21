import mongoose from 'mongoose';

export interface ThunderDetailResponseDto {
  title: string;
  deadline: string;
  content: string;
  hashtags: string[];
  members: mongoose.Types.ObjectId[]; //id<Object>
  limitMembersCnt: number;
  thunderState: string;
}
