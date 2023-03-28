import mongoose from 'mongoose';
export interface PersonalChatRoomInfo {
  userId: mongoose.Schema.Types.ObjectId;
  enterAt: Date;
  isAlarm: Boolean;
  isConnect: Boolean;
}
