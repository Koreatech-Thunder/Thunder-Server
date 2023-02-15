import { PostBaseResponseDto } from '../interfaces/common/PostBaseResponseDto';
import { UserCreateDto } from '../interfaces/user/UserCreateDto';
import User from '../models/User';

const createUser = async (
  userCreateDto: UserCreateDto,
): Promise<PostBaseResponseDto> => {
  try {
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

export default {
  createUser,
};
