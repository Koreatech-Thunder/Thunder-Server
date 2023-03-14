import { Request, Response, NextFunction } from 'express';
import statusCode from '../modules/statusCode';
import jwtHandler from '../modules/jwtHandler';
import tokenStatus from '../modules/tokenStatus';
import { JwtPayload } from 'jsonwebtoken';
import User from '../models/User';


const auth = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.body["accessToken"];

    if (!accessToken) { //액세스 토큰 없으면 에러.
        return res.status(statusCode.UNAUTHORIZED).send(statusCode.UNAUTHORIZED);
    }


    try {
        const decodedToken = jwtHandler.verifyToken(accessToken as string);
        console.log(decodedToken)

        if (decodedToken === tokenStatus.EXPIRED_TOKEN) { //액세스 토큰 만료되면 에러.
            return res.status(statusCode.UNAUTHORIZED).send(statusCode.UNAUTHORIZED);
        }


        if (decodedToken === tokenStatus.INVALID_TOKEN) { //액세스 토큰 유효하지 않으면 에러.
            return res.status(statusCode.UNAUTHORIZED).send(statusCode.UNAUTHORIZED);
        }

        const userId = (decodedToken as JwtPayload).user; //액세스 토큰에서 userId 뽑아냄.
        if(!userId) { //userId가 없으면 에러.
            return res.status(statusCode.NOT_FOUND).send(statusCode.NOT_FOUND);
        }

        const user = await User.findById(userId.id);
        if (!user) { //userId는 있지만 해당 id를 가진 유저 정보가 없으면 에러.
            return res.status(statusCode.NOT_FOUND).send(statusCode.NOT_FOUND);
        }


        req.body["userId"] = userId.id; //userId 뽑아서 바디에 저장하고 다음으로 넘김.

        next();
    }

    catch (error: any) {
        console.log(error);

        if (error.name === "TokenExpiredError") {
            return res.status(statusCode.UNAUTHORIZED).send(statusCode.UNAUTHORIZED);
        }
    }
    
}


export default { 
    auth,
}