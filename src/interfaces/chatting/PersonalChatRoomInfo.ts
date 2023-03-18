import mongoose from 'mongoose';
export interface PersonalChatRoomInfo {
    id: String;
    userId: mongoose.Schema.Types.ObjectId;
    enteredAt: Date;
    isAlarm: Boolean;
    isConnect: Boolean;
}