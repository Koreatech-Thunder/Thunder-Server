import errorGenerator from '../../errors/errorGenerator';
import {PostBaseResponseDto} from '../../interfaces/common/PostBaseResponseDto';
import EvaluateCalculate from '../evaluate/EvaluateCalculate';
import {ThunderCreateRequestDto} from '../../interfaces/thunder/request/ThunderCreateRequestDto';
import {ThunderFindResponseDto} from '../../interfaces/thunder/response/ThunderFindResponseDto';
import {ThunderUpdateRequestDto} from '../../interfaces/thunder/request/ThunderUpdateRequestDto';
import {ThunderMembersResponseDto} from '../../interfaces/thunder/response/ThunderMembersResponseDto';
import {ThunderFindOneResponseDto} from '../../interfaces/thunder/response/ThunderFindOneResponseDto';
import Thunder from '../../models/Thunder';
import message from '../../modules/message';
import statusCode from '../../modules/statusCode';
import ThunderServiceUtils from './ThunderServiceUtils';
import User from '../../models/User';
import pushHandler from '../../modules/pushHandler';
import PersonalChatRoom from '../../models/PersonalChatRoom';
import ThunderRecord from '../../models/ThunderRecord';
import dayjs from 'dayjs';
import mongoose, {ObjectId} from 'mongoose';

const createThunder = async (
  ThunderCreateRequestDto: ThunderCreateRequestDto,
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
      title: ThunderCreateRequestDto.title,
      deadline: new Date(ThunderCreateRequestDto.deadline).getTime(), //아마존 서버 상에서는 정상 작동.
      hashtags: ThunderCreateRequestDto.hashtags,
      content: ThunderCreateRequestDto.content,
      limitMembersCnt: ThunderCreateRequestDto.limitMembersCnt,
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
      hashtags: {$in: ThunderCreateRequestDto.hashtags},
    });

    for (var i = 0; i < user.length; i++) {
      if (user[i].isAlarms[0]) {
        pushHandler.pushAlarmToUser(
          user[i]._id.toString(),
          '번개방이 생성됐어요~! 확인해 볼까요?',
          '',
          'newThunder',
        );
      }
    }

    async function newStyleDelay(thunder: any) {
      const currentTime = new Date().getTime() + 3600000 * 9; //현재 날짜 및 시간

      const evaluateDeadline = thunder.deadline.setDate(
        thunder.deadline.getDate() + 2,
      );

      //console.log('timetest: ', thunder.deadline.getDate());

      const diffMSec = evaluateDeadline - currentTime;
      //console.log('diffMsc : ', diffMSec);
      if (diffMSec < 0) {
        //console.log('diff If entered.');
        return;
      }

      const reuslt = await setTimeout(
        EvaluateCalculate.calculateScore,
        diffMSec,
        thunder._id,
      );

      return reuslt;
    }

    const timeoutId = newStyleDelay(thunder);

    module.exports = {
      timeoutId,
      newStyleDelay,
    };

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getThunderAll = async (
  userId: string,
): Promise<ThunderFindResponseDto[]> => {
  try {
    const currentTime = new Date().getTime() + 3600000 * 9; //현재 날짜 및 시간

    //시간이 지나지 않은 번개방을 가져오기
    const thunderlist = await Thunder.find({
      deadline: {$gt: currentTime},
    }).sort({createdAt: 'desc'});

    const allThunder: ThunderFindResponseDto[] = await Promise.all(
      thunderlist.map(async (thunder: any) => {
        const idList: mongoose.Schema.Types.ObjectId[] = []; // User._id[]

        const thunderMembers: ThunderMembersResponseDto[] = [];

        for (const member of thunder.members) {
          const user = await PersonalChatRoom.findById(member).populate(
            'userId',
          );
          idList.push(user.userId);

          const result = {
            userId: (user.userId as any)._id,
            name: (user.userId as any).name,
            introduction: (user.userId as any).introduction,
            profile: (user.userId as any).profile,
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
): Promise<ThunderFindResponseDto[]> => {
  try {
    const currentTime = new Date().getTime() + 3600000 * 9; //현재 날짜 및 시간
    const thunderlist = await Thunder.find({
      hashtags: hashtag,
      deadline: {$gt: currentTime},
    }).sort({createdAt: 'desc'});

    const hashtagthunder: ThunderFindResponseDto[] = await Promise.all(
      thunderlist.map(async (thunder: any) => {
        const idList: mongoose.Schema.Types.ObjectId[] = []; // User._id[]

        const thunderMembers: ThunderMembersResponseDto[] = [];

        for (const member of thunder.members) {
          const user = await PersonalChatRoom.findById(member).populate(
            'userId',
          );
          idList.push(user.userId);

          const result = {
            userId: (user.userId as any)._id,
            name: (user.userId as any).name,
            introduction: (user.userId as any).introduction,
            profile: (user.userId as any).profile,
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
): Promise<ThunderFindOneResponseDto> => {
  try {
    const thunder = await ThunderServiceUtils.getThunderOneById(thunderId);

    const data: ThunderFindOneResponseDto = {
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
  ThunderUpdateRequestDto: ThunderUpdateRequestDto,
): Promise<void> => {
  try {
    let thunder = await ThunderServiceUtils.getThunderOneById(thunderId);
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
      await Thunder.findByIdAndUpdate(thunderId, ThunderUpdateRequestDto);
    } else {
      throw errorGenerator({
        msg: message.FORBIDDEN,
        statusCode: statusCode.FORBIDDEN,
      });
    }
    thunder = await ThunderServiceUtils.getThunderOneById(thunderId);

    if (ThunderUpdateRequestDto.deadline) {
      const module = require('./ThunderService');
      clearTimeout(module.timeoutId);

      module.newStyleDelay(thunder);

      //console.log(thunder.deadline.getDate());
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
    const thunder = await ThunderServiceUtils.getThunderOneById(thunderId);

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
    const thunder = await ThunderServiceUtils.getThunderOneById(thunderId);

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
