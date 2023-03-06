import statusCode from '../modules/statusCode';


import { UserService } from "../services";
import { Request, Response } from "express";



const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    try {
        await UserService.deleteUser(userId);

        res.status(statusCode.NO_CONTENT).send(statusCode.OK);

    }
    catch (error) {
        console.log(error);
        res.status(statusCode.INTERNAL_SERVER_ERROR).send(statusCode.INTERNAL_SERVER_ERROR);
    }
}


export default {
    deleteUser,
}