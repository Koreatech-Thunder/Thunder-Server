import statusCode from '../../modules/statusCode';
import util from '../../modules/util';
import {Result, ValidationError, validationResult} from 'express-validator';
import {UserResponseDto} from '../../interfaces/user/response/UserIDResponseDto';
import {UserService} from '../../services';
import {Request, Response} from 'express';
import {UserInfoDto} from '../../interfaces/user/response/UserInfoResponseDto';
import message from '../../modules/message';
import {UserCreateDto} from '../../interfaces/user/request/UserCreateRequestDto';
import {UserHashtagResponseDto} from '../../interfaces/user/response/UserHashtagResponseDto';
import {UserThunderRecordResponseDto} from '../../interfaces/user/response/UserThunderRecordResponseDto';
import {UserAlarmStateResponseDto} from '../../interfaces/user/response/UserAlarmStateResponseDto';

/**
 *
 * @route PUT / user
 * @desc Update User information
 * @access Public
 */
const updateUser = async (
  req: Request,
  res: Response,
): Promise<void | Response> => {
  const errors: Result<ValidationError> = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(statusCode.BAD_REQUEST).send(message.BAD_REQUEST);
  }

  const userCreateDto: UserCreateDto = req.body;
  const userId: string = req.body['userId'];

  try {
    await UserService.updateUser(userCreateDto, userId);

    res.status(statusCode.CREATED).send(statusCode.CREATED);
  } catch (error: any) {
    console.log(error);
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(statusCode.INTERNAL_SERVER_ERROR);
  }
};

/**
 *
 * @route GET / user/hashtags
 * @desc Read User hashtags
 * @access Public
 */
const getUserHashtag = async (req: Request, res: Response): Promise<void> => {
  const userId: string = req.body['userId'];

  try {
    const data: UserHashtagResponseDto = await UserService.getUserHashtag(
      userId,
    );

    res.status(statusCode.OK).send(data);
  } catch (error: any) {
    console.log(error);
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(statusCode.INTERNAL_SERVER_ERROR);
  }
};

/**
 *
 * @route GET / user/record
 * @desc Read User ThunderRecord
 * @access Public
 */
const getThunderRecord = async (req: Request, res: Response): Promise<void> => {
  const userId: string = req.body['userId'];

  try {
    const data: UserThunderRecordResponseDto[] =
      await UserService.getThunderRecord(userId);

    res.status(statusCode.OK).send(data);
  } catch (error: any) {
    console.log(error);
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(statusCode.INTERNAL_SERVER_ERROR);
  }
};

/**
 *
 * @route GET / user/alarm
 * @desc Read User AlarmState
 * @access Public
 */
const getUserAlarmState = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId: string = req.body['userId'];

  try {
    const data: UserAlarmStateResponseDto = await UserService.getUserAlarmState(
      userId,
    );

    res.status(statusCode.OK).send(data);
  } catch (error: any) {
    console.log(error);
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(statusCode.INTERNAL_SERVER_ERROR);
  }
};

const getUserById = async (req: Request, res: Response): Promise<void> => {
  const userId = req.body['userId'];

  try {
    const data: UserResponseDto | null = await UserService.getUserById(userId);

    res.status(statusCode.OK).send(util.success(data));
  } catch (error) {
    console.log(error);
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(statusCode.INTERNAL_SERVER_ERROR);
  }
};

const getUserByKakao = async (req: Request, res: Response): Promise<void> => {
  const {kakaoId} = req.params;

  try {
    const data: UserResponseDto | null = await UserService.getUserByKakao(
      kakaoId,
    );
    res.status(statusCode.OK).send(util.success(data));
  } catch (error) {
    console.log(error);
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(statusCode.INTERNAL_SERVER_ERROR);
  }
};

const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const userId = req.body['userId'];

  try {
    await UserService.deleteUser(userId);

    res.status(statusCode.NO_CONTENT).send(statusCode.OK);
  } catch (error: any) {
    console.log(error);
    if (error.statusCode == statusCode.NOT_FOUND) {
      res.status(statusCode.NOT_FOUND).send(statusCode.NOT_FOUND);
    } else if (error.statusCode.FORBIDDEN) {
      res.status(statusCode.FORBIDDEN).send(statusCode.FORBIDDEN);
    } else {
      res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(statusCode.INTERNAL_SERVER_ERROR);
    }
  }
};

const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  const userId = req.body['userId'];
  try {
    const data: UserInfoDto | null = await UserService.getUserProfile(userId);

    res.status(statusCode.OK).send(data);
  } catch (error: any) {
    console.log(error);
    if (error.statusCode == statusCode.NOT_FOUND) {
      res.status(statusCode.NOT_FOUND).send(statusCode.NOT_FOUND);
    } else {
      res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(statusCode.INTERNAL_SERVER_ERROR);
    }
  }
};

export default {
  updateUser,
  getUserById,
  getUserByKakao,
  deleteUser,
  getUserProfile,
  getUserHashtag,
  getThunderRecord,
  getUserAlarmState,
};
