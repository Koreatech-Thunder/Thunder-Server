import Thunder from '../models/Thunder';
import User from '../models/User';
import errorGenerator from '../errors/errorGenerator';
import message from './message';
import statusCode from './statusCode';
import {PersonalChatRoomInfo} from '../interfaces/chat/PersonalChatRoomInfo';
import ThunderRecord from '../models/ThunderRecord';
import {ObjectId} from 'mongoose';
import {UserInfo} from '../interfaces/user/UserInfo';
import {ThunderInfo} from '../interfaces/thunder/ThunderInfo';
import {ChatInfo} from '../interfaces/chat/ChatInfo';

const getThunders = async (userId: string): Promise<ThunderInfo[] | null> => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      // 유저 정보가 존재하지 않으면 에러.
      throw errorGenerator({
        msg: message.NOT_FOUND_USER,
        statusCode: statusCode.NOT_FOUND,
      });
    }

    const records = user.thunderRecords;

    if (!records) {
      // 유저의 번개 기록이 아무것도 없으면 빈 리스트 반환.
      return [];
    }

    const thunderList = [];

    for (let record of records) {
      const thunder = await ThunderRecord.findById(record);
      thunderList.push(thunder?.thunderId);
    }

    const result: ThunderInfo[] = await Thunder.find({
      _id: {$in: thunderList}, // 유저 정보의 thunderRecords 안의 정보 중에서
      deadline: {$gt: new Date()}, // deadline이 아직 안 지난 것만 쿼리. new Date()는 현재 날짜시간
    });

    if (!result) {
      // 아무것도 없으면 빈 리스트 반환.
      return [];
    }

    console.log(result);

    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const setConnectState = async (
  member: PersonalChatRoomInfo,
  isConnect: Boolean,
): Promise<PersonalChatRoomInfo> => {
  member['isConnect'] = isConnect; //매개변수로 들어온 Info에서 isConnect 필드만 매개변수 isConnect 값으로 변경 후 반환. DB 수정 없음.

  return member;
};

const getUser = async (userId: string): Promise<UserInfo> => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw errorGenerator({
        msg: message.NOT_FOUND_USER,
        statusCode: statusCode.NOT_FOUND,
      });
    }

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateThunderMembers = async (
  thunderId: string,
  members: ObjectId[],
): Promise<void> => {
  try {
    const thunder = await Thunder.findById(thunderId);

    if (!thunder) {
      throw errorGenerator({
        msg: message.NOT_FOUND_ROOM,
        statusCode: statusCode.NOT_FOUND,
      });
    }

    thunder.members = members; //매개변수로 들어온 members로 기존 thunder의 members 교체.
    thunder.save(); // 교체 후 db에 저장.
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateChats = async (
  thunderId: string,
  chat: ChatInfo,
): Promise<void> => {
  try {
    const thunder = await Thunder.findById(thunderId);

    if (!thunder) {
      throw errorGenerator({
        msg: message.NOT_FOUND_ROOM,
        statusCode: statusCode.NOT_FOUND,
      });
    }

    thunder.chats.push(chat.id); //thunder의 chats 필드에 chat id 푸쉬 후 db에 저장.
    thunder.save();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getThunder = async (thunderId: string): Promise<ThunderInfo> => {
  try {
    const thunder = await Thunder.findById(thunderId); // 해당 thunderId를 가진 thunder 하나 get.

    if (!thunder) {
      throw errorGenerator({
        msg: message.NOT_FOUND_ROOM,
        statusCode: statusCode.NOT_FOUND,
      });
    }

    return thunder;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const isAlarm = async (userId: string): Promise<Boolean> => {
  try {
    const user = await User.findById(userId);

    if (!user || !user.isAlarms) {
      throw errorGenerator({
        msg: message.NOT_FOUND_USER,
        statusCode: statusCode.NOT_FOUND,
      });
    }

    const isAlarms = user.isAlarms as Boolean[];

    return isAlarms[2]; // 해당 채팅방의 알람 ON/OFF 여부만 반환.
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
  getThunder,
  getThunders,
  isAlarm,
  getUser,
  setConnectState,
  updateThunderMembers,
  updateChats,
};
