import mongoose from 'mongoose';
import {UserCreateDto} from '../request/UserCreateRequestDto';

export interface UserResponseDto extends UserCreateDto {
  _id: mongoose.Schema.Types.ObjectId;
}
