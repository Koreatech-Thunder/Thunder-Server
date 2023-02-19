import express, { Request, Response } from 'express';
import { UserCreateDto } from '../interfaces/user/UserCreateDto';
import { UserResponseDto } from '../interfaces/user/UserResponseDto';
import { PostBaseResponseDto } from '../interfaces/common/PostBaseResponseDto';
import statusCode from '../modules/statusCode';
import UserService from '../services/UserService';

/**
 *
 * @route PUT / user
 * @desc Create User information at login View
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

/**
 *
 * @route GET / user/hashtags/:userId
 * @desc Read User information at main View
 * @access Public
 */
const findUserHashtag = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  try {
    const data: string[] | null = await UserService.findUserHashtag(userId);

    res.status(statusCode.OK).send(data);
  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send();
  }
};

export default {
  createUser,
  findUserHashtag,
};
