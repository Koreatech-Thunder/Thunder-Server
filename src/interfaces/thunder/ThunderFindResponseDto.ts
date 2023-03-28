import mongoose from 'mongoose';

export interface ThunderFindResponseDto {
  thunderId: mongoose.Types.ObjectId;
  title: string;
  deadline: string;
  content: string;
  hashtags: string[];
  limitMembersCnt: number;
}
