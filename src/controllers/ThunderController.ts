import {Request, Response} from 'express';
import {ThunderCreateDto} from '../interfaces/thunder/request/ThunderCreateDto';
import {ThunderAllResponseDto} from '../interfaces/thunder/response/ThunderAllResponseDto';
import {PostBaseResponseDto} from '../interfaces/common/PostBaseResponseDto';
import statusCode from '../modules/statusCode';
import ThunderService from '../services/ThunderService';

/**
 *
 * @route POST / thunder/:userId
 * @desc Create Thunder
 * @access Public
 */
const createThunder = async (req: Request, res: Response): Promise<void> => {
  const thunderCreateDto: ThunderCreateDto = req.body; //key:value
  const {userId} = req.params;

  try {
    //data is _id(IdObject)
    const data: PostBaseResponseDto = await ThunderService.createThunder(
      thunderCreateDto,
      userId,
    );

    res.status(statusCode.CREATED).send(data);
  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send();
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
    const data: ThunderAllResponseDto[] | null =
      await ThunderService.findThunderAll();

    res.status(statusCode.OK).send(data);
  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send();
  }
};

export default {
  createThunder,
  findThunderAll,
};
