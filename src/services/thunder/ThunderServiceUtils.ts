import errorGenerator from '../../errors/errorGenerator';
import {ThunderInfo} from '../../interfaces/thunder/ThunderInfo';
import Thunder from '../../models/Thunder';
import statusCode from '../../modules/statusCode';

const findMemberById = async (userId: string, list: any): Promise<string> => {
  var i = 0;
  if (list[0].toString() == userId) {
    return 'HOST';
  }
  for (i = 1; i < list.length; i++) {
    if (list[i].toString() == userId) {
      return 'MEMBER';
    }
  }
  return 'NON_MEMBER';
};

const findThunderById = async (thunderId: string): Promise<ThunderInfo> => {
  const thunder = await Thunder.findById(thunderId);
  if (!thunder) {
    throw errorGenerator({
      msg: '존재하지 않는 방입니다.',
      statusCode: statusCode.NOT_FOUND,
    });
  }
  return thunder;
};

export default {
  findMemberById,
  findThunderById,
};
