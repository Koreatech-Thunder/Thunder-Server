import {ChatDto} from './ChatDto';

export interface ChatRoomDetailDto {
  title: string;
  limitMemberCnt: number;
  joinMemberCnt: number;
  isAlarm: Boolean;
  thunderId: string;
  chats: ChatDto[];
}
