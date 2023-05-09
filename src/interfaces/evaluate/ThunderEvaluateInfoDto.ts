import mongoose from 'mongoose';

export interface ThunderEvaluateInfoDto {
  thunderId: mongoose.Types.ObjectId;
  evaluates: mongoose.Types.ObjectId[];
}
