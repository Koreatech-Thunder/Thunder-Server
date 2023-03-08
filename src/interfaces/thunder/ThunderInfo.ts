import mongoose from 'mongoose';

export interface ThunderInfo {
  title: string;
  deadline: Date;
  content: string;
  hashtags: string[];
  members: mongoose.Types.ObjectId[]; //id<Object>
  limitMembersCnt: number;
  createdAt: Date;
  updatedAt: Date;
  thunderState: Enumerator;
}
