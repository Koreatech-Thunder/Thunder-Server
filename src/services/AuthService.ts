import axios from "axios";
import jwt from "jsonwebtoken";
import UserService from "./UserService";
import User from "../models/User";
import jwtHandler from "../modules/jwtHandler";
import errorGenerator from "../errors/errorGenerator";
import statusCode from "../modules/statusCode";
import tokenStatus from "../modules/tokenStatus";
import { AuthResponseDto } from "../interfaces/auth/AuthResponseDto";

const login = async (kakaoToken: string, fcmToken: string) => {
  try {
    const result = await axios.get("https://kapi.kakao.com/v2/user/me", {
      //클라에서 받은 카카오 토큰으로 카카오 서버에서 정보 받아오기
      headers: {
        Authorization: `Bearer ${kakaoToken}`,
      },
    });

    if (!result) {
      throw errorGenerator({
        msg: "카카오 서버에서 값을 받아오지 못했습니다.",
        statusCode: statusCode.NOT_FOUND,
      });
    }

    const { data } = result;
    const kakaoId = data.id;

    const existUser = await UserService.findUserByKakao(kakaoId); //유저 여부는 User 스키마의 kakaoId 필드로 구분.

    if (existUser) {
      await UserService.updateUser(existUser._id, {
        isLogOut: false,
        fcmToken: fcmToken,
      }); 
      
      throw errorGenerator({
        msg: "이미 존재하는 유저입니다.",
        statusCode: statusCode.CONFLICT,
      }); // 이미 존재하는 유저면 에러 메시지 대신 보냄
    } else {
      //존재하지 않는 유저면 일단 create하고 accessToken과 refreshToken을 jwt 암호화하여 보냄.
      const user = new User({
        kakaoId: kakaoId,
        fcmToken: fcmToken,
        isLogOut: false,
      });

      await user.save();

      console.log(user._id)

      const accessToken = jwtHandler.getAccessToken(user._id);
      const refreshToken = jwtHandler.getRefreshToken();

      const tokenData: AuthResponseDto = {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };

      return tokenData;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const refresh = async (accessToken: string, refreshToken: string) => {
  const newAccessToken = jwtHandler.verifyToken(accessToken);
  const newRefreshToken = jwtHandler.verifyToken(refreshToken);
  const decoded = jwt.decode(accessToken);

  if (
    newAccessToken === tokenStatus.INVALID_TOKEN ||
    newRefreshToken === tokenStatus.INVALID_TOKEN
  ) {
    return tokenStatus.INVALID_TOKEN;
  }

  const userId = (decoded as any).user.id;

  if (newAccessToken === tokenStatus.EXPIRED_TOKEN) {
    if (newRefreshToken === tokenStatus.EXPIRED_TOKEN) {
      return tokenStatus.ALL_TOKENS_HAS_EXPIRED;
    } else {
      const newToken = jwtHandler.getAccessToken(userId);

      const data = {
        accessToken: newToken,
        refreshToken: refreshToken,
      };

      return data;
    }
  } else {
    return tokenStatus.VALID_TOKEN;
  }
};

const logout = async (userId: string, fcmToken: string) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw errorGenerator({
        msg: "유저 정보가 없습니다.",
        statusCode: statusCode.NOT_FOUND,
      });
    }

    if (user?.isLogOut) {
      throw errorGenerator({
        msg: "이미 로그아웃된 회원입니다.",
        statusCode: statusCode.BAD_REQUEST,
      });
    }

    if (!user.fcmToken.includes(fcmToken)) {
      //fcm 토큰이 없으면?
      throw errorGenerator({
        msg: "FCM 토큰을 찾을 수 없습니다.",
        statusCode: statusCode.NOT_FOUND,
      });
    }


    await UserService.updateUser(userId, {
      isLogOut: true,
      fcmToken: "NoToken",
    }); //로그아웃 여부 true로 변경하고 fcm 토큰은 다음에 다시 로그인할때 새로 받기 전까지 삭제.
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
  login,
  refresh,
  logout,
};
