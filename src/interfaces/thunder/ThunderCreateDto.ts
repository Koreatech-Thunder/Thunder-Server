export interface ThunderCreateDto {
  title: string;
  deadline: string;
  content: string;
  hashtags: string[];
  limitMembersCnt: number;
}
