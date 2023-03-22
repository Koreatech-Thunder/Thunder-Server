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

const createThunder = async (
  thunderCreateDto: ThunderCreateDto,
  userId: string,
): Promise<PostBaseResponseDto> => {
  try {
    const thunder = new Thunder({
      title: thunderCreateDto.title,
      deadline: new Date(thunderCreateDto.deadline),
      hashtags: thunderCreateDto.hashtags,
      content: thunderCreateDto.content,
      limitMembersCnt: thunderCreateDto.limitMembersCnt,
      members: [userId],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    await thunder.save();

    await User.findByIdAndUpdate(userId, {
      $push: {thunderRecords: thunder._id},
    });

    const data = {
      _id: thunder._id,
    };

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const findThunderAll = async (
  userId: string,
): Promise<ThunderResponseDto[] | []> => {
  try {
    const currentTime = new Date(); //현재 날짜 및 시간
    const thunderlist = await Thunder.find({
      createdAt: {$gt: currentTime.setDate(currentTime.getDate() - 1)},
    }).sort({createdAt: 'desc'});

    if (!thunderlist) {
      return [];
    }

    const allThunder: ThunderResponseDto[] = [];

    await Promise.all(
      thunderlist.map(async (thunder: any) => {
        const isMembers = await ThunderServiceUtils.findMemberById(
          userId,
          thunder.members,
        );

        const thunderMembers: ThunderMembersDto[] = [];
        await Promise.all(
          thunder.members.map(async (member: any) => {
            const user = await User.findById(member);

            thunderMembers.push({
              name: user!.name,
              introduction: user!.introduction,
              hashtags: user!.hashtags,
              mannerTemperature: user!.mannerTemperature,
            });
          }),
        );

        if (isMembers == 'HOST') {
          allThunder.push({
            thunderId: thunder._id,
            title: thunder.title,
            deadline: thunder.deadline.toString(),
            content: thunder.content,
            hashtags: thunder.hashtags,
            members: thunderMembers,
            limitMembersCnt: thunder.limitMembersCnt,
            thunderState: 'HOST',
          });
        } else if (isMembers == 'NON_MEMBER') {
          allThunder.push({
            thunderId: thunder._id,
            title: thunder.title,
            deadline: thunder.deadline.toString(),
            content: thunder.content,
            hashtags: thunder.hashtags,
            members: thunderMembers,
            limitMembersCnt: thunder.limitMembersCnt,
            thunderState: 'NON_MEMBER',
          });
        } else {
          allThunder.push({
            thunderId: thunder._id,
            title: thunder.title,
            deadline: thunder.deadline.toString(),
            content: thunder.content,
            hashtags: thunder.hashtags,
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
): Promise<ThunderResponseDto[] | []> => {
  try {
    const currentTime = new Date();
    const thunderlist = await Thunder.find(
      {hashtags: hashtag},
      {createdAt: {$gt: currentTime.setDate(currentTime.getDate() - 1)}},
    ).sort({
      createdAt: 'desc',
    });

    if (!thunderlist) {
      return [];
    }

    const hashtagthunder: ThunderResponseDto[] = [];
    await Promise.all(
      thunderlist.map(async (thunder: any) => {
        const isMembers: string = await ThunderServiceUtils.findMemberById(
          userId,
          thunder.members,
        );

        const thunderMembers: ThunderMembersDto[] = [];
        await Promise.all(
          thunder.members.map(async (member: any) => {
            const user = await User.findById(member);

            thunderMembers.push({
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
            deadline: thunder.deadline.toString(),
            content: thunder.content,
            hashtags: thunder.hashtags,
            members: thunderMembers,
            limitMembersCnt: thunder.limitMembersCnt,
            thunderState: 'HOST',
          });
        } else if (isMembers == 'NON_MEMBER') {
          hashtagthunder.push({
            thunderId: thunder._id,
            title: thunder.title,
            deadline: thunder.deadline.toString(),
            content: thunder.content,
            hashtags: thunder.hashtags,
            members: thunderMembers,
            limitMembersCnt: thunder.limitMembersCnt,
            thunderState: 'NON_MEMBER',
          });
        } else {
          hashtagthunder.push({
            thunderId: thunder._id,
            title: thunder.title,
            deadline: thunder.deadline.toString(),
            content: thunder.content,
            hashtags: thunder.hashtags,
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
      deadline: thunder.deadline.toString(),
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

    const isMembers: string = await ThunderServiceUtils.findMemberById(
      userId,
      thunder.members,
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

    const isMembers: string = await ThunderServiceUtils.findMemberById(
      userId,
      thunder.members,
    );

    if (isMembers == 'NON_MEMBER') {
      await Thunder.findByIdAndUpdate(thunderId, {$push: {members: userId}});

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

    const isMembers: string = await ThunderServiceUtils.findMemberById(
      userId,
      thunder.members,
    );

    if (isMembers == 'MEMBER') {
      await Thunder.updateOne({_id: thunderId}, {$pull: {members: userId}});

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
