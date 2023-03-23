import statusCode from '../../modules/statusCode';
import {Request, Response} from 'express';
import ChatService from '../../services/chat/ChatService';
import errorGenerator from '../../errors/errorGenerator';
import message from '../../modules/message';
import chattingHandler from '../../modules/chattingHandler';

const getChatRooms = async (req: Request, res: Response): Promise<void> => {
  const userId = req.body['userId'];

  if (!userId) {
    throw errorGenerator({
      msg: message.NOT_FOUND_USER,
      statusCode: statusCode.NOT_FOUND,
    });
  }

  try {
    const data = await ChatService.getChatRooms(userId);

    res.status(statusCode.OK).json({data: data});
  } catch (error: any) {
    if (error.statusCode == statusCode.NOT_FOUND) {
      //찾을 수 없는 정보가 있었다면 NOT FOUND 발송.
      res.status(statusCode.NOT_FOUND).send(statusCode.NOT_FOUND);
    } else {
      res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(statusCode.INTERNAL_SERVER_ERROR);
    }
  }
};

const getChatRoomDetail = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.body['userId'];
  const thunderId = req.params['thunderId'];

  if (!userId || !thunderId) {
    throw errorGenerator({
      msg: message.NOT_FOUND,
      statusCode: statusCode.NOT_FOUND,
    });
  }

  try {
    const data = await ChatService.getChatRoomDetail(userId, thunderId);

    res.status(statusCode.OK).json({accessToken: data});
  } catch (error: any) {
    if (error.statusCode == statusCode.NOT_FOUND) {
      //찾을 수 없는 정보가 있었다면 NOT FOUND 발송.
      res.status(statusCode.NOT_FOUND).send(statusCode.NOT_FOUND);
    } else {
      res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(statusCode.INTERNAL_SERVER_ERROR);
    }
  }
};

const putChatRoomAlarm = async (req: Request, res: Response): Promise<void> => {
  const userId = req.body['userId'];
  const thunderId = req.params['thunderId'];
  const isAlarm = req.body['isAlarm'] as boolean;

  try {
    await ChatService.putChatRoomAlarm(userId, thunderId, isAlarm);
    res.status(statusCode.OK).send(statusCode.OK);
  } catch (error: any) {
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
  getChatRooms,
  getChatRoomDetail,
  putChatRoomAlarm,
};
