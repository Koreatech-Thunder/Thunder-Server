import mongoose from 'mongoose';
import {ChatUserDto} from './ChatUserDto';

export interface ChatDto {
  chatId: mongoose.Schema.Types.ObjectId;
  message: String;
  user: ChatUserDto;
  createdAt: string;
  state: String; // OTHER, ME
}
