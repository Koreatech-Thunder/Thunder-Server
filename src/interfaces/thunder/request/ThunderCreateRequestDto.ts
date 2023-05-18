export interface ThunderCreateRequestDto {
  title: string;
  deadline: string;
  content: string;
  hashtags: string[];
  limitMembersCnt: number;
}
