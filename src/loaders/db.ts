import mongoose from 'mongoose';
import config from '../config';
import * as firebase from 'firebase-admin';
import errorGenerator from '../errors/errorGenerator';
import statusCode from '../modules/statusCode';
import User from '../models/User';

const connectDB = async () => {
  try {
    const firebaseKey = require('../config/firebasekey.json');

    if (!firebaseKey) {
      throw errorGenerator({
        msg: '파이어베이스 키가 존재하지 않습니다.',
        statusCode: statusCode.NOT_FOUND,
      });
    }

    // 파이어베이스 연결 에러 관련 코드. 0일 경우 초기화.
    if (!firebase.apps.length) {
      console.log('FCM Initializing...');
      firebase.initializeApp({
        credential: firebase.credential.cert(firebaseKey),
      });
    } else {
      firebase.app();
      console.log('파이어베이스 시작 준비 완료.');
    } //아닐 경우 파이어베이스 앱 시작.

    await mongoose.connect(config.mongoURI);

    mongoose.set('strictQuery', false);
    mongoose.set('autoCreate', true);

    console.log('Mongoose Connected ...');
    /*
    const user = await User.find({isLogOut: false});

    for (let i = 0; i < user.length; i++) {
      //서버 켜졌을 시 푸시알림 테스트용
      let alarm = {
        notification: {
          title: pushMessageTemplate.title,
          body: pushMessageTemplate.body,
        },
        token: user[i].fcmToken as string,
      };

      firebase
        .messaging()
        .send(alarm)
        .then(function (res) {
          console.log('성공적으로 메시지 발송 완료: ', res);
        })
        .catch(function (err) {
          console.log('다음 메시지를 보내는 데 에러 발생: ', err);
          throw errorGenerator({
            msg: 'FCM 메시지 오류.',
            statusCode: statusCode.INTERNAL_SERVER_ERROR,
          });
        });
    }
    */
  } catch (err: any) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;
