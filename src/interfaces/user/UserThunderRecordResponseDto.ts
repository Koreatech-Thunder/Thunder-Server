import mongoose from 'mongoose';

export interface UserThunderRecordResponseDto {
  thunderId: mongoose.Types.ObjectId;
  title: string;
  deadline: string;
}
