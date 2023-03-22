import mongoose from 'mongoose';
import {ThunderRecordInfo} from '../interfaces/chatting/ThunderRecordInfo';

const ThunderRecordSchema = new mongoose.Schema({
  thunderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Thunder',
  },
  isEvaluate: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model<ThunderRecordInfo & mongoose.Document>(
  'ThunderRecord',
  ThunderRecordSchema,
);
