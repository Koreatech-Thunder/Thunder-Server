import User from '../../models/User';
import statusCode from '../../modules/statusCode';
import message from '../../modules/statusCode';
import errorGenerator from '../../errors/errorGenerator';
import Thunder from '../../models/Thunder';
import {UserResponseDto} from '../../interfaces/user/UserResponseDto';
import {UserInfo} from '../../interfaces/user/UserInfo';

const findUserById = async (userId: string): Promise<UserInfo> => {
  const user = await User.findById(userId);
  if (!user) {
    throw errorGenerator({
      msg: '유효하지 않은 id입니다.',
      statusCode: statusCode.UNAUTHORIZED,
    });
  }
  return user;
};

export default {
  findUserById,
};
