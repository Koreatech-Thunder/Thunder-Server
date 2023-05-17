import errorGenerator from '../../errors/errorGenerator';
import {PostBaseResponseDto} from '../../interfaces/common/PostBaseResponseDto';
import {ThunderCreateDto} from '../../interfaces/thunder/request/ThunderCreateRequestDto';
import {ThunderResponseDto} from '../../interfaces/thunder/response/ThunderFindResponseDto';
import {ThunderUpdateDto} from '../../interfaces/thunder/request/ThunderUpdateRequestDto';
import {ThunderMembersDto} from '../../interfaces/thunder/request/ThunderMembersRequestDto';
import {ThunderFindResponseDto} from '../../interfaces/thunder/response/ThunderFindOneResponseDto';
import EvaluateCalculate from '../evaluate/EvaluateCalculate';
import Thunder from '../../models/Thunder';
import message from '../../modules/message';
import statusCode from '../../modules/statusCode';
import ThunderServiceUtils from './ThunderServiceUtils';
import User from '../../models/User';
import pushHandler from '../../modules/pushHandler';
import PersonalChatRoom from '../../models/PersonalChatRoom';
import ThunderRecord from '../../models/ThunderRecord';
import dayjs from 'dayjs';
import mongoose from 'mongoose';

const createThunder = async (
  thunderCreateDto: ThunderCreateDto,
  userId: string,
): Promise<PostBaseResponseDto> => {
  try {
    const newThunderRoomInfo = new PersonalChatRoom({
      userId: userId,
      enterAt: Date.now() + 3600000 * 9,
      isAlarm: true,
      isConnect: false,
    });

    await newThunderRoomInfo.save();

    const thunder = new Thunder({
      title: thunderCreateDto.title,
      deadline: new Date(thunderCreateDto.deadline).getTime(), //아마존 서버 상에서는 정상 작동.
      hashtags: thunderCreateDto.hashtags,
      content: thunderCreateDto.content,
      limitMembersCnt: thunderCreateDto.limitMembersCnt,
      members: [newThunderRoomInfo._id],
      createdAt: Date.now() + 3600000 * 9,
      updatedAt: Date.now() + 3600000 * 9,
    });

    await thunder.save();

    const newRecord = new ThunderRecord({
      thunderId: thunder._id,
      isEvaluate: false,
    });

    await newRecord.save();

    await User.findByIdAndUpdate(userId, {
      $push: {thunderRecords: newRecord._id},
    });

    const data = {
      _id: thunder._id,
    };

    const user = await User.find({
      hashtags: {$in: thunderCreateDto.hashtags},
    });

    for (var i = 0; i < user.length; i++) {
      if (user[i].isAlarms[0]) {
        pushHandler.pushAlarmToUser(
          user[i]._id.toString(),
          '번개방이 생성됐어요~! 확인해 볼까요?',
          '',
        );
      }
    }

    const evaluateDeadline = thunder.deadline.setDate(
      thunder.deadline.getDate() + 1,
    );

    async function newStyleDelay() {
      await setTimeout(
        EvaluateCalculate.calculateScore,
        evaluateDeadline,
        thunder._id,
      );
    }
    newStyleDelay();

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getThunderAll = async (userId: string): Promise<ThunderResponseDto[]> => {
  try {
    const currentTime = new Date().getTime() + 3600000 * 9; //현재 날짜 및 시간

    //시간이 지나지 않은 번개방을 가져오기
    const thunderlist = await Thunder.find({
      deadline: {$gt: currentTime},
    }).sort({createdAt: 'desc'});

    const allThunder: ThunderResponseDto[] = await Promise.all(
      thunderlist.map(async (thunder: any) => {
        const idList: mongoose.Schema.Types.ObjectId[] = []; // User._id[]

        const thunderMembers: ThunderMembersDto[] = [];

        for (const member of thunder.members) {
          const user = await PersonalChatRoom.findById(member).populate(
            'userId',
          );
          idList.push(user.userId);

          const result = {
            userId: (user.userId as any)._id,
            name: (user.userId as any).name,
            introduction: (user.userId as any).introduction,
            hashtags: (user.userId as any).hashtags,
            mannerTemperature: (user.userId as any).mannerTemperature,
          };

          thunderMembers.push(result);
        }

        const isMembers = await ThunderServiceUtils.getMemberById(
          userId,
          idList,
        );

        if (isMembers == 'HOST') {
          var result = {
            thunderId: thunder._id,
            title: thunder.title,
            deadline: dayjs(thunder.deadline).format('YYYY-MM-DD HH:mm'),
            content: thunder.content,
            hashtags: thunder.hashtags,
            chats: thunder.chats,
            members: thunderMembers,
            limitMembersCnt: thunder.limitMembersCnt,
            thunderState: 'HOST',
          };
        } else if (isMembers == 'NON_MEMBER') {
          var result = {
            thunderId: thunder._id,
            title: thunder.title,
            deadline: dayjs(thunder.deadline).format('YYYY-MM-DD HH:mm'),
            content: thunder.content,
            hashtags: thunder.hashtags,
            chats: thunder.chats,
            members: thunderMembers,
            limitMembersCnt: thunder.limitMembersCnt,
            thunderState: 'NON_MEMBER',
          };
        } else {
          var result = {
            thunderId: thunder._id,
            title: thunder.title,
            deadline: dayjs(thunder.deadline).format('YYYY-MM-DD HH:mm'),
            content: thunder.content,
            hashtags: thunder.hashtags,
            chats: thunder.chats,
            members: thunderMembers,
            limitMembersCnt: thunder.limitMembersCnt,
            thunderState: 'MEMBER',
          };
        }
        return result;
      }),
    );

    return allThunder;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getThunderByHashtag = async (
  hashtag: string,
  userId: string,
): Promise<ThunderResponseDto[]> => {
  try {
    const currentTime = new Date().getTime() + 3600000 * 9; //현재 날짜 및 시간
    const thunderlist = await Thunder.find({
      hashtags: hashtag,
      deadline: {$gt: currentTime},
    }).sort({createdAt: 'desc'});

    const hashtagthunder: ThunderResponseDto[] = await Promise.all(
      thunderlist.map(async (thunder: any) => {
        const idList: mongoose.Schema.Types.ObjectId[] = []; // User._id[]

        const thunderMembers: ThunderMembersDto[] = [];

        for (const member of thunder.members) {
          const user = await PersonalChatRoom.findById(member).populate(
            'userId',
          );
          idList.push(user.userId);

          const result = {
            userId: (user.userId as any)._id,
            name: (user.userId as any).name,
            introduction: (user.userId as any).introduction,
            hashtags: (user.userId as any).hashtags,
            mannerTemperature: (user.userId as any).mannerTemperature,
          };

          thunderMembers.push(result);
        }

        const isMembers = await ThunderServiceUtils.getMemberById(
          userId,
          idList,
        );

        if (isMembers == 'HOST') {
          var result = {
            thunderId: thunder._id,
            title: thunder.title,
            deadline: dayjs(thunder.deadline).format('YYYY-MM-DD HH:mm'),
            content: thunder.content,
            hashtags: thunder.hashtags,
            chats: thunder.chats,
            members: thunderMembers,
            limitMembersCnt: thunder.limitMembersCnt,
            thunderState: 'HOST',
          };
        } else if (isMembers == 'NON_MEMBER') {
          var result = {
            thunderId: thunder._id,
            title: thunder.title,
            deadline: dayjs(thunder.deadline).format('YYYY-MM-DD HH:mm'),
            content: thunder.content,
            hashtags: thunder.hashtags,
            chats: thunder.chats,
            members: thunderMembers,
            limitMembersCnt: thunder.limitMembersCnt,
            thunderState: 'NON_MEMBER',
          };
        } else {
          var result = {
            thunderId: thunder._id,
            title: thunder.title,
            deadline: dayjs(thunder.deadline).format('YYYY-MM-DD HH:mm'),
            content: thunder.content,
            hashtags: thunder.hashtags,
            chats: thunder.chats,
            members: thunderMembers,
            limitMembersCnt: thunder.limitMembersCnt,
            thunderState: 'MEMBER',
          };
        }
        return result;
      }),
    );

    return hashtagthunder;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getThunderOne = async (
  thunderId: string,
): Promise<ThunderFindResponseDto> => {
  try {
    const thunder = await ThunderServiceUtils.getThunderById(thunderId);

    const data: ThunderFindResponseDto = {
      thunderId: thunderId,
      title: thunder.title,
      deadline: dayjs(thunder.deadline).format('YYYY-MM-DD HH:mm'),
      content: thunder.content,
      hashtags: thunder.hashtags,
      limitMembersCnt: thunder.limitMembersCnt,
    };

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateThunder = async (
  userId: string,
  thunderId: string,
  thunderUpdateDto: ThunderUpdateDto,
): Promise<void> => {
  try {
    const thunder = await ThunderServiceUtils.getThunderById(thunderId);

    const idList = []; // User._id[]

    for (let member of thunder.members) {
      const info = await PersonalChatRoom.findById(member);
      idList.push(info.userId);
    }

    const isMembers: string = await ThunderServiceUtils.getMemberById(
      userId,
      idList,
    );

    if (isMembers == 'HOST') {
      await Thunder.findByIdAndUpdate(thunderId, thunderUpdateDto);
    } else {
      throw errorGenerator({
        msg: message.FORBIDDEN,
        statusCode: statusCode.FORBIDDEN,
      });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const joinThunder = async (
  userId: string,
  thunderId: string,
): Promise<void> => {
  try {
    const thunder = await ThunderServiceUtils.getThunderById(thunderId);

    if (thunder.members.length >= thunder.limitMembersCnt) {
      throw errorGenerator({
        msg: message.OVER_LIMITMEMBERSCNT,
        statusCode: statusCode.FORBIDDEN,
      });
    }

    const idList = [];

    for (let member of thunder.members) {
      const info = await PersonalChatRoom.findById(member);
      idList.push(info.userId);
    }

    const isMembers: string = await ThunderServiceUtils.getMemberById(
      userId,
      idList,
    );

    if (isMembers == 'NON_MEMBER') {
      const myJoinInfo = new PersonalChatRoom({
        userId: userId,
        enterAt: Date.now() + 3600000 * 9,
        isAlarm: true,
        isConnect: true,
      });

      await myJoinInfo.save();

      await Thunder.findByIdAndUpdate(thunderId, {
        $push: {members: myJoinInfo._id},
      });

      const newRecord = new ThunderRecord({
        thunderId: thunderId,
        isEvaluate: false,
      });

      await newRecord.save();

      await User.findByIdAndUpdate(userId, {
        $push: {thunderRecords: newRecord._id},
      });
    } else {
      throw errorGenerator({
        msg: message.FORBIDDEN,
        statusCode: statusCode.FORBIDDEN,
      });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const outThunder = async (userId: string, thunderId: string): Promise<void> => {
  try {
    const thunder = await ThunderServiceUtils.getThunderById(thunderId);

    const members = thunder.members; // members = [ObjectId] -> ref: PersonalRoomInfo
    const idList = []; // PersonalRoomInfo에 저장된 UserId.
    let myInfo;

    for (let member of members) {
      const info = await PersonalChatRoom.findById(member);
      if (info.userId.toString() == userId) {
        // 해당 Info의 userId가 현재 userId와 같으면
        myInfo = info; //현재 유저 정보의 Info는 나중에 삭제.
      }

      idList.push(info.userId);
    }

    const isMembers: string = await ThunderServiceUtils.getMemberById(
      userId,
      idList,
    ); //idList에 있는 ID들을 가진 유저 정보를 검색.

    if (isMembers == 'MEMBER') {
      await Thunder.findByIdAndUpdate(thunderId, {
        $pull: {members: myInfo._id},
      });

      await PersonalChatRoom.findByIdAndDelete(myInfo._id);

      const user = await User.findById(userId);

      const record = await ThunderRecord.findOne({
        _id: {$in: user.thunderRecords},
        thunderId: thunderId,
      });

      await User.findByIdAndUpdate(userId, {
        $pull: {thunderRecords: record._id},
      });

      await ThunderRecord.findByIdAndDelete(record._id);
    } else {
      throw errorGenerator({
        msg: message.FORBIDDEN,
        statusCode: statusCode.FORBIDDEN,
      });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
  createThunder,
  getThunderAll,
  getThunderByHashtag,
  getThunderOne,
  updateThunder,
  joinThunder,
  outThunder,
};
function useEffect(arg0: () => () => void, arg1: undefined[]) {
  throw new Error('Function not implemented.');
}
