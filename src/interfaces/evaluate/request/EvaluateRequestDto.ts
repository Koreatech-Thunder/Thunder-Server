export interface EvaluateRequest {
  userId: string;
  score: number;
}

export interface EvaluateRequestDto {
  evaluate: EvaluateRequest[];
}
