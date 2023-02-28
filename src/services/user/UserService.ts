import {PostBaseResponseDto} from '../../interfaces/common/PostBaseResponseDto';
import {UserCreateDto} from '../../interfaces/user/request/UserCreateDto';
import {UserResponseDto} from '../../interfaces/user/response/UserResponseDto';
import User from '../../models/User';
import statusCode from '../../modules/statusCode';
import message from '../../modules/statusCode';
import errorGenerator from '../../errors/errorGenerator';
import UserServiceUtils from './UserServiceUtils';

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

const findUserHashtag = async (userId: string): Promise<string[]> => {
  try {
    await UserServiceUtils.findUserById(userId);

    const user: UserResponseDto = await User.findById(userId)!;

    if (!user) {
      throw errorGenerator({
        msg: '조회할 사용자 정보가 없습니다.',
        statusCode: statusCode.NOT_FOUND,
      });
    }

    return user.hashtags;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
  createUser,
  findUserHashtag,
};
