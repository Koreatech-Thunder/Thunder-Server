import Thunder from '../../models/Thunder';
import errorGenerator from '../../errors/errorGenerator';
import statusCode from '../../modules/statusCode';
import {ThunderResponseDto} from '../../interfaces/thunder/ThunderResponseDto';

const findMemberById = async (userId: string, list: string[]) => {
  for (var i = 0; i < list.length; i++) {
    if (list[0] == userId) {
      return 1;
    } else if (list[i] == userId) {
      return 2;
    } else {
      return 0;
    }
  }
};

export default {
  findMemberById,
};
