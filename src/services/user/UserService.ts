import User from '../../models/User';
import {UserResponseDto} from '../../interfaces/user/UserResponseDto';
import errorGenerator from '../../errors/errorGenerator';
import statusCode from '../../modules/statusCode';
import {UserInfoDto} from '../../interfaces/user/UserInfoDto';
import {UserUpdateDto} from '../../interfaces/user/UserUpdateDto';
import UserServiceUtils from './UserServiceUtils';
import {UserHashtagResponseDto} from '../../interfaces/user/UserHashtagResponseDto';
import {UserInfo} from '../../interfaces/user/UserInfo';

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
        statusCode: statusCode.NOT_FOUND,
      });
    }

    await User.findByIdAndDelete(userId);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getUserForProfileUpdate = async (userId: string) => {
  try {
    const data: UserInfo | null = await User.findById(userId);

    if (!data) {
      throw errorGenerator({
        msg: '유저 정보를 불러오지 못했습니다.',
        statusCode: statusCode.NOT_FOUND,
      });
    }

    const result: UserInfoDto = {
      name: data.name,
      introduction: data.introduction,
      hashtags: data.hashtags,
    };

    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateUser = async (
  userUpdateDto: UserUpdateDto,
  userId: string,
): Promise<void> => {
  try {
    await UserServiceUtils.findUserById(userId);

    const existUsername = await User.findOne({
      name: userUpdateDto.name,
    });
    if (existUsername) {
      throw errorGenerator({
        msg: '사용자 닉네임 중복입니다.',
        statusCode: statusCode.CONFLICT,
      });
    }

    await User.findByIdAndUpdate(userId, userUpdateDto);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const findUserHashtag = async (
  userId: string,
): Promise<UserHashtagResponseDto> => {
  try {
    const user: UserInfo = await UserServiceUtils.findUserById(userId);

    const data: UserHashtagResponseDto = {
      hashtags: user.hashtags,
    };

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
  findUserById,
  findUserByKakao,
  deleteUser,
  getUserForProfileUpdate,
  updateUser,
  findUserHashtag,
};
