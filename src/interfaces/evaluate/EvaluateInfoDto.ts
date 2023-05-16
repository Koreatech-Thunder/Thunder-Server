import mongoose from 'mongoose';

export interface EvaluateInfoDto {
  userId: mongoose.Types.ObjectId;
  thunderId: mongoose.Types.ObjectId;
  scores: number[];
}
