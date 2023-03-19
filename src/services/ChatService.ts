import statusCode from '../modules/statusCode';
import errorGenerator from '../errors/errorGenerator';
import message from '../modules/message';
import User from '../models/User';
import Thunder from '../models/Thunder';
import ThunderRecord from '../models/ThunderRecord';
import {ChatDto} from '../interfaces/chatting/ChatDto';
import Chat from '../models/Chat';
import {ChatRoomDto} from '../interfaces/chatting/ChatRoomDto';
import chattingHandler from '../modules/chattingHandler';
import { ObjectId } from 'mongoose';

const getChatRooms = async (userId: string) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw errorGenerator({
        msg: message.NOT_FOUND_USER,
        statusCode: statusCode.NOT_FOUND,
      });
    }

    const recordList = await ThunderRecord.find({
      _id: {$in: user.thunderRecords},
    });

    const resultList = [];

    for (let record of recordList) {
      if (!record.isEvaluate) {
        const thunder = await Thunder.findById(record.thunderId);
        if (!thunder) {
          throw errorGenerator({
            msg: message.NOT_FOUND_ROOM,
            statusCode: statusCode.NOT_FOUND,
          });
        }
        const endTime = new Date(
          thunder.deadline.setDate(thunder.deadline.getDate() + 1),
        );
        const lastChat: ChatDto | null = await Chat.findById(
          thunder.chats[thunder.chats.length - 1],
        );

        const result: ChatRoomDto = {
          id: thunder.id,
          title: thunder.title,
          limitMemberCnt: thunder.limitMembersCnt,
          joinMemberCnt: thunder.members.length,
          endTime: endTime,
          lastChat: lastChat,
        };

        resultList.push(result);
      }
    }

    return resultList;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};

const getChatRoomDetail = async (userId: string, thunderId: string) => {
  try {
    const thunder = await chattingHandler.getThunder(thunderId);

    const chats: ObjectId[] = thunder.chats;
    const chatDtos: 

  } catch (error) {}
};

const putChatRoomAlarm = async (
  userId: string,
  thunderId: string,
  isAlarm: boolean,
): Promise<void> => {
  try {
    const thunder = await chattingHandler.getThunder(thunderId);

    const member = thunder.members;
  } catch (error: any) {}
};

export default {
  getChatRooms,
  getChatRoomDetail,
  putChatRoomAlarm,
};
