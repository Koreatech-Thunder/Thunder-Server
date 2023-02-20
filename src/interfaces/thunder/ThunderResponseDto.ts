import mongoose from "mongoose";
import { ThunderCreateDto } from "./ThunderCreateDto";

export interface ThunderResponseDto extends ThunderCreateDto {
    _id: mongoose.Schema.Types.ObjectId;
}