import User from '../../models/User';
import statusCode from '../../modules/statusCode';
import message from '../../modules/statusCode';
import errorGenerator from '../../errors/errorGenerator';

const findUserById = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw errorGenerator({
      msg: '유효하지 않은 id입니다.',
      statusCode: statusCode.UNAUTHORIZED,
    });
  }
  return user;
};

const findExistUserById = async (userId: string) => {
  const user = await User.findById(userId);
  if (user) {
    throw errorGenerator({
      msg: '이미 가입한 사용자입니다.',
      statusCode: statusCode.CONFLICT,
    });
  }
  return user;
};

export default {
  findUserById,
  findExistUserById,
};
