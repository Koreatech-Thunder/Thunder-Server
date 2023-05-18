import mongoose from 'mongoose';
import {ThunderEvaluateInfoDto} from '../interfaces/evaluate/ThunderEvaluateInfoDto';

const ThunderEvaluateSchema = new mongoose.Schema({
  thunderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Thunder',
  },
  evaluates: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Evaluate',
    },
  ],
});

export default mongoose.model<ThunderEvaluateInfoDto & mongoose.Document>(
  'ThunderEvaluate',
  ThunderEvaluateSchema,
);
