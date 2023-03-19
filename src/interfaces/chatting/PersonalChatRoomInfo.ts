import mongoose from 'mongoose';
export interface PersonalChatRoomInfo {
  id: String;
  userId: mongoose.Schema.Types.ObjectId;
  enterAt: Date;
  isAlarm: Boolean;
  isConnect: Boolean;
}
