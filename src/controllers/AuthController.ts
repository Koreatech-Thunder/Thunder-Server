import statusCode from '../modules/statusCode';
import util from "../modules/util";

import { Request, Response } from "express";
import AuthService from '../services/AuthService';



const login = async (req: Request, res: Response): Promise<void> => {
    const headers = req.headers["authorization"];
    const kakaoToken = headers?.split(" ")[1];
    
    const accessToken = await AuthService.login(kakaoToken);

    try {
        res.status(statusCode.OK).json({accessToken: accessToken});
    }

    catch (error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail());
    }

}

const refresh = async (req: Request, res: Response): Promise<void> => {
    
}

export default {
    login
}