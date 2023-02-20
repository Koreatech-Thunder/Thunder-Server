import mongoose from "mongoose";
import { ThunderInfo } from "../interfaces/thunder/ThunderInfo";
import moment from "moment-timezone"


const getCurrentTime = () => {

    moment.tz.setDefault("Asia/Seoul"); // 타임존 서울로 설정.
    return moment().format("YYYY-MM-DD HH:mm:ss");
}



const ThunderSchema = new mongoose.Schema( {
    host: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User",
    },
    title: { // 최대길이 1, 최소길이 20. 필수입력.
        type: String,
        required: true,
        minlength: 1,
        maxlength: 20
    },
    hashtags: { // 해쉬태그 최대선택개수 4, 최소 1개는 선택.
        type: [String],
        minlength: 1,
        maxlength: 4,
        required: true
    },
    limitPlayerCount: {  // 인원제한. 최소 한 명은 참여.
        type: Number,
        min: 2,
        required: true
    },
    deadline: { // 약속 시간
        type: String,
        required: true
    },
    content: { // 게시글 내용. 최대 150자. 필수내역 아님.
        type: String,
        maxlength: 150
    },
    createdAt: { // 생성시간. 기본값은 현재 PC 시간.
        type: Date,
        required: true,
        default: getCurrentTime()
    },
    updatedAt: { // 최종 수정시간. 생성 시에는 현재 PC 시간으로 초기화.
        type: Date,
        required: true,
        default: getCurrentTime()
    },
    members: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User"
    }
});


export default mongoose.model< ThunderInfo & mongoose.Document>("Thunder",  ThunderSchema);