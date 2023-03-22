import statusCode from '../../modules/statusCode';
import errorGenerator from '../../errors/errorGenerator';
import message from '../../modules/message';
import User from '../../models/User';
import Thunder from '../../models/Thunder';
import ThunderRecord from '../../models/ThunderRecord';
import {ChatDto} from '../../interfaces/chatting/ChatDto';
import Chat from '../../models/Chat';
import {ChatRoomDto} from '../../interfaces/chatting/ChatRoomDto';
import chattingHandler from '../../modules/chattingHandler';
import {ObjectId} from 'mongoose';
import PersonalChatRoom from '../../models/PersonalChatRoom';
import {ChatRoomDetailDto} from '../../interfaces/chatting/ChatRoomDetailDto';
import {ChatUserDto} from '../../interfaces/chatting/ChatUserDto';

const getChatRooms = async (userId: string): Promise<ChatRoomDto[]> => {
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

    let resultList = [];

    for (let record of recordList) {
      if (!record.isEvaluate) {
        let thunder = await Thunder.findById(record.thunderId);
        if (!thunder) {
          throw errorGenerator({
            msg: message.NOT_FOUND_ROOM,
            statusCode: statusCode.NOT_FOUND,
          });
        }
        let endTime = new Date(
          thunder.deadline.setDate(thunder.deadline.getDate() + 1),
        );
        let lastChat: ChatDto | null = await Chat.findById(
          thunder.chats[thunder.chats.length - 1],
        );

        let result: ChatRoomDto = {
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

const getChatRoomDetail = async (
  userId: string,
  thunderId: string,
): Promise<ChatRoomDetailDto> => {
  try {
    const thunder = await chattingHandler.getThunder(thunderId);

    if (!thunder) {
      throw errorGenerator({
        msg: message.NOT_FOUND_ROOM,
        statusCode: statusCode.NOT_FOUND,
      });
    }

    const chats: ObjectId[] = thunder.chats;
    let chatDtos: ChatDto[] = [];

    for (let chat of chats) {
      let result = await Chat.findById(chat);
      if (!result) {
        throw errorGenerator({
          msg: message.NOT_FOUND_CHAT,
          statusCode: statusCode.NOT_FOUND,
        });
      }

      let sender = await User.findById(result.sender);

      if (!sender) {
        throw errorGenerator({
          msg: message.NOT_FOUND_USER,
          statusCode: statusCode.NOT_FOUND,
        });
      }

      let userDto: ChatUserDto = {
        id: sender.id,
        profile: sender.introduction,
        name: sender.name as string,
      };

      let state;

      if (chat.toString() == userId) {
        state = 'ME';
      } else {
        state = 'OTHER';
      }

      let chatDto: ChatDto = {
        id: chat,
        message: result.message,
        user: userDto,
        createdAt: result.createdAt,
        thunderId: thunderId,
        state: state,
      };

      chatDtos.push(chatDto);
    }

    const memberIds = thunder.members;
    let isAlarm;

    for (let memberId of memberIds) {
      let member = await PersonalChatRoom.findById(memberId);

      if (!member) {
        throw errorGenerator({
          msg: message.NOT_FOUND_MEMBER,
          statusCode: statusCode.NOT_FOUND,
        });
      }

      if (member.userId.toString() == userId) {
        isAlarm = member.isAlarm;
      }
    }

    const resultDto: ChatRoomDetailDto = {
      title: thunder.title,
      limitMemberCnt: thunder.limitMembersCnt,
      joinMemberCnt: thunder.members.length,
      chats: chatDtos,
      isAlarm: isAlarm as boolean,
    };

    return resultDto;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const putChatRoomAlarm = async (
  userId: string,
  thunderId: string,
  isAlarm: boolean,
): Promise<void> => {
  try {
    const thunder = await chattingHandler.getThunder(thunderId);

    const memberIds = thunder.members;

    for (let memberId of memberIds) {
      let member /*: PersonalChatRoomInfo */ = await PersonalChatRoom.findById(
        memberId,
      ); //PersonalChatRoom에서 members 안에 든 id를 검색.

      if (!member) {
        // 검색 결과가 안나오면 에러
        throw errorGenerator({
          msg: message.NOT_FOUND_MEMBER,
          statusCode: statusCode.NOT_FOUND,
        });
      }
      console.log(member);

      if (member.userId.toString() == userId) {
        // PersonalChatRoom 안의 userId가 현재 조작하는 유저의 ID와 같다면 알람 ON/OFF 여부 변경.
        member.isAlarm = isAlarm;
        member.save(); // 변경후 저장.
      }
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
  getChatRooms,
  getChatRoomDetail,
  putChatRoomAlarm,
};
