import mongoose from 'mongoose';

export interface UserEvaluateResponseDto {
  title: String;
  userId: mongoose.Types.ObjectId;
  name: String;
}
