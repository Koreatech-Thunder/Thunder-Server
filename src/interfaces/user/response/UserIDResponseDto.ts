import mongoose from 'mongoose';
import {UserCreateRequestDto} from '../request/UserCreateRequestDto';

export interface UserIDResponseDto extends UserCreateRequestDto {
  _id: mongoose.Schema.Types.ObjectId;
}
