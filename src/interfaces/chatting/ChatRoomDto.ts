import {ChatDto} from './ChatDto';

export interface ChatRoomDto {
  id: string;
  title: string;
  limitMemberCnt: number;
  joinMemberCnt: number;
  endTime: Date;
  lastChat: ChatDto | null;
}
