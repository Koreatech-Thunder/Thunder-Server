import statusCode from '../modules/statusCode';
import util from "../modules/util";


import { ThunderCreateDto } from "../interfaces/thunder/ThunderCreateDto";
import { PostBaseResponseDto } from "../interfaces/common/PostBaseResponseDto";
import { ThunderService } from "../services";
import { ThunderResponseDto } from '../interfaces/thunder/ThunderResponseDto';


import { Request, Response } from "express";


const createThunder = async (req: Request, res: Response): Promise<void> => {
    const thunderCreateDto: ThunderCreateDto = req.body;

    try {
        const data: PostBaseResponseDto = await ThunderService.createThunder(thunderCreateDto);

        res.status(statusCode.CREATED).send(util.success(data));

    }
    catch (error) {
        console.log(error);
        res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail());
    }
}

const getThunderList = async (req: Request, res: Response): Promise<void> => {

    try {
        const data: ThunderResponseDto[] | null = await ThunderService.getThunderList();

        res.status(statusCode.OK).send(util.success(data));

    }
    catch (error) {
        console.log(error);
        res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail());
    }
}

const getThunder = async (req: Request, res: Response): Promise<void> => {
    const { postId } = req.params;

    try {
        const data: ThunderResponseDto | null = await ThunderService.getThunder(postId);

        res.status(statusCode.OK).send(util.success(data));

    }
    catch (error) {
        console.log(error);
        res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail());
    }
}

const getThunderByHashtags = async (req: Request, res: Response): Promise<void> => {
    const { tag } = req.params;

    try {
        const data: ThunderResponseDto[] | null = await ThunderService.getThunderByHashtags(tag);
        res.status(statusCode.OK).send(util.success(data));
    }

    catch (error) {
        console.log(error);
        res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail());
    }
} 


export default {
    createThunder,
    getThunderList,
    getThunder,
    getThunderByHashtags
}