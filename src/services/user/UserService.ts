import User from '../../models/User';
//import axios from 'axios';
import errorGenerator from '../../errors/errorGenerator';
import statusCode from '../../modules/statusCode';
import {UserInfoDto} from '../../interfaces/user/UserInfoDto';
import {UserResponseDto} from '../../interfaces/user/UserResponseDto';
import {UserCreateDto} from '../../interfaces/user/UserCreateDto';
import {PostBaseResponseDto} from '../../interfaces/common/PostBaseResponseDto';
import UserServiceUtils from './UserServiceUtils';
import {UserHashtagResponseDto} from '../../interfaces/user/UserHashtagResponseDto';

/*
const deleteUser = async (userId: string) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw errorGenerator({
        msg: '유저 정보를 불러올 수 없습니다.',
        statusCode: statusCode.NOT_FOUND,
      });
    }

    await axios.post('https://kapi.kakao.com/v2/user/unlink', {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
    });

    await User.findByIdAndDelete(userId);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
 */
const getUserForProfileUpdate = async (userId: any) => {
  try {
    const data: UserInfoDto | null = await User.findById(userId);

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const createUser = async (
  userCreateDto: UserCreateDto,
  userId: string,
): Promise<PostBaseResponseDto> => {
  try {
    await UserServiceUtils.findExistUserById(userId);

    const existUsername = await User.findOne({
      name: userCreateDto.name,
    });
    if (existUsername) {
      throw errorGenerator({
        msg: '사용자 닉네임 중복입니다.',
        statusCode: statusCode.CONFLICT,
      });
    }

    const user = new User({
      name: userCreateDto.name,
      hashtags: userCreateDto.hashtags,
    });

    await user.save();

    const data = {
      _id: user._id,
    };

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const findUserHashtag = async (
  userId: string,
): Promise<UserHashtagResponseDto> => {
  try {
    await UserServiceUtils.findUserById(userId);

    const user: UserResponseDto = await User.findById(userId)!;

    if (!user) {
      throw errorGenerator({
        msg: '조회할 사용자 정보가 없습니다.',
        statusCode: statusCode.NOT_FOUND,
      });
    }

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
  //deleteUser,
  getUserForProfileUpdate,
  createUser,
  findUserHashtag,
};
