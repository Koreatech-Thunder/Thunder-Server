import User from '../../models/User';
import {UserResponseDto} from '../../interfaces/user/UserResponseDto';
import errorGenerator from '../../errors/errorGenerator';
import statusCode from '../../modules/statusCode';
import {UserInfoDto} from '../../interfaces/user/UserInfoDto';
import {UserUpdateDto} from '../../interfaces/user/UserUpdateDto';
import {UserHashtagResponseDto} from '../../interfaces/user/UserHashtagResponseDto';
import {UserThunderRecordResponseDto} from '../../interfaces/user/UserThunderRecordResponseDto';
import {UserAlarmStateResponseDto} from '../../interfaces/user/UserAlarmStateResponseDto';
import {UserInfo} from '../../interfaces/user/UserInfo';
import message from '../../modules/message';
import Thunder from '../../models/Thunder';
import PersonalChatRoom from '../../models/PersonalChatRoom';
import ThunderRecord from '../../models/ThunderRecord';
import dayjs from 'dayjs';

const findUserById = async (userId: string) => {
  try {
    const user: UserResponseDto | null = await User.findById(userId);

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const findUserByKakao = async (kakaoId: any) => {
  try {
    const user: UserResponseDto | null = await User.findOne({
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

    const idList = [];
    const thunderList = [];

    const personalRoomInfo = await PersonalChatRoom.find(
      {
        userId: userId,
      },
      '_id',
    ); // 해당 userId를 포함한 PersonalRoomInfo 전부 검색.

    for (let info of personalRoomInfo) {
      idList.push(info._id);
    }

    for (let recordId of user.thunderRecords) {
      const record = await ThunderRecord.findById(recordId);
      thunderList.push(record.thunderId);
    }

    const currentTime = new Date().getDate() + 3600000 * 9;

    const thunderNotToDelete = await Thunder.find({
      $in: thunderList,
      'members.0': {$in: idList},
      deadline: {$gt: currentTime},
    });

    if (thunderNotToDelete) {
      throw errorGenerator({
        msg: message.USER_CANNOT_DELETE,
        statusCode: statusCode.FORBIDDEN,
      });
    } else {
      for (let thunderId of thunderList) {
        // 번개에서 사용자 id 빼기.
        await Thunder.findByIdAndUpdate(thunderId, {
          $pull: {members: {$in: idList}},
        });
      }

      for (let record of user.thunderRecords) {
        //사용자 명의로 된 thunderRecord 삭제.
        await ThunderRecord.findByIdAndDelete(record);
      }

      for (let info of idList) {
        //사용자 명의로 된 PersonalRoomInfo 삭제.
        await PersonalChatRoom.findByIdAndDelete(info);
      }

      await User.findByIdAndDelete(userId); //최종적으로 사용자 정보 삭제.
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getUserForProfileUpdate = async (userId: string) => {
  try {
    const data: UserInfo | null = await User.findById(userId);

    if (!data) {
      throw errorGenerator({
        msg: message.NOT_FOUND_USER,
        statusCode: statusCode.NOT_FOUND,
      });
    }

    const result: UserInfoDto = {
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
  userUpdateDto: UserUpdateDto,
  userId: string,
): Promise<void> => {
  try {
    await User.findByIdAndUpdate(userId, userUpdateDto);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const findUserHashtag = async (
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

const findUserThunderRecord = async (
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

const findUserAlarmState = async (
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
  findUserById,
  findUserByKakao,
  deleteUser,
  getUserForProfileUpdate,
  updateUser,
  findUserHashtag,
  findUserThunderRecord,
  findUserAlarmState,
};
