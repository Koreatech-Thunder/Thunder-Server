import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { JwtPayloadInfo } from "../interfaces/common/JwtPayloadInfo";
import tokenStatus from "./tokenStatus";

const getAccessToken = (userId: mongoose.Schema.Types.ObjectId): string => {
  const payload: JwtPayloadInfo = {
    // 토큰에 담을 정보.
    user: {
      id: userId,
    },
  };

  const accessToken: string = jwt.sign(
    payload,
    process.env.JWT_SECRET as string,
    {}
  );

  return accessToken;
};

const getRefreshToken = (): string => {
  const refreshToken: string = jwt.sign(
    {},
    process.env.JWT_SECRET as string,
    {}
  ); //option은 토큰 만료 기간 등등 옵션 지정란...

  return refreshToken;
};

const verifyToken = (token: string) => {
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return tokenStatus.EXPIRED_TOKEN;
    } else {
      return tokenStatus.INVALID_TOKEN;
    }
  }

  return decoded;
};

export default {
  getAccessToken,
  getRefreshToken,
  verifyToken,
};
