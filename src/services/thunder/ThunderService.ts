import {PostBaseResponseDto} from '../../interfaces/common/PostBaseResponseDto';
import {ThunderCreateDto} from '../../interfaces/thunder/ThunderCreateDto';
import {ThunderResponseDto} from '../../interfaces/thunder/ThunderResponseDto';
import Thunder from '../../models/Thunder';
import UserServiceUtils from '../user/UserServiceUtils';
import ThunderServiceUtils from './ThunderServiceUtils';

const createThunder = async (
  thunderCreateDto: ThunderCreateDto,
  userId: string,
): Promise<PostBaseResponseDto> => {
  await UserServiceUtils.findUserById(userId);

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
    await UserServiceUtils.findUserById(userId);

    const thunderlist = await Thunder.find().sort({createdAt: 'desc'});

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

        if (isMembers == 'HOST') {
          allThunder.push({
            title: thunder.title,
            deadline: thunder.deadline.toString(),
            content: thunder.content,
            hashtags: thunder.hashtags,
            members: thunder.members, //id<Object>
            limitMembersCnt: thunder.limitMembersCnt,
            thunderState: 'HOST',
          });
        } else if (isMembers == 'NON_MEMBER') {
          allThunder.push({
            title: thunder.title,
            deadline: thunder.deadline.toString(),
            content: thunder.content,
            hashtags: thunder.hashtags,
            members: thunder.members, //id<Object>
            limitMembersCnt: thunder.limitMembersCnt,
            thunderState: 'NON_MEMBER',
          });
        } else {
          allThunder.push({
            title: thunder.title,
            deadline: thunder.deadline.toString(),
            content: thunder.content,
            hashtags: thunder.hashtags,
            members: thunder.members, //id<Object>
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
    await UserServiceUtils.findUserById(userId);

    const thunderlist = await Thunder.find({hashtags: hashtag}).sort({
      createdAt: 'desc',
    });

    if (!thunderlist) {
      return [];
    }

    const hashtagthunder: ThunderResponseDto[] = [];
    await Promise.all(
      thunderlist.map(async (hashtag: any) => {
        const isMembers = await ThunderServiceUtils.findMemberById(
          userId,
          hashtag.members,
        );

        if (isMembers == 'HOST') {
          hashtagthunder.push({
            title: hashtag.title,
            deadline: hashtag.deadline.toString(),
            content: hashtag.content,
            hashtags: hashtag.hashtags,
            members: hashtag.members, //id<Object>
            limitMembersCnt: hashtag.limitMembersCnt,
            thunderState: 'HOST',
          });
        } else if (isMembers == 'NON_MEMBER') {
          hashtagthunder.push({
            title: hashtag.title,
            deadline: hashtag.deadline.toString(),
            content: hashtag.content,
            hashtags: hashtag.hashtags,
            members: hashtag.members, //id<Object>
            limitMembersCnt: hashtag.limitMembersCnt,
            thunderState: 'NON_MEMBER',
          });
        } else {
          hashtagthunder.push({
            title: hashtag.title,
            deadline: hashtag.deadline.toString(),
            content: hashtag.content,
            hashtags: hashtag.hashtags,
            members: hashtag.members, //id<Object>
            limitMembersCnt: hashtag.limitMembersCnt,
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

export default {
  createThunder,
  findThunderAll,
  findThunderByHashtag,
};
