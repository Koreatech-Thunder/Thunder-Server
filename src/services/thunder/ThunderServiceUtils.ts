import errorGenerator from '../../errors/errorGenerator';
import {ThunderInfo} from '../../interfaces/thunder/ThunderInfo';
import Thunder from '../../models/Thunder';
import message from '../../modules/message';
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
      msg: message.NOT_FOUND_ROOM,
      statusCode: statusCode.NOT_FOUND,
    });
  }
  return thunder;
};

const dateFormat = async (date: Date): Promise<string> => {
  let month: string | number = date.getMonth() + 1;
  let day: string | number = date.getDate();
  let hour: string | number = date.getUTCHours();
  let minute: string | number = date.getMinutes();

  month = month >= 10 ? month : '0' + month;
  day = day >= 10 ? day : '0' + day;
  hour = hour >= 10 ? hour : '0' + hour;
  minute = minute >= 10 ? minute : '0' + minute;

  return (
    date.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minute
  );
};

export default {
  findMemberById,
  findThunderById,
  dateFormat,
};
