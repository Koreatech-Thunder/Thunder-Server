import mongoose from 'mongoose';
import {ChatUserDto} from './ChatUserDto';

export interface ChatDto {
  chatId: mongoose.Schema.Types.ObjectId;
  message: String;
  user: ChatUserDto;
  createdAt: Number;
  state: String; // OTHER, ME
}
