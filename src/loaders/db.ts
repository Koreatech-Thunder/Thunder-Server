import mongoose from 'mongoose';
import config from '../config';

import * as firebase from 'firebase-admin';
import errorGenerator from '../errors/errorGenerator';
import statusCode from '../modules/statusCode';
import message from '../modules/message';

const connectDB = async () => {
  try {
    const firebaseKey = require('../config/firebasekey.json');

    if (!firebaseKey) {
      throw errorGenerator({
        msg: message.NOT_FOUND_FCM,
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
  } catch (err: any) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;
