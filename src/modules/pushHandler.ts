import * as firebase from 'firebase-admin';
import errorGenerator from '../errors/errorGenerator';
import statusCode from './statusCode';
import User from '../models/User';
import message from './message';
import {pushMessageTemplate} from './pushMessageTemplate';

const pushAlarmToUser = async (userId: string) => {
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
      notification: {
        title: pushMessageTemplate.title,
        body: pushMessageTemplate.body,
      },
      token: user.fcmToken as string,
    };

    firebase
      .messaging()
      .send(alarm)
      .then(function (res: any) {
        console.log('성공적으로 메시지 발송 완료: ', res);
      })
      .catch(function (err: any) {
        console.log('다음 메시지를 보내는 데 에러 발생: ', err);
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
