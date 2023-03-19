import mongoose from 'mongoose';

export interface ThunderInfo {
  title: string;
  deadline: Date;
  content: string;
  hashtags: string[];
  chats: String[];
  members: String[]; //id<Object>
  limitMembersCnt: number;
  createdAt: Date;
  updatedAt: Date;
  thunderState: Enumerator;
}
