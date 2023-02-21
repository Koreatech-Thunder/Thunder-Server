/**
 *
 * @route POST / thunder
 * @desc Create Thunder
 * @access Public
 */
import {Request, Response} from 'express';
import {ThunderCreateDto} from '../interfaces/thunder/ThunderCreateDto';
import {PostBaseResponseDto} from '../interfaces/common/PostBaseResponseDto';
import statusCode from '../modules/statusCode';
import ThunderService from '../services/ThunderService';

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

export default {
  createThunder,
};
