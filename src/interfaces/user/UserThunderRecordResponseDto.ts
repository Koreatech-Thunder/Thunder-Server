import mongoose from 'mongoose';

export interface UserThunderRecordResponseDto {
  thunderRecords: [mongoose.Schema.Types.ObjectId];
}
