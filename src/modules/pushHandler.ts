import * as firebase from "firebase-admin";
import errorGenerator from "../errors/errorGenerator";
import statusCode from "./statusCode";
import User from "../models/User";


const pushAlarmToUser = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return null;
    }

    if (user.isLogOut === true) {
      throw errorGenerator({
        msg: '로그아웃한 유저입니다.',
        statusCode: statusCode.BAD_REQUEST
      })
    }

    let alarm = {
        notification: {
          title: pushMessageTemplate.title,
          body: pushMessageTemplate.body,
        },
        token: user.fcmToken as string
      };

    firebase
      .messaging()
      .send(alarm)
      .then(function (res: any) {
        console.log("성공적으로 메시지 발송 완료: ", res)
      })
      .catch(function (err: any) {
        console.log('다음 메시지를 보내는 데 에러 발생: ', err)
        throw errorGenerator({
          msg: 'FCM 메시지 오류.',
          statusCode: statusCode.INTERNAL_SERVER_ERROR
        })
      })


  } catch (error) {
    console.log(error);
    throw error;
  }
}

export default {
  pushAlarmToUser,

}