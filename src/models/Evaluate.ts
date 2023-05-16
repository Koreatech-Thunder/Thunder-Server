import mongoose from 'mongoose';
import {EvaluateInfoDto} from '../interfaces/evaluate/EvaluateInfoDto';

const EvaluateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  thunderId: {
    type: mongoose.Types.ObjectId,
    ref: 'Thunder',
  },
  scores: [
    {
      type: Number,
    },
  ],
});

export default mongoose.model<EvaluateInfoDto & mongoose.Document>(
  'Evaluate',
  EvaluateSchema,
);
