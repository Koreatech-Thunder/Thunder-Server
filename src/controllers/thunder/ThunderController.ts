import {Request, Response} from 'express';
import {Result, ValidationError, validationResult} from 'express-validator';
import {ThunderCreateDto} from '../../interfaces/thunder/ThunderCreateDto';
import {ThunderResponseDto} from '../../interfaces/thunder/ThunderResponseDto';
import {ThunderUpdateDto} from '../../interfaces/thunder/ThunderUpdateDto';
import {PostBaseResponseDto} from '../../interfaces/common/PostBaseResponseDto';
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
 * @route GET / thunder/:thunderId
 * @desc Get Thunder Details
 * @access Public
 */
const findThunder = async (
  req: Request,
  res: Response,
): Promise<void | Response> => {
  const userId: string = req.body['userId'];
  const {thunderId} = req.params;

  try {
    const data: ThunderUpdateDto = await ThunderService.findThunder(
      userId,
      thunderId,
    );

    res.status(statusCode.OK).send(data);
  } catch (error: any) {
    if (error.msg == message.NOT_FOUND_ROOM) {
      console.log(error);
      res.status(statusCode.NOT_FOUND).send(statusCode.NOT_FOUND);
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
};
