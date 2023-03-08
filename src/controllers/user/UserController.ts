import statusCode from '../../modules/statusCode';
import UserService from '../../services/user/UserService';
import {Request, Response} from 'express';
import {UserInfoDto} from '../../interfaces/user/UserInfoDto';
import {UserCreateDto} from '../../interfaces/user/UserCreateDto';
import {UserHashtagResponseDto} from '../../interfaces/user/UserHashtagResponseDto';
import {Result, ValidationError, validationResult} from 'express-validator';
import message from '../../modules/message';
import {PostBaseResponseDto} from '../../interfaces/common/PostBaseResponseDto';

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

    res.status(statusCode.CREATED).send(data);
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
    const data: UserHashtagResponseDto = await UserService.findUserHashtag(
      userId,
    );

    res.status(statusCode.OK).send(data);
  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send();
  }
};
/*
const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const {userId} = req.params;

  try {
    await UserService.deleteUser(userId);

    res.status(statusCode.NO_CONTENT).send(statusCode.OK);
  } catch (error) {
    console.log(error);
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(statusCode.INTERNAL_SERVER_ERROR);
  }
};
*/
const getUserForProfileUpdate = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const {userId} = req.params;

  try {
    const data: UserInfoDto | null = await UserService.getUserForProfileUpdate(
      userId,
    );

    res.status(statusCode.OK).send(data);
  } catch (error) {
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(statusCode.INTERNAL_SERVER_ERROR);
  }
};

export default {
  createUser,
  findUserHashtag,
  //deleteUser,
  getUserForProfileUpdate,
};
