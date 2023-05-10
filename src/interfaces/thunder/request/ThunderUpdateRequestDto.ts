export interface ThunderUpdateRequestDto {
  title?: string;
  deadline?: string;
  content?: string;
  hashtags?: string[];
  limitMembersCnt?: number;
}
