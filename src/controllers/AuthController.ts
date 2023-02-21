import statusCode from '../modules/statusCode';
import util from "../modules/util";

import { Request, Response } from "express";
import AuthService from '../services/AuthService';
import firebase from 'firebase-admin';



const login = async (req: Request, res: Response): Promise<void> => {
    const headers = req.headers["authorization"];
    const kakaoToken = headers?.split(" ")[1];

    const firebaseKey = require('./koreatechthunder-80a11-firebase-adminsdk-we3dy-ba336957d9.json');

    firebase.initializeApp({
        credential: firebase.credential.cert(firebaseKey),
    });

    const fcmToken = '여기에 fcm 토큰 입력';
    
    const accessToken = await AuthService.login(kakaoToken, fcmToken);

    try {
        res.status(statusCode.OK).json({accessToken: accessToken});
    }

    catch (error) {
        if (Error.name === 'No User Found') {
            res.status(statusCode.NOT_FOUND).send();
        }
        else res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail());
    }

}

const refresh = async (req: Request, res: Response): Promise<void> => {

    const headers = req.headers["authorization"];
    const refreshToken = headers?.split(" ")[4];

    const accessToken = await AuthService.refresh(refreshToken);

    try {
        res.status(statusCode.OK).json({accessToken: accessToken});
    }

    catch (error) {
        if (Error.name === 'No User Found') {
            res.status(statusCode.NOT_FOUND).send();
        }
        else res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail());
    }
}

const logout = async (req: Request, res: Response): Promise<void> => {

    try {
        await AuthService.logout(req);
    }
    catch (error) {
        if (Error.name === 'No User Found') {
            res.status(statusCode.NOT_FOUND).send();
        }
        else res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail());
    }
} 

export default {
    login,
    refresh,
    logout
}