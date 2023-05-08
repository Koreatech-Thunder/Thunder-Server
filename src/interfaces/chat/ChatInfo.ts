import {ObjectId} from 'mongoose';

export interface ChatInfo {
  id: ObjectId;
  message: String;
  sender: String;
  createdAt: Number;
}
