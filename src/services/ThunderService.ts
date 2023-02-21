import {PostBaseResponseDto} from '../interfaces/common/PostBaseResponseDto';
import {ThunderCreateDto} from '../interfaces/thunder/request/ThunderCreateDto';
import {ThunderAllResponseDto} from '../interfaces/thunder/response/ThunderAllResponseDto';
import Thunder from '../models/Thunder';

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
      thunderState: 'HOST',
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

export default {
  createThunder,
  findThunderAll,
};
