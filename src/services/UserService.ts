import {PostBaseResponseDto} from '../interfaces/common/PostBaseResponseDto';
import {UserCreateDto} from '../interfaces/user/UserCreateDto';
import {UserResponseDto} from '../interfaces/user/UserResponseDto';
import User from '../models/User';
import statusCode from '../modules/statusCode';
//import message from '../modules/statusCode';
import errorGenerator from '../errors/errorGenerator';

const createUser = async (
  userCreateDto: UserCreateDto,
): Promise<PostBaseResponseDto> => {
  try {
    const existUser = await User.findOne({
      name: userCreateDto.name,
    });
    if (existUser) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw errorGenerator({
        msg: '사용자 중복',
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

const findUserHashtag = async (userId: string): Promise<string[] | []> => {
  try {
    const user: UserResponseDto = await User.findById(userId);

    let data: string[] | [];
    if (user.hashtags != undefined && user.hashtags != null) {
      data = user.hashtags;
    } else {
      data = [];
    }

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
  createUser,
  findUserHashtag,
};
