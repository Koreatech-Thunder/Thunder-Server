import {ChatUserDto} from './ChatUserDto';

export interface ChatDto {
  id: String;
  thunderId: String;
  message: String;
  user: ChatUserDto;
  createdAt: Date;
  state: String; // OTHER, ME
}
