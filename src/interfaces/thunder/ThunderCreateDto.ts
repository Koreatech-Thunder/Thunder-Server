import { UserInfo } from "../user/UserInfo";
import mongoose from "mongoose";

export interface ThunderCreateDto {
    host: mongoose.Types.ObjectId; // 작성자 ID == 방장
    title: String;
    hashtags: [String];
    limitPlayerCount: Number;
    deadline: String; // 번개 날짜 (기한)
    content?: String; // 글 내용은 안 써도 상관없도록 함.
    createdAt: Date; // 기본값으로 현재 시간 및 날짜 주어짐. 직접 작성할 필요 없음.
    updatedAt: Date; // 기본값으로 현재 시간 및 날짜 주어짐. 직접 작성할 필요 없음.
    members: [mongoose.Schema.Types.ObjectId];
}