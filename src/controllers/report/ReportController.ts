import {Request, Response} from 'express';
import {Result, ValidationError, validationResult} from 'express-validator';
import {PostBaseResponseDto} from '../../interfaces/common/PostBaseResponseDto';
import statusCode from '../../modules/statusCode';
import {ThunderReportsRequestDto} from '../../interfaces/report/request/ThunderReportRequestsDto';
import {ChatReportsRequestDto} from '../../interfaces/report/request/ChatReportsRequestDto';
import ReportService from '../../services/report/ReportService';

/**
 *
 * @route POST / report
 * @desc Report Thunder
 * @access Public
 */
const reportThunder = async (
  req: Request,
  res: Response,
): Promise<void | Response> => {
  const errors: Result<ValidationError> = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(statusCode.BAD_REQUEST).send(statusCode.BAD_REQUEST);
  }

  const ThunderReportsRequestDto: ThunderReportsRequestDto = req.body; //key:value
  const {thunderId} = req.params;

  try {
    const data: PostBaseResponseDto = await ReportService.reportThunder(
      ThunderReportsRequestDto,
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

/**
 *
 * @route POST / report
 * @desc Report Chat
 * @access Public
 */
const reportChat = async (
  req: Request,
  res: Response,
): Promise<void | Response> => {
  const errors: Result<ValidationError> = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(statusCode.BAD_REQUEST).send(statusCode.BAD_REQUEST);
  }

  const ChatReportsRequestDto: ChatReportsRequestDto = req.body; //key:value
  const {userId} = req.params;

  try {
    const data: PostBaseResponseDto = await ReportService.reportChat(
      ChatReportsRequestDto,
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

export default {
  reportThunder,
  reportChat,
};
