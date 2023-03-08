import mongoose from 'mongoose';

export interface ThunderResponseDto {
  title: string;
  deadline: string;
  content: string;
  hashtags: string[];
  members: mongoose.Types.ObjectId[]; //id<Object>
  limitMembersCnt: number;
  thunderState: string;
}
