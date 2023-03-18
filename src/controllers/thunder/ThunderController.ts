import {Request, Response} from 'express';
import {Result, ValidationError, validationResult} from 'express-validator';
import {ThunderCreateDto} from '../../interfaces/thunder/ThunderCreateDto';
import {ThunderResponseDto} from '../../interfaces/thunder/ThunderResponseDto';
import {PostBaseResponseDto} from '../../interfaces/common/PostBaseResponseDto';
import statusCode from '../../modules/statusCode';
import ThunderService from '../../services/thunder/ThunderService';
import message from '../../modules/message';

/**
 *
 * @route POST / thunder
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
  const userId: string = req.body['userId'];

  try {
    //data is _id(IdObject)
    const data: PostBaseResponseDto = await ThunderService.createThunder(
      thunderCreateDto,
      userId,
    );

    res.status(statusCode.CREATED).send(data);
  } catch (error: any) {
    console.log(error);
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(statusCode.INTERNAL_SERVER_ERROR);
  }
};

/**
 *
 * @route GET / thunder
 * @desc Get Thunder
 * @access Public
 */
const findThunderAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId: string = req.body['userId'];
    const data: ThunderResponseDto[] | [] = await ThunderService.findThunderAll(
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
 * @route GET / thunder/hashtags?hashtag=
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

  const userId: string = req.body['userId'];
  const {hashtag} = req.query;

  try {
    const data: ThunderResponseDto[] | [] =
      await ThunderService.findThunderByHashtag(hashtag as string, userId);

    res.status(statusCode.OK).send(data);
  } catch (error: any) {
    console.log(error);
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(statusCode.INTERNAL_SERVER_ERROR);
  }
};

export default {
  createThunder,
  findThunderAll,
  findThunderByHashtag,
};
