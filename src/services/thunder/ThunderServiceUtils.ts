import Thunder from '../../models/Thunder';
import errorGenerator from '../../errors/errorGenerator';
import statusCode from '../../modules/statusCode';
import {ThunderResponseDto} from '../../interfaces/thunder/ThunderResponseDto';

const findMemberById = async (
  userId: string,
  list: string[],
): Promise<string> => {
  var i = 0;
  if (list[0] == userId) {
    return 'HOST';
  }
  for (i = 1; i < list.length; i++) {
    if (list[i] == userId) {
      return 'MEMBER';
    }
  }
  return 'NON_MEMBER';
};

export default {
  findMemberById,
};
