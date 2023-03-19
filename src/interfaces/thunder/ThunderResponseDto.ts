import mongoose from 'mongoose';

export interface ThunderResponseDto {
  title: string;
  deadline: string;
  content: string;
  hashtags: string[];
  chats: mongoose.Types.ObjectId[];
  members: mongoose.Types.ObjectId[]; //id<Object>
  limitMembersCnt: number;
  thunderState: string;
}
