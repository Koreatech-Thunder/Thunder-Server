import mongoose from 'mongoose';

export enum thunderState_Enum {
  MEMBER = 'MEMBER',
  NON_MEMBER = 'NON_MEMBER',
  HOST = 'HOST',
}

export interface ThunderInfo {
  title: string;
  deadline: Date;
  content: string;
  hashtags: string[];
  members: mongoose.Types.ObjectId[]; //id<Object>
  limitMembersCnt: number;
  ceatedAt: Date;
  updateAt: Date;
  thunderState: thunderState_Enum;
}
