import mongoose from 'mongoose';

export interface EvaluateInfoDto {
  userId: mongoose.Types.ObjectId;
  scores: number[];
}
