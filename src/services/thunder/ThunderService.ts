import {PostBaseResponseDto} from '../../interfaces/common/PostBaseResponseDto';
import {ThunderCreateDto} from '../../interfaces/thunder/ThunderCreateDto';
import {ThunderResponseDto} from '../../interfaces/thunder/ThunderResponseDto';
import {ThunderUpdateDto} from '../../interfaces/thunder/ThunderUpdateDto';
import Thunder from '../../models/Thunder';
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
      thunderlist.map(async (thunder: any) => {
        const isMembers: string = await ThunderServiceUtils.findMemberById(
          userId,
          thunder.members,
        );

        if (isMembers == 'HOST') {
          hashtagthunder.push({
            title: thunder.title,
            deadline: thunder.deadline.toString(),
            content: thunder.content,
            hashtags: thunder.hashtags,
            members: thunder.members, //id<Object>
            limitMembersCnt: thunder.limitMembersCnt,
            thunderState: 'HOST',
          });
        } else if (isMembers == 'NON_MEMBER') {
          hashtagthunder.push({
            title: thunder.title,
            deadline: thunder.deadline.toString(),
            content: thunder.content,
            hashtags: thunder.hashtags,
            members: thunder.members, //id<Object>
            limitMembersCnt: thunder.limitMembersCnt,
            thunderState: 'NON_MEMBER',
          });
        } else {
          hashtagthunder.push({
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

    return hashtagthunder;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const findThunder = async (
  userId: string,
  thunderId: string,
): Promise<ThunderUpdateDto> => {
  try {
    const thunder = await ThunderServiceUtils.findThunderById(thunderId);

    const isMembers: string = await ThunderServiceUtils.findMemberById(
      userId,
      thunder.members,
    );

    if (isMembers == 'HOST') {
      var data: ThunderUpdateDto = {
        title: thunder.title,
        deadline: thunder.deadline.toString(),
        content: thunder.content,
        hashtags: thunder.hashtags,
        limitMembersCnt: thunder.limitMembersCnt,
      };
    } else if (isMembers == 'NON_MEMBER') {
      var data: ThunderUpdateDto = {
        title: thunder.title,
        deadline: thunder.deadline.toString(),
        content: thunder.content,
        hashtags: thunder.hashtags,
        limitMembersCnt: thunder.limitMembersCnt,
      };
    } else {
      var data: ThunderUpdateDto = {
        title: thunder.title,
        deadline: thunder.deadline.toString(),
        content: thunder.content,
        hashtags: thunder.hashtags,
        limitMembersCnt: thunder.limitMembersCnt,
      };
    }

    return data;
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
};
