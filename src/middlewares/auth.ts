import NextFunction from 'express';
import statusCode from '../modules/statusCode';
import jwtHandler from '../modules/jwtHandler';


const auth = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers["authorization"]?.split(" ").reverse[0];

    if (!accessToken) {
        return res.status(statusCode.UNAUTHORIZED).send(statusCode.UNAUTHORIZED);

    }

    try {
        const decodedToken = jwtHandler.verify(accessToken as string);

    }

    
}