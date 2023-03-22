import {ThunderMembersDto} from './ThunderMembersDto';
import mongoose from 'mongoose';

export interface ThunderResponseDto {
  thunderId: mongoose.Types.ObjectId;
  title: string;
  deadline: string;
  content: string;
  hashtags: string[];
  members: ThunderMembersDto[];
  limitMembersCnt: number;
  thunderState: string;
}
