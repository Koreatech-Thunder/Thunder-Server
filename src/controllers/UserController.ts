import express, { Request, Response } from 'express';
import { UserCreateDto } from '../interfaces/user/UserCreateDto';
import { PostBaseResponseDto } from '../interfaces/common/PostBaseResponseDto';
import statusCode from '../modules/statusCode';
import UserService from '../services/UserService';

/**
 *
 * @route PUT / user
 * @desc Create User
 * @access Public
 */
const createUser = async (req: Request, res: Response): Promise<void> => {
  const userCreateDto: UserCreateDto = req.body;

  try {
    const data: PostBaseResponseDto = await UserService.createUser(
      userCreateDto,
    );

    res.status(statusCode.CREATED).send(data);
  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send();
  }
};

export default {
  createUser,
};
