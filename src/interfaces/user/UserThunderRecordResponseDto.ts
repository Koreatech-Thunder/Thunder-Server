import mongoose from 'mongoose';

export interface UserThunderRecordResponseDto {
  thunderId: mongoose.Types.ObjectId;
  title: string;
  hashtags: string[];
  deadline: string;
  hashtags: string[];
}
