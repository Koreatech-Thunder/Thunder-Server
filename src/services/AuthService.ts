import axios from 'axios';
import jwt from 'jsonwebtoken';
import UserService from './UserService';
import firebase from 'firebase-admin';
import message from '../modules/responseMessage';



const login = async (kakaoToken: any) => {
    const result = await axios.get("https://kapi.kakao.com/v2/user/me", {
        headers: {
            Authorization: `Bearer ${kakaoToken}`,
        },
    });

    const {data} = result;
    const kakaoId = data.id;
    const firebaseKey = require('./koreatechthunder-80a11-firebase-adminsdk-we3dy-ba336957d9.json');

    firebase.initializeApp({
        credential: firebase.credential.cert(firebaseKey),
    });

    const fcmToken = '여기에 fcm 토큰 입력';
    const fcmMessage = {
        notification: {
            title: 'test data',
            body: 'To test cloud message sending via firebase.'
        },
        token: fcmToken
    }; //테스트용 코드

    firebase.messaging().send(fcmMessage)
        .then((response) => {
        console.log('Successfully sent message as:', response);
    })
    .catch((error) => {
        console.log('Error sending message:', error);
        throw(error);
    });
    

    if (!kakaoId) {
        return new Error('BAD REQUEST');
    }
    else { 
        try {
            console.log(kakaoId);
            const user = await UserService.findUserByKakao(kakaoId);

            console.log(user);

            if (!user) {
                return new Error('No User Found');
            }


            const token = jwt.sign({kakao_Id: user.kakaoId, fcm_token: fcmToken}, process.env.JWT_SECRET as string, {});

            return token;

        }

        catch (error) {
            console.log(error);
            throw(error);
        }
    }
}

const verifyToken = async (req: any, res: any, next: any) => {
    try {
        req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET as string);
        return next();
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            return res.status(419).json({
                code: 419,
                message: '토큰이 만료되었습니다.'
            });
        }
        return res.status(401).json({
            code: 401,
            message: '유효하지 않은 토큰입니다.'
        })
    }
}

export default {
    login,
    verifyToken
}