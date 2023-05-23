import * as firebase from 'firebase-admin';
import errorGenerator from '../errors/errorGenerator';
import statusCode from './statusCode';
import User from '../models/User';
import message from './message';

const pushAlarmToUser = async (
  userId: string,
  title: string,
  body: string,
  thunderId?: string,
): Promise<void> => {
  console.log('Alarm for thunderId: ', thunderId);

  try {
    const user = await User.findById(userId);
    if (!user) {
      return null;
    }

    if (user.isLogOut === true) {
      throw errorGenerator({
        msg: message.USER_ALREADY_LOGOUT,
        statusCode: statusCode.BAD_REQUEST,
      });
    }

    let alarm = {
      data: {
        title: title,
        body: body,
        thunderId: thunderId,
      },
      token: user.fcmToken as string,
    };

    console.log('alarm token: ', alarm.token);

    firebase
      .messaging()
      .send(alarm)
      .then(function (res: any) {
        console.log('성공적으로 메시지 발송 완료: ', res);
        console.log('\ntitle: ' + title + '\nbody: ' + body);
      })
      .catch(function (err: any) {
        console.log('다음 메시지를 보내는 데 에러 발생: ', err);
        console.log('\ntitle: ' + title + '\nbody: ' + body);

        throw errorGenerator({
          msg: message.FCM_ERROR,
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
        });
      });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
  pushAlarmToUser,
};
