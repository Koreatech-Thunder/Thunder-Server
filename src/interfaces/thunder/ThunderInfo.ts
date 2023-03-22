import mongoose from 'mongoose';

export interface ThunderInfo {
  thunderId: mongoose.Types.ObjectId;
  title: string;
  deadline: Date;
  content: string;
  hashtags: string[];
  members: mongoose.Types.ObjectId[]; //id<Object>
  limitMembersCnt: number;
  createdAt: Date;
  updatedAt: Date;
}
