import statusCode from '../modules/statusCode';
import util from "../modules/util";
import message  from "../modules/responseMessage";


import { UserCreateDto } from "../interfaces/user/UserCreateDto";
import { UserUpdateDto } from "../interfaces/user/UserUpdateDto";
import { UserResponseDto } from '../interfaces/user/UserResponseDto';
import { PostBaseResponseDto } from "../interfaces/common/PostBaseResponseDto";
import { UserService } from "../services";


import { Request, Response } from "express";
import { UserInfoDto } from '../interfaces/user/UserInfoDto';


const createUser = async (req: Request, res: Response): Promise<void> => {
    const userCreateDto: UserCreateDto = req.body;

    try {
        const data: PostBaseResponseDto = await UserService.createUser(userCreateDto);

        res.status(statusCode.CREATED).send(data);

    }
    catch (error) {
        console.log(error);
        res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail());
    }
}

const updateUser = async (req: Request, res: Response): Promise<void> => {
    const userUpdateDto: UserUpdateDto = req.body;
    const { userId } = req.params;

    try {
        await UserService.updateUser(userId, userUpdateDto);
        res.status(statusCode.NO_CONTENT).send(util.success());

    }
    catch (error) {
        console.log(error);
        res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail());
    }
}

const findUserById = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    try {
        const data: UserResponseDto | null = await UserService.findUserById(userId);

        res.status(statusCode.OK).send(util.success(data));

    }
    catch (error) {
        console.log(error);
        res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail());
    }
}

const findUserList = async (res: Response): Promise<void> => {
    try {
        const data: UserResponseDto[] | null = await UserService.findUserList();

        res.status(statusCode.OK).send(util.success(data));

    }
    catch (error) {
        console.log(error);
        res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail());
    }
}

const findUserByKakao = async (req: Request, res: Response): Promise<void> => {
    const { kakaoId } = req.params;

    try {
        const data: UserResponseDto | null = await UserService.findUserByKakao(kakaoId);
        
        res.status(statusCode.OK).send(util.success(data));

    } catch (error)
    {
        console.log(error);
        res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail());
    }

}

const getUserForProfileUpdate = async (req: Request, res: Response): Promise<void> => {

    const { userId } = req.params;

    try {
        const data: UserInfoDto | null = await UserService.getUserForProfileUpdate(userId);

        res.status(statusCode.OK).send(data);
    }

    catch (error) {
        res.status(statusCode.INTERNAL_SERVER_ERROR).send(statusCode.INTERNAL_SERVER_ERROR);
    }
    

}

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
    createUser,
    updateUser,
    findUserById,
    findUserList,
    deleteUser,
    findUserByKakao,
    getUserForProfileUpdate
}