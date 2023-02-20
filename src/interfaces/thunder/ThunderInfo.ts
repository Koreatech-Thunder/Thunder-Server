/* 게시글(번개) 데이터 모델 */

import mongoose from "mongoose";


export interface ThunderInfo {
    host: mongoose.Types.ObjectId; // 작성자 ID == 방장
    title: String; // 게시글 제목
    hashtags: [String]; // 해쉬태그 (String array)
    limitPlayerCount: Number; // 인원 제한
    deadline: String; // 번개 날짜 (기한)
    content: String; // 게시글 내용
    createdAt: Date; // 생성된 날짜
    updatedAt: Date; // 가장 최근에 수정된 날짜. 처음 생성 시에는 createdAt과 동일.
    members: [mongoose.Schema.Types.ObjectId];
}