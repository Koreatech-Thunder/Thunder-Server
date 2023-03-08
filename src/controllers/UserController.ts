import statusCode from "../modules/statusCode";
import util from "../modules/util";

import { UserUpdateDto } from "../interfaces/user/UserUpdateDto";
import { UserResponseDto } from "../interfaces/user/UserResponseDto";
import { UserService } from "../services";

import { Request, Response } from "express";

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

export default {
  updateUser,
  findUserById,
  findUserByKakao,
};
