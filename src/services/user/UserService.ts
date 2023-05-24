import User from '../../models/User';
import {UserIDResponseDto} from '../../interfaces/user/response/UserIDResponseDto';
import errorGenerator from '../../errors/errorGenerator';
import statusCode from '../../modules/statusCode';
import {UserInfoResponseDto} from '../../interfaces/user/response/UserInfoResponseDto';
import {UserUpdateRequestDto} from '../../interfaces/user/request/UserUpdateRequestDto';
import {UserHashtagResponseDto} from '../../interfaces/user/response/UserHashtagResponseDto';
import {UserThunderRecordResponseDto} from '../../interfaces/user/response/UserThunderRecordResponseDto';
import {UserAlarmStateResponseDto} from '../../interfaces/user/response/UserAlarmStateResponseDto';
import {UserInfo} from '../../interfaces/user/UserInfo';
import message from '../../modules/message';
import Thunder from '../../models/Thunder';
import PersonalChatRoom from '../../models/PersonalChatRoom';
import ThunderRecord from '../../models/ThunderRecord';
import dayjs from 'dayjs';
import {Schema} from 'mongoose';

const getUserById = async (userId: string) => {
  try {
    const user: UserIDResponseDto | null = await User.findById(userId);

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getUserByKakao = async (kakaoId: any) => {
  try {
    const user: UserIDResponseDto | null = await User.findOne({
      kakaoId: kakaoId,
    });

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const deleteUser = async (userId: string) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw errorGenerator({
        msg: message.NOT_FOUND_USER,
        statusCode: statusCode.NOT_FOUND,
      });
    }

    const idList: any[] = [];
    const thunderList: Schema.Types.ObjectId[] = [];

    const personalRoomInfo = await PersonalChatRoom.find(
      {
        userId: userId,
      },
      '_id',
    ); // 해당 userId를 포함한 PersonalRoomInfo 전부 검색.

    personalRoomInfo.forEach(info => {
      idList.push(info._id);
    });

    const thunderRecords = await ThunderRecord.find({
      _id: {$in: user.thunderRecords},
    });

    const thunderRecordIds = thunderRecords.map(record => record._id);

    thunderRecords.forEach(record => {
      thunderList.push(record.thunderId);
    });

    const currentTime = new Date().getDate() + 3600000 * 9;

    const thunderNotToDelete = await Thunder.find({
      _id: {$in: thunderList},
      'members.0': {$in: idList},
      deadline: {$gt: currentTime},
    });

    //console.log(thunderNotToDelete);

    if (thunderNotToDelete.length > 0) {
      throw errorGenerator({
        msg: message.USER_CANNOT_DELETE,
        statusCode: statusCode.FORBIDDEN,
      });
    } else {
      const promises = [];

      for (let thunderId of thunderList) {
        promises.push(
          Thunder.findByIdAndUpdate(thunderId, {
            $pull: {members: {$in: idList}},
          }),
        );
      }

      for (let record of thunderRecordIds) {
        promises.push(ThunderRecord.findByIdAndDelete(record));
      }

      for (let info of idList) {
        promises.push(PersonalChatRoom.findByIdAndDelete(info));
      }

      promises.push(User.findByIdAndDelete(userId));

      await Promise.all(promises);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getUserProfile = async (userId: string) => {
  try {
    const data: UserInfo | null = await User.findById(userId);

    if (!data) {
      throw errorGenerator({
        msg: message.NOT_FOUND_USER,
        statusCode: statusCode.NOT_FOUND,
      });
    }

    const result: UserInfoResponseDto = {
      name: data.name as string,
      introduction: data.introduction as string,
      hashtags: data.hashtags as [string],
      mannerTemperature: data.mannerTemperature as number,
    };

    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateUser = async (
  UserUpdateRequestDto: UserUpdateRequestDto,
  userId: string,
): Promise<void> => {
  try {
    await User.findByIdAndUpdate(userId, UserUpdateRequestDto);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getUserHashtag = async (
  userId: string,
): Promise<UserHashtagResponseDto> => {
  try {
    const user = await User.findById(userId);

    const data: UserHashtagResponseDto = {
      hashtags: user!.hashtags as [string],
    };

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getThunderRecord = async (
  userId: string,
): Promise<UserThunderRecordResponseDto[]> => {
  try {
    const currentTime = new Date().getTime() + 3600000 * 9; //현재 날짜 및 시간
    const user = await User.findById(userId);

    //시간이 지난 번개 가져오기
    //최근에 끝난 것이 가장 위에
    const thunder = await Thunder.find({
      deadline: {$lt: currentTime},
      _id: {$in: user.thunderRecords},
    }).sort({createdAt: 'desc'});

    const thunderRecord: UserThunderRecordResponseDto[] = [];

    await Promise.all(
      user!.thunderRecords.map(async (id: any) => {
        const record = await ThunderRecord.findById(id);
        const thunder = await Thunder.findById(record.thunderId);

        thunderRecord.push({
          thunderId: thunder!._id,
          title: thunder!.title,
          hashtags: thunder!.hashtags,
          deadline: dayjs(thunder.deadline).format('YYYY-MM-DD HH:mm'),
        });
      }),
    );

    return thunderRecord;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getUserAlarmState = async (
  userId: string,
): Promise<UserAlarmStateResponseDto> => {
  try {
    const user = await User.findById(userId);

    const data: UserAlarmStateResponseDto = {
      isAlarms: user!.isAlarms,
    };

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
  getUserById,
  getUserByKakao,
  deleteUser,
  getUserProfile,
  updateUser,
  getUserHashtag,
  getThunderRecord,
  getUserAlarmState,
};
