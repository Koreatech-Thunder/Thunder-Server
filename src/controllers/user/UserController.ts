import statusCode from '../../modules/statusCode';
import util from '../../modules/util';
import {Result, ValidationError, validationResult} from 'express-validator';
import {UserUpdateDto} from '../../interfaces/user/UserUpdateDto';
import {UserResponseDto} from '../../interfaces/user/UserResponseDto';
import {UserService} from '../../services';
import {Request, Response} from 'express';
import {UserInfoDto} from '../../interfaces/user/UserInfoDto';
import message from '../../modules/message';
import {UserCreateDto} from '../../interfaces/user/UserCreateDto';
import {UserHashtagResponseDto} from '../../interfaces/user/UserHashtagResponseDto';

/**
 *
 * @route PUT / user
 * @desc Create User information at login View
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
  const {userId} = req.params;

  try {
    await UserService.updateUser(userCreateDto, userId);

    res.status(statusCode.CREATED).send(statusCode.CREATED);
  } catch (error: any) {
    if (error.msg == '사용자 닉네임 중복입니다.') {
      console.log(error);
      res.status(statusCode.CONFLICT).send(statusCode.CONFLICT);
    } else if (error.msg == '이미 가입한 사용자입니다.') {
      console.log(error);
      res.status(statusCode.CONFLICT).send(statusCode.CONFLICT);
    } else {
      console.log(error);
      res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(statusCode.INTERNAL_SERVER_ERROR);
    }
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
  } catch (error: any) {
    if (error.msg == '조회할 사용자 정보가 없습니다.') {
      console.log(error);
      res.status(statusCode.NOT_FOUND).send(statusCode.NOT_FOUND);
    } else if (error.msg == '유효하지 않은 id입니다.') {
      console.log(error);
      res.status(statusCode.UNAUTHORIZED).send(statusCode.UNAUTHORIZED);
    } else {
      console.log(error);
      res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(statusCode.INTERNAL_SERVER_ERROR);
    }
  }
};

const findUserById = async (req: Request, res: Response): Promise<void> => {
  const {userId} = req.params;

  try {
    const data: UserResponseDto | null = await UserService.findUserById(userId);

    res.status(statusCode.OK).send(util.success(data));
  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail());
  }
};

const findUserByKakao = async (req: Request, res: Response): Promise<void> => {
  const {kakaoId} = req.params;

  try {
    const data: UserResponseDto | null = await UserService.findUserByKakao(
      kakaoId,
    );
    res.status(statusCode.OK).send(util.success(data));
  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail());
  }
};

const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const {userId} = req.params;

  try {
    await UserService.deleteUser(userId);

    res.status(statusCode.NO_CONTENT).send(statusCode.OK);
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
  findUserById,
  findUserByKakao,
  deleteUser,
  getUserForProfileUpdate,
  findUserHashtag,
};
