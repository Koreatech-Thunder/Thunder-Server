import {Request, Response} from 'express';
import {Result, ValidationError, validationResult} from 'express-validator';
import statusCode from '../../modules/statusCode';
import {EvaluateRequestDto} from '../../interfaces/evaluate/request/EvaluateRequestDto';
import EvaluateService from '../../services/evaluate/EvaluateService';
import {UserEvaluateResponseDto} from '../../interfaces/evaluate/response/UserEvaluateResponseDto';

/**
 *
 * @route PUT / evaluate
 * @desc evaluate Thunder
 * @access Public
 */
const evaluateThunder = async (
  req: Request,
  res: Response,
): Promise<void | Response> => {
  const errors: Result<ValidationError> = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(statusCode.BAD_REQUEST).send(statusCode.BAD_REQUEST);
  }

  const EvaluateRequestDtos: EvaluateRequestDto = req.body;
  const userId: string = req.body['userId'];
  const {thunderId} = req.params;

  try {
    await EvaluateService.evaluateThunder(
      EvaluateRequestDtos,
      userId,
      thunderId,
    );

    res.status(statusCode.CREATED).send();
  } catch (error: any) {
    console.log(error);
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(statusCode.INTERNAL_SERVER_ERROR);
  }
};

/**
 *
 * @route GET / evaluate
 * @desc get User Thunder Evaluate Info
 * @access Public
 */
const getUserEvaluateInfo = async (
  req: Request,
  res: Response,
): Promise<void | Response> => {
  const userId: string = req.body['userId'];
  const {thunderId} = req.params;

  try {
    const data: UserEvaluateResponseDto =
      await EvaluateService.getUserEvaluateInfo(userId, thunderId);

    res.status(statusCode.CREATED).send(data);
  } catch (error: any) {
    console.log(error);
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(statusCode.INTERNAL_SERVER_ERROR);
  }
};

export default {
  evaluateThunder,
  getUserEvaluateInfo,
};
