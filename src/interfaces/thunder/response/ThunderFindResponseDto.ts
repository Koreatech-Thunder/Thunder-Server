import {ThunderMembersDto} from '../request/ThunderMembersRequestDto';
import mongoose from 'mongoose';

export interface ThunderResponseDto {
  thunderId: mongoose.Types.ObjectId;
  title: string;
  deadline: string;
  content: string;
  hashtags: string[];
  chats: mongoose.Types.ObjectId[];
  members: ThunderMembersDto[];
  limitMembersCnt: number;
  thunderState: string;
}
