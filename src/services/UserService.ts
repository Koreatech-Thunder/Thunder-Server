import { UserUpdateDto } from "../interfaces/user/UserUpdateDto";
import { UserResponseDto } from "../interfaces/user/UserResponseDto";
import User from "../models/User";
import errorGenerator from '../errors/errorGenerator';
import statusCode from '../modules/statusCode';
import { UserInfoDto } from '../interfaces/user/UserInfoDto';
import { UserNoticeBaseDto } from '../interfaces/user/UserAlarmBaseDto';

import * as firebase from "firebase-admin";

const updateUser = async (userId: any, userUpdateDto: UserUpdateDto) => {
  try {
    const updatedUser = {
      name: userUpdateDto.name,
      introduction: userUpdateDto.introduction,
      mannerTemperature: userUpdateDto.mannerTemperature,
      hashtags: userUpdateDto.hashtags,
      isLogOut: userUpdateDto.isLogOut,
      kakaoId: userUpdateDto.kakaoId,
      fcmToken: userUpdateDto.fcmToken,
    };

    await User.findByIdAndUpdate(userId, updatedUser);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const findUserById = async (userId: string) => {
  try {
    const user: UserResponseDto | null = await User.findById(userId);

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const findUserByKakao = async (kakaoId: any) => {
  try {
    const user: UserResponseDto | null = await User.findOne({
      kakaoId: kakaoId,
    });

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};



const deleteUser = async (userId: string) => {
    try {

        const user = await User.findById(userId);

        if (!user) {
            throw errorGenerator({
                msg: '유저 정보를 불러올 수 없습니다.',
                statusCode: statusCode.NOT_FOUND
            })
        }

        await User.findByIdAndDelete(userId);

    } catch (error) {
        console.log(error);
        throw (error);
    };
};


const getUserForProfileUpdate = async (userId: any) => {

    try {
        const data: UserInfoDto | null = await User.findById(userId);

        return data;
    }

    catch (error) {
        console.log(error);
        throw (error);
    }
    

}

const pushAlarmToUser = async (userNoticeBaseDto: UserNoticeBaseDto) => {
  try {
    const user = await User.findById(userNoticeBaseDto.userId);
    if (!user) {
      return null;
    }

    if (user.isLogOut === true) {
      throw errorGenerator({
        msg: '로그아웃한 유저입니다.',
        statusCode: statusCode.BAD_REQUEST
      })
    }

    let alarm = {
        notification: {
          title: pushMessageTemplate.title,
          body: pushMessageTemplate.body,
        },
        token: user.fcmToken as string
      };

    firebase
      .messaging()
      .send(alarm)
      .then(function (res) {
        console.log("성공적으로 메시지 발송 완료: ", res)
      })
      .catch(function (err) {
        console.log('다음 메시지를 보내는 데 에러 발생: ', err)
        throw errorGenerator({
          msg: 'FCM 메시지 오류.',
          statusCode: statusCode.INTERNAL_SERVER_ERROR
        })
      })


  } catch (error) {
    console.log(error);
    throw error;
  }
}

export default {
  updateUser,
  findUserById,
  findUserByKakao,
  deleteUser,
  getUserForProfileUpdate,
  pushAlarmToUser,
};
