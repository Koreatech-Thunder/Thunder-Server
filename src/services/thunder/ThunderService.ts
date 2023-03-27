import errorGenerator from '../../errors/errorGenerator';
import {PostBaseResponseDto} from '../../interfaces/common/PostBaseResponseDto';
import {ThunderCreateDto} from '../../interfaces/thunder/ThunderCreateDto';
import {ThunderResponseDto} from '../../interfaces/thunder/ThunderResponseDto';
import {ThunderUpdateDto} from '../../interfaces/thunder/ThunderUpdateDto';
import {ThunderMembersDto} from '../../interfaces/thunder/ThunderMembersDto';
import Thunder from '../../models/Thunder';
import message from '../../modules/message';
import statusCode from '../../modules/statusCode';
import ThunderServiceUtils from './ThunderServiceUtils';
import User from '../../models/User';
import pushHandler from '../../modules/pushHandler';
import PersonalChatRoom from '../../models/PersonalChatRoom';
import ThunderRecord from '../../models/ThunderRecord';

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
      deadline: new Date(thunderCreateDto.deadline).getTime() + 3600000 * 9,
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

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const findThunderAll = async (
  userId: string,
): Promise<ThunderResponseDto[]> => {
  try {
    const currentTime = new Date().getTime() + 3600000 * 9; //현재 날짜 및 시간
    const thunderlist = await Thunder.find({
      deadline: {$gt: currentTime},
    }).sort({createdAt: 'desc'});

    const allThunder: ThunderResponseDto[] = [];

    await Promise.all(
      thunderlist.map(async (thunder: any) => {
        const idList = []; // User._id[]

        for (let member of thunder.member) {
          //PersonalRoomInfo.id
          const info = await PersonalChatRoom.findById(member); //PersonalRoomInfo
          idList.push(info.userId);
        }

        const isMembers = await ThunderServiceUtils.findMemberById(
          userId,
          idList,
        );

        const thunderMembers: ThunderMembersDto[] = [];
        await Promise.all(
          idList.map(async (member: any) => {
            const user = await User.findById(member);
            thunderMembers.push({
              userId: user!._id,
              name: user!.name as string,
              introduction: user!.introduction as string,
              hashtags: user!.hashtags as [string],
              mannerTemperature: user!.mannerTemperature as number,
            });
          }),
        );

        if (isMembers == 'HOST') {
          allThunder.push({
            thunderId: thunder._id,
            title: thunder.title,
            deadline: await ThunderServiceUtils.dateFormat(thunder.deadline),
            content: thunder.content,
            hashtags: thunder.hashtags,
            chats: thunder.chats,
            members: thunderMembers,
            limitMembersCnt: thunder.limitMembersCnt,
            thunderState: 'HOST',
          });
        } else if (isMembers == 'NON_MEMBER') {
          allThunder.push({
            thunderId: thunder._id,
            title: thunder.title,
            deadline: await ThunderServiceUtils.dateFormat(thunder.deadline),
            content: thunder.content,
            hashtags: thunder.hashtags,
            chats: thunder.chats,
            members: thunderMembers,
            limitMembersCnt: thunder.limitMembersCnt,
            thunderState: 'NON_MEMBER',
          });
        } else {
          allThunder.push({
            thunderId: thunder._id,
            title: thunder.title,
            deadline: await ThunderServiceUtils.dateFormat(thunder.deadline),
            content: thunder.content,
            hashtags: thunder.hashtags,
            chats: thunder.chats,
            members: thunderMembers,
            limitMembersCnt: thunder.limitMembersCnt,
            thunderState: 'MEMBER',
          });
        }
      }),
    );

    return allThunder;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const findThunderByHashtag = async (
  hashtag: string,
  userId: string,
): Promise<ThunderResponseDto[]> => {
  try {
    const currentTime = new Date().getTime() + 3600000 * 9; //현재 날짜 및 시간
    const thunderlist = await Thunder.find({
      hashtags: hashtag,
      deadline: {$gt: currentTime},
    }).sort({createdAt: 'desc'});

    const hashtagthunder: ThunderResponseDto[] = [];
    await Promise.all(
      thunderlist.map(async (thunder: any) => {
        const idList = []; // User._id[]

        for (let member of thunder.member) {
          const info = await PersonalChatRoom.findById(member);
          idList.push(info.userId);
        }

        const isMembers: string = await ThunderServiceUtils.findMemberById(
          userId,
          idList,
        );

        const thunderMembers: ThunderMembersDto[] = [];
        await Promise.all(
          idList.map(async (member: any) => {
            const user = await User.findById(member);

            thunderMembers.push({
              userId: user!._id,
              name: user!.name,
              introduction: user!.introduction,
              hashtags: user!.hashtags,
              mannerTemperature: user!.mannerTemperature,
            });
          }),
        );

        if (isMembers == 'HOST') {
          hashtagthunder.push({
            thunderId: thunder._id,
            title: thunder.title,
            deadline: await ThunderServiceUtils.dateFormat(thunder.deadline),
            content: thunder.content,
            hashtags: thunder.hashtags,
            chats: thunder.chats,
            members: thunderMembers,
            limitMembersCnt: thunder.limitMembersCnt,
            thunderState: 'HOST',
          });
        } else if (isMembers == 'NON_MEMBER') {
          hashtagthunder.push({
            thunderId: thunder._id,
            title: thunder.title,
            deadline: await ThunderServiceUtils.dateFormat(thunder.deadline),
            content: thunder.content,
            hashtags: thunder.hashtags,
            chats: thunder.chats,
            members: thunderMembers,
            limitMembersCnt: thunder.limitMembersCnt,
            thunderState: 'NON_MEMBER',
          });
        } else {
          hashtagthunder.push({
            thunderId: thunder._id,
            title: thunder.title,
            deadline: await ThunderServiceUtils.dateFormat(thunder.deadline),
            content: thunder.content,
            hashtags: thunder.hashtags,
            chats: thunder.chats,
            members: thunderMembers,
            limitMembersCnt: thunder.limitMembersCnt,
            thunderState: 'MEMBER',
          });
        }
      }),
    );

    return hashtagthunder;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const findThunder = async (thunderId: string): Promise<ThunderUpdateDto> => {
  try {
    const thunder = await ThunderServiceUtils.findThunderById(thunderId);

    const data: ThunderUpdateDto = {
      title: thunder.title,
      deadline: await ThunderServiceUtils.dateFormat(thunder.deadline),
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
    const thunder = await ThunderServiceUtils.findThunderById(thunderId);

    const idList = []; // User._id[]
    for (let member of thunder.members) {
      const info = await PersonalChatRoom.findById(member);
      idList.push(info.userId);
    }

    const isMembers: string = await ThunderServiceUtils.findMemberById(
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
    const thunder = await ThunderServiceUtils.findThunderById(thunderId);

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

    const isMembers: string = await ThunderServiceUtils.findMemberById(
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

      await User.findByIdAndUpdate(userId, {
        $push: {thunderRecords: thunderId},
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
    const thunder = await ThunderServiceUtils.findThunderById(thunderId);

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

    const isMembers: string = await ThunderServiceUtils.findMemberById(
      userId,
      idList,
    ); //idList에 있는 ID들을 가진 유저 정보를 검색.

    if (isMembers == 'MEMBER') {
      await Thunder.updateOne({_id: thunderId}, {$pull: {members: myInfo._id}});

      await PersonalChatRoom.findByIdAndDelete(myInfo._id);

      await User.findByIdAndUpdate(userId, {
        $pull: {thunderRecords: thunderId},
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

export default {
  createThunder,
  findThunderAll,
  findThunderByHashtag,
  findThunder,
  updateThunder,
  joinThunder,
  outThunder,
};
