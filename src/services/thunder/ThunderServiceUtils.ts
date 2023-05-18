import errorGenerator from '../../errors/errorGenerator';
import {ThunderInfo} from '../../interfaces/thunder/ThunderInfo';
import Thunder from '../../models/Thunder';
import message from '../../modules/message';
import statusCode from '../../modules/statusCode';

const getMemberById = async (userId: string, list: any): Promise<string> => {
  var i = 0;
  if (list[0]._id.toString() == userId) {
    return 'HOST';
  }
  for (i = 1; i < list.length; i++) {
    if (list[i]._id.toString() == userId) {
      return 'MEMBER';
    }
  }
  return 'NON_MEMBER';
};

const getThunderOneById = async (thunderId: string): Promise<ThunderInfo> => {
  const thunder = await Thunder.findById(thunderId);

  if (!thunder) {
    throw errorGenerator({
      msg: message.NOT_FOUND_ROOM,
      statusCode: statusCode.NOT_FOUND,
    });
  }
  return thunder;
};

export default {
  getMemberById,
  getThunderOneById,
};
