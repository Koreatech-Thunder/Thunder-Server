export interface EvaluateRequestDto {
  userId: string;
  scores: number;
}

export interface EvaluateRequestDtos extends Array<EvaluateRequestDto> {}
