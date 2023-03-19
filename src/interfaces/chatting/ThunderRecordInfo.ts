import mongoose from 'mongoose';

export interface ThunderRecordInfo {
  id: String;
  thunderId: mongoose.Schema.Types.ObjectId;
  isEvaluate: Boolean;
}
