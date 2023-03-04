import mongoose from "mongoose";
import { UserInfo } from "../interfaces/user/UserInfo";


const UserSchema = new mongoose.Schema( {
    name: {
        type: String,
        default: ''
    },
    introduction: {
        type: String,
        default: ''
    },
    mannerTemperature: {
        type: Number,
        required: true,
        default: 36.5
    },
    hashtags: {
        type: [String],
        default: []
    },
    isLogout: {
        type: Boolean,
        default: true
    },
    kakaoId: {
        type: Number
    },
    kakaoToken: {
        type: String
    },
    fcmToken: {
        type: String
    }

});



export default mongoose.model<UserInfo & mongoose.Document>("User", UserSchema);