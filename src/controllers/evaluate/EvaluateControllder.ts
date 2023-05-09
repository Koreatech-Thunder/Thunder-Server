import {Request, Response} from 'express';
import {Result, ValidationError, validationResult} from 'express-validator';
import {PostBaseResponseDto} from '../../interfaces/common/PostBaseResponseDto';
import statusCode from '../../modules/statusCode';
import {EvaluateRequestDtos} from '../../interfaces/evaluate/request/EvaluateRequestDto';

/**
 *
 * @route POST / evaluate
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

  const EvaluateRequestDtos: EvaluateRequestDtos = req.body;
  const {thunderId} = req.params;

  try {
    const data: PostBaseResponseDto = await ReportService.evaluateThunder(
      EvaluateRequestDtos,
      thunderId,
    );

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
};
