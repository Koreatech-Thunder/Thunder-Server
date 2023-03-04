import axios from 'axios';
import jwt from 'jsonwebtoken';
import UserService from './UserService';
import User from '../models/User';
import jwtHandler from '../modules/jwtHandler';
import errorGenerator from '../errors/errorGenerator';
import statusCode from '../modules/statusCode';




const login = async (kakaoToken: string, fcmToken: string) => {
    try {

        const result = await axios.get("https://kapi.kakao.com/v2/user/me", { //클라에서 받은 카카오 토큰으로 카카오 서버에서 정보 받아오기
            headers: {
                Authorization: `Bearer ${kakaoToken}`,
            },
        });

        if (!result) {
            throw errorGenerator({
                msg: '카카오 서버에서 값을 받아오지 못했습니다.',
                statusCode: statusCode.NOT_FOUND,
            });
        }

        const { data } = result;
        const kakaoId = data.id;

        const existUser = await UserService.findUserByKakao(kakaoId); //유저 여부는 User 스키마의 kakaoId 필드로 구분.

        if (existUser) {
            if (!existUser.fcmToken.includes(fcmToken)) { // 다른 기기에서 로그인했다면
                existUser.fcmToken.push(fcmToken);
            }
            throw errorGenerator({
                msg: '이미 존재하는 유저입니다.',
                statusCode: statusCode.CONFLICT,
            }); // 이미 존재하는 유저면 에러 메시지 대신 보냄
        }
        else { //존재하지 않는 유저면 일단 create하고 accessToken이랑 refreshToken을 AuthResponseDto로 묶어서 보냄.
            const user = new User({
                kakaoId: kakaoId,
                fcmToken: fcmToken,
                isLogout: false
            })

            user.accessToken = jwtHandler.getAccessToken(user._id);
            user.refreshToken = jwtHandler.getRefreshToken();

            await user.save();

            
            const accessToken = user.accessToken;
            return accessToken;
        }
        } catch (error) {
            console.log(error);
            throw(error);
        }
}

const refresh = async (accessToken: string, refreshToken: string) => {

    const newAccessToken = jwtHandler.verifyToken(accessToken);
    const newRefreshToken = jwtHandler.verifyToken(refreshToken);
    const decoded = jwt.decode(accessToken);

    if (newAccessToken === "Invalid" || newRefreshToken === "Invalid") {
        return "invalid_token";
    }

    const userId = (decoded as any).user.id;
    const user = await User.findById(userId);

    if (refreshToken !== user?.refreshToken) {
        return "invalid_token";
    }

    if (newAccessToken === "Expired") {
        if (newRefreshToken === "Expired") {
            return "all_tokens_has_expired";
        }
        else {
            const newToken = jwtHandler.getAccessToken(userId);

            const data = {
                accessToken: newToken,
                refreshToken: refreshToken
            }

            await UserService.updateUser(userId, data);

            return data;
        }
        
    }

    else {
        return "valid_token";
    }


}

const logout = async (userId: any, fcmToken: string, accessToken: string) => {
    try {

        const result = await axios.post( "https://kapi.kakao.com/v1/user/logout", { // 카카오 로그아웃 POST
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });
        
        const user = await UserService.findUserById(userId);

        if (user?.isLogOut) {
            throw errorGenerator({
                msg: '이미 로그아웃된 회원입니다.',
                statusCode: statusCode.BAD_REQUEST
            })
        }

        if (!user || !fcmToken) { //유저 정보도 없고 fcm토큰도 없으면
            return null;
        }

        if (!user.fcmToken.includes(fcmToken)) { //fcm 토큰이 없으면?
            throw errorGenerator({
                msg: 'FCM 토큰을 찾을 수 없습니다.',
                statusCode: statusCode.NOT_FOUND
            });
        }

        const fcmTokenForOtherDevices = user.fcmToken.filter((token) => token !== fcmToken); //이 기기에서의 fcm 토큰만 삭제.
    
    
        await UserService.updateUser(userId, { isLogout: true, fcmToken: fcmTokenForOtherDevices }) //로그아웃 여부 true로 변경하고 남은 fcm 토큰 유저 정보에 저장.

        return result; //카카오 로그아웃 결과 return
    } catch (error) {
        console.log(error)
        throw(error);
    }
}

export default {
    login,
    refresh,
    logout
}