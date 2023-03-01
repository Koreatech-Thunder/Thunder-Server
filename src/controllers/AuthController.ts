import statusCode from '../modules/statusCode';
import { Request, Response } from "express";
import AuthService from '../services/AuthService';
import firebase from 'firebase-admin';



const login = async (req: Request, res: Response): Promise<void> => {

    const firebaseKey = require('./koreatechthunder-80a11-firebase-adminsdk-we3dy-ba336957d9.json');

    firebase.initializeApp({
        credential: firebase.credential.cert(firebaseKey),
    });

    const fcmToken = req.headers["fcmToken"];
    const kakaoToken = req.headers["kakaoToken"];
    
    const accessToken = await AuthService.login(kakaoToken, fcmToken);

    try {
        res.status(statusCode.OK).json({accessToken: accessToken});
    }

    catch (error) {
        if (Error.name === 'User Already Exists') {
            res.status(statusCode.CONFLICT).send(statusCode.CONFLICT);
        }
        else res.status(statusCode.INTERNAL_SERVER_ERROR).send(statusCode.INTERNAL_SERVER_ERROR);
    }

}

const refresh = async (req: Request, res: Response): Promise<void> => {

    const userId = req.headers["userId"]
    const fcmRefreshToken = req.headers["fcmRefreshToken"];
    const kakaoRefreshToken = req.headers["kakaoRefreshToken"];

    const accessToken = await AuthService.refresh(kakaoRefreshToken, fcmRefreshToken);

    try {
        res.status(statusCode.OK).json({accessToken: accessToken});
    }

    catch (error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR).send(statusCode.INTERNAL_SERVER_ERROR);
    }
}

const logout = async (req: Request, res: Response): Promise<void> => {

    const userId = req.headers["userId"];
    const kakaoToken = req.headers["kakaoToken"];

    try {
        await AuthService.logout(userId, kakaoToken);
    }
    catch (error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR).send(statusCode.INTERNAL_SERVER_ERROR);
    }
} 

export default {
    login,
    refresh,
    logout
}