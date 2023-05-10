import {ThunderMembersResponseDto} from './ThunderMembersResponseDto';
import mongoose from 'mongoose';

export interface ThunderFindResponseDto {
  thunderId: mongoose.Types.ObjectId;
  title: string;
  deadline: string;
  content: string;
  hashtags: string[];
  chats: mongoose.Types.ObjectId[];
  members: ThunderMembersResponseDto[];
  limitMembersCnt: number;
  thunderState: string;
}
