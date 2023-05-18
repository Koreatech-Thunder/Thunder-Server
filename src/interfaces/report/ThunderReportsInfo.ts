import mongoose from 'mongoose';

export interface ThunderReportsInfo {
  userId: mongoose.Types.ObjectId;
  thunderId: string;
  reportIndex: number;
  createdAt: Date;
}
