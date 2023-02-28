import {PostBaseResponseDto} from '../../interfaces/common/PostBaseResponseDto';
import {ThunderCreateDto} from '../../interfaces/thunder/request/ThunderCreateDto';
import {ThunderAllResponseDto} from '../../interfaces/thunder/response/ThunderAllResponseDto';
import Thunder from '../../models/Thunder';
import UserServiceUtils from '../user/UserServiceUtils';

const createThunder = async (
  thunderCreateDto: ThunderCreateDto,
  userId: string,
): Promise<void> => {
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
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const findThunderAll = async (): Promise<ThunderAllResponseDto[] | null> => {
  try {
    const thunderlist = await Thunder.find().sort({createdAt: 'asc'});

    if (!thunderlist) {
      return null;
    }

    const Allthunder: ThunderAllResponseDto[] = [];
    await Promise.all(
      thunderlist.map(async (allthunder: any) => {
        Allthunder.push({
          title: allthunder.title,
          deadline: allthunder.deadline.toString(),
          content: allthunder.content,
          hashtags: allthunder.hashtags,
          members: allthunder.members, //id<Object>
          limitMembersCnt: allthunder.limitMembersCnt,
        });
      }),
    );

    return Allthunder;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const findThunderByHashtag = async (hashtag: string) => {
  try {
    const thunderlist = await Thunder.find({hashtags: hashtag}).sort({
      createdAt: 'asc',
    });

    if (!thunderlist) {
      return null;
    }

    const Hashtagthunder: ThunderAllResponseDto[] = [];
    await Promise.all(
      thunderlist.map(async (hashtagthunder: any) => {
        Hashtagthunder.push({
          title: hashtagthunder.title,
          deadline: hashtagthunder.deadline.toString(),
          content: hashtagthunder.content,
          hashtags: hashtagthunder.hashtags,
          members: hashtagthunder.members, //id<Object>
          limitMembersCnt: hashtagthunder.limitMembersCnt,
        });
      }),
    );

    return Hashtagthunder;
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
