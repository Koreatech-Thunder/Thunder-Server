import {Request, Response} from 'express';
import {Result, ValidationError, validationResult} from 'express-validator';
import {ThunderCreateDto} from '../../interfaces/thunder/ThunderCreateDto';
import {ThunderResponseDto} from '../../interfaces/thunder/ThunderResponseDto';
import {PostBaseResponseDto} from '../../interfaces/common/PostBaseResponseDto';
import {ThunderUpdateDto} from '../../interfaces/thunder/ThunderUpdateDto';
import statusCode from '../../modules/statusCode';
import ThunderService from '../../services/thunder/ThunderService';
import message from '../../modules/message';

/**
 *
 * @route POST / thunder/:userId
 * @desc Create Thunder
 * @access Public
 */
const createThunder = async (
  req: Request,
  res: Response,
): Promise<void | Response> => {
  const errors: Result<ValidationError> = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(statusCode.BAD_REQUEST).send(statusCode.BAD_REQUEST);
  }

  const thunderCreateDto: ThunderCreateDto = req.body; //key:value
  const {userId} = req.params;

  try {
    //data is _id(IdObject)
    const data: PostBaseResponseDto = await ThunderService.createThunder(
      thunderCreateDto,
      userId,
    );

    res.status(statusCode.CREATED).send(data);
  } catch (error: any) {
    if (error.msg == '유효하지 않은 id입니다.') {
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

/**
 *
 * @route GET / thunder/:userId
 * @desc Get Thunder
 * @access Public
 */
const findThunderAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const {userId} = req.params;
    const data: ThunderResponseDto[] | [] = await ThunderService.findThunderAll(
      userId,
    );

    res.status(statusCode.OK).send(data);
  } catch (error: any) {
    if (error.msg == '유효하지 않은 id입니다.') {
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

/**
 *
 * @route GET / thunder/userId:userId/hashtags?hashtag=hashtag
 * @desc Get Thunder by hashtags
 * @access Public
 */
const findThunderByHashtag = async (
  req: Request,
  res: Response,
): Promise<void | Response> => {
  const errors: Result<ValidationError> = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(statusCode.BAD_REQUEST).send(message.BAD_REQUEST);
  }
  const userId = req.params.userId;
  const hashtag: string = req.query.hashtag;

  try {
    const data: ThunderResponseDto[] | [] =
      await ThunderService.findThunderByHashtag(hashtag, userId);

    res.status(statusCode.OK).send(data);
  } catch (error: any) {
    if (error.msg == '유효하지 않은 id입니다.') {
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

/**
 *
 * @route GET / thunder/:userId/:thunderId
 * @desc Get Thunder Details
 * @access Public
 */
const findThunder = async (
  req: Request,
  res: Response,
): Promise<void | Response> => {
  const userId = req.params.userId;
  const thunderId = req.params.thunderId;

  try {
    const data: ThunderResponseDto = await ThunderService.findThunder(
      userId,
      thunderId,
    );

    res.status(statusCode.OK).send(data);
  } catch (error: any) {
    if (error.msg == '유효하지 않은 id입니다.') {
      console.log(error);
      res.status(statusCode.UNAUTHORIZED).send(statusCode.UNAUTHORIZED);
    } else if (error.msg == '존재하지 않는 방입니다.') {
      console.log(error);
      res.status(statusCode.NOT_FOUND).send(statusCode.NOT_FOUND);
    } else {
      res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(statusCode.INTERNAL_SERVER_ERROR);
    }
  }
};

/**
 *
 * @route PUT / thunder/:userId/:thunderId
 * @desc Update Thunder
 * @access Public
 */
const updateThunder = async (
  req: Request,
  res: Response,
): Promise<void | Response> => {
  const errors: Result<ValidationError> = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(statusCode.BAD_REQUEST).send(message.BAD_REQUEST);
  }

  const thunderUpdateDto: ThunderUpdateDto = req.body;
  const userId = req.params.userId;
  const thunderId = req.params.thunderId;

  try {
    await ThunderService.updateThunder(userId, thunderId, thunderUpdateDto);

    res.status(statusCode.OK).send(statusCode.OK);
  } catch (error: any) {
    if (error.msg == '유효하지 않은 id입니다.') {
      console.log(error);
      res.status(statusCode.UNAUTHORIZED).send(statusCode.UNAUTHORIZED);
    } else if (error.msg == '존재하지 않는 방입니다.') {
      console.log(error);
      res.status(statusCode.NOT_FOUND).send(statusCode.NOT_FOUND);
    } else if (error.msg == '권한이 없는 유저의 요청입니다.') {
      console.log(error);
      res.status(statusCode.FORBIDDEN).send(statusCode.FORBIDDEN);
    } else {
      res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(statusCode.INTERNAL_SERVER_ERROR);
    }
  }
};

/**
 *
 * @route PUT / thunder/join/:userId/:thunderId
 * @desc Update Join User To Thunder
 * @access Public
 */
const joinThunder = async (
  req: Request,
  res: Response,
): Promise<void | Response> => {
  const errors: Result<ValidationError> = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(statusCode.BAD_REQUEST).send(message.BAD_REQUEST);
  }

  const userId = req.params.userId;
  const thunderId = req.params.thunderId;

  try {
    await ThunderService.joinThunder(userId, thunderId);

    res.status(statusCode.OK).send(statusCode.OK);
  } catch (error: any) {
    if (error.msg == '유효하지 않은 id입니다.') {
      console.log(error);
      res.status(statusCode.UNAUTHORIZED).send(statusCode.UNAUTHORIZED);
    } else if (error.msg == '존재하지 않는 방입니다.') {
      console.log(error);
      res.status(statusCode.NOT_FOUND).send(statusCode.NOT_FOUND);
    } else if (error.msg == '권한이 없는 유저의 요청입니다.') {
      console.log(error);
      res.status(statusCode.FORBIDDEN).send(statusCode.FORBIDDEN);
    } else {
      res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(statusCode.INTERNAL_SERVER_ERROR);
    }
  }
};

/**
 *
 * @route PUT / thunder/out/:userId/:thunderId
 * @desc Update Out User To Thunder
 * @access Public
 */
const outThunder = async (
  req: Request,
  res: Response,
): Promise<void | Response> => {
  const errors: Result<ValidationError> = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(statusCode.BAD_REQUEST).send(message.BAD_REQUEST);
  }

  const userId: string = req.body['userId'];
  const thunderId: string = req.body['thunderId'];

  try {
    await ThunderService.outThunder(userId, thunderId);

    res.status(statusCode.OK).send(statusCode.OK);
  } catch (error: any) {
    if (error.msg == message.NOT_FOUND_ROOM) {
      console.log(error);
      res.status(statusCode.NOT_FOUND).send(statusCode.NOT_FOUND);
    } else if (error.msg == message.FORBIDDEN) {
      console.log(error);
      res.status(statusCode.FORBIDDEN).send(statusCode.FORBIDDEN);
    } else {
      res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(statusCode.INTERNAL_SERVER_ERROR);
    }
  }
};

export default {
  createThunder,
  findThunderAll,
  findThunderByHashtag,
  findThunder,
  updateThunder,
  joinThunder,
  outThunder,
};
