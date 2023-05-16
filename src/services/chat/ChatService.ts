import statusCode from '../../modules/statusCode';
import errorGenerator from '../../errors/errorGenerator';
import message from '../../modules/message';
import User from '../../models/User';
import Thunder from '../../models/Thunder';
import ThunderRecord from '../../models/ThunderRecord';
import {ChatDto} from '../../interfaces/chat/ChatDto';
import Chat from '../../models/Chat';
import {ChatRoomDto} from '../../interfaces/chat/ChatRoomDto';
import chattingHandler from '../../modules/chattingHandler';
import {ObjectId} from 'mongoose';
import PersonalChatRoom from '../../models/PersonalChatRoom';
import {ChatRoomDetailDto} from '../../interfaces/chat/ChatRoomDetailDto';
import {ChatUserDto} from '../../interfaces/chat/ChatUserDto';
import {ChatInfo} from '../../interfaces/chat/ChatInfo';
import dayjs from 'dayjs';

const getChatRooms = async (userId: string): Promise<ChatRoomDto[]> => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      // 유저 정보를 찾을 수 없으면 에러.
      throw errorGenerator({
        msg: message.NOT_FOUND_USER,
        statusCode: statusCode.NOT_FOUND,
      });
    }

    const recordList = await ThunderRecord.find({
      //해당 유저의 thunder records 목록에 있는 record ID들을 thunderRecord DB에서 검색.
      _id: {$in: user.thunderRecords},
    });

    const resultList = [];

    for (let record of recordList) {
      // thunder record 목록에 있는 각각의 record들에 작업 수행
      if (!record.isEvaluate) {
        // 해당 기록이 아직 유저가 평가하지 않은 번개방의 기록이라면
        const thunder = await Thunder.findById(record.thunderId); // record가 가리키는 thunderId를 이용하여 해당 id의 Thunder 정보 검색.
        if (!thunder) {
          // 없으면 에러.
          throw errorGenerator({
            msg: message.NOT_FOUND_ROOM,
            statusCode: statusCode.NOT_FOUND,
          });
        }
        const endTime = dayjs(thunder.deadline.getTime() + 3600000 * 24).format(
          'YYYY-MM-DD HH:mm',
        ); // 번개 종료 타임 설정.
        const lastChat: ChatInfo | null = await Chat.findById(
          // 마지막 채팅 설정.
          thunder.chats[thunder.chats.length - 1],
        );

        let state: String;
        if (lastChat.sender === user.id) {
          state == 'ME';
        } else state == 'OTHER';
        const sender = await User.findById(lastChat.sender);

        const lastChatToSend: ChatDto = {
          chatId: lastChat.id,
          message: lastChat.message,
          user: {
            // 채팅에서 보여질 유저 정보.
            id: sender.id,
            profile: sender.introduction,
            name: sender.name as string,
          },
          createdAt: lastChat.createdAt,
          state: state,
        };

        const result: ChatRoomDto = {
          // 채팅방 목록에 보여질 채팅방 1개의 정보.
          id: thunder.id,
          title: thunder.title,
          limitMemberCnt: thunder.limitMembersCnt,
          joinMemberCnt: thunder.members.length,
          endTime: endTime,
          lastChat: lastChatToSend,
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
      // 해당 번개가 발견되지 않으면 에러.
      throw errorGenerator({
        msg: message.NOT_FOUND_ROOM,
        statusCode: statusCode.NOT_FOUND,
      });
    }

    const chats: ObjectId[] = thunder.chats; // 해당 번개에 저장되어 있는 채팅 id 목록.
    const chatDtos: ChatDto[] = []; // 채팅방 내부에서 보여질 채팅 하나의 정보 dto를 담을 목록

    for (let chat of chats) {
      const result = await Chat.findById(chat);
      if (!result) {
        // 해당 채팅이 발견되지 않으면 에러.
        throw errorGenerator({
          msg: message.NOT_FOUND_CHAT,
          statusCode: statusCode.NOT_FOUND,
        });
      }

      const sender = await User.findById(result.sender); // 해당 채팅을 보낸 유저의 ID.
      let state;
      let userDto: ChatUserDto;

      if (!sender) {
        // 해당 채팅을 보낸 ID의 유저가 존재하지 않으면 내용은 보여주되 유저 정보는 알 수 없음 처리.
        state = 'OTHER';
        userDto = {
          id: '',
          profile: '(알 수 없음)',
          name: '(알 수 없음)',
        };
      } else {
        // 아닐 시 보낸 유저 ID가 현재 유저 ID와 같으면 state = ME (오른쪽), 아니면 OTHER (왼쪽)
        if (sender.id == userId) {
          state = 'ME';
        } else {
          state = 'OTHER';
        }

        userDto = {
          // 채팅에서 보여질 유저 정보.
          id: sender.id,
          profile: sender.introduction,
          name: sender.name as string,
        };
      }

      const chatDto: ChatDto = {
        chatId: chat,
        message: result.message,
        user: userDto,
        createdAt: result.createdAt,
        state: state,
      }; // 채팅방에서 보여질 채팅 하나의 정보.

      chatDtos.push(chatDto);
    }

    const memberIds = thunder.members; // 채팅방 멤버들의 채팅방 설정 정보 id 목록.
    let isAlarm;

    for (let memberId of memberIds) {
      const member = await PersonalChatRoom.findById(memberId);

      if (!member) {
        // 해당 id로 된 채팅방 설정 정보가 없을 경우 에러.
        throw errorGenerator({
          msg: message.NOT_FOUND_MEMBER,
          statusCode: statusCode.NOT_FOUND,
        });
      }

      if (member.userId.toString() == userId) {
        // 해당 채팅방 설정 정보가 가리키는 userId가 현재 유저 id와 같으면 알람 설정 가져오기.
        isAlarm = member.isAlarm;
      }
    }

    const resultDto: ChatRoomDetailDto = {
      title: thunder.title,
      limitMemberCnt: thunder.limitMembersCnt,
      joinMemberCnt: thunder.members.length,
      chats: chatDtos,
      thunderId: thunderId,
      isAlarm: isAlarm as boolean,
    }; // 최종적으로 반환할 채팅방 한 개의 정보.

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
