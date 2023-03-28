import {ChatInfo} from './ChatInfo';

export interface ChatRoomDto {
  id: string;
  title: string;
  limitMemberCnt: number;
  joinMemberCnt: number;
  endTime: string;
  lastChat: ChatInfo | null;
}
