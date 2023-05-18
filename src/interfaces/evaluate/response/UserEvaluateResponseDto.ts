import mongoose from 'mongoose';

export interface UserEvaluateResponseDto {
  title: String;
  userInfo: [
    {
      userId: mongoose.Types.ObjectId;
      name: String;
    },
  ];
}
