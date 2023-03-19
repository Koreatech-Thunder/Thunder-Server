import mongoose from 'mongoose';
import {PersonalChatRoomInfo} from '../interfaces/chatting/PersonalChatRoomInfo';

const PersonalChatRoomSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  enterAt: {
    type: Date,
  },
  isAlarm: {
    type: Boolean,
  },
  isConnect: {
    type: Boolean,
  },
});

export default mongoose.model<PersonalChatRoomInfo & mongoose.Document>(
  'PersonalChatRoom',
  PersonalChatRoomSchema,
);
