import mongoose from 'mongoose';
import {ChatUserDto} from './ChatUserDto';

export interface ChatDto {
  id: mongoose.Schema.Types.ObjectId;
  thunderId: String;
  message: String;
  user: ChatUserDto;
  createdAt: Date;
  state: String; // OTHER, ME
}
