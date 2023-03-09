import statusCode from "../modules/statusCode";
import util from "../modules/util";

import { UserUpdateDto } from "../interfaces/user/UserUpdateDto";
import { UserResponseDto } from "../interfaces/user/UserResponseDto";
import { UserService } from "../services";
import { Request, Response } from "express";
import { UserInfoDto } from '../interfaces/user/UserInfoDto';

const updateUser = async (req: Request, res: Response): Promise<void> => {
  const userUpdateDto: UserUpdateDto = req.body;
  const { userId } = req.params;

  try {
    await UserService.updateUser(userId, userUpdateDto);
    res.status(statusCode.NO_CONTENT).send(util.success());
  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail());
  }
};

const findUserById = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  try {
    const data: UserResponseDto | null = await UserService.findUserById(userId);

    res.status(statusCode.OK).send(util.success(data));
  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail());
  }
};

const findUserByKakao = async (req: Request, res: Response): Promise<void> => {
  const { kakaoId } = req.params;

  try {
    const data: UserResponseDto | null = await UserService.findUserByKakao(
      kakaoId
    );
    res.status(statusCode.OK).send(util.success(data));
  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail());
  }
};

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


export default {
  updateUser,
  findUserById,
  findUserByKakao,
  deleteUser,
  getUserForProfileUpdate,
};
