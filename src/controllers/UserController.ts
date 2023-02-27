import {Request, Response} from 'express';
import {Result, ValidationError, validationResult} from 'express-validator';
import {UserCreateDto} from '../interfaces/user/UserCreateDto';
//import { UserResponseDto } from '../interfaces/user/UserResponseDto';
import {PostBaseResponseDto} from '../interfaces/common/PostBaseResponseDto';
import statusCode from '../modules/statusCode';
import UserService from '../services/user/UserService';
import message from '../modules/message';

/**
 *
 * @route PUT / user
 * @desc Create User information at login View
 * @access Public
 */
const createUser = async (
  req: Request,
  res: Response,
): Promise<void | Response> => {
  const errors: Result<ValidationError> = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(statusCode.BAD_REQUEST).send(message.BAD_REQUEST);
  }

  const userCreateDto: UserCreateDto = req.body;
  const {userId} = req.params;

  try {
    const data: PostBaseResponseDto = await UserService.createUser(
      userCreateDto,
      userId,
    );

    res.status(statusCode.CREATED).send(statusCode.CREATED);
  } catch (error) {
    console.log(error);
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(statusCode.INTERNAL_SERVER_ERROR);
  }
};

/**
 *
 * @route GET / user/hashtags/:userId
 * @desc Read User information at main View
 * @access Public
 */
const findUserHashtag = async (req: Request, res: Response): Promise<void> => {
  const {userId} = req.params;

  try {
    const data: string[] | [] = await UserService.findUserHashtag(userId);

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
