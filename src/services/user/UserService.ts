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
import ThunderServiceUtils from '../../services/Thunder/ThunderServiceUtils';
import message from '../../modules/message';
import Thunder from '../../models/Thunder';

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

    await User.findByIdAndDelete(userId);
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
    const currentTime = new Date(); //현재 날짜 및 시간
    const user = await User.findById(userId);

    const thunder = await Thunder.find({
      deadline: {$lt: currentTime},
      _id: {$in: user.thunderRecords},
    });

    const thunderRecord: UserThunderRecordResponseDto[] = [];

    await Promise.all(
      thunder.map(async (record: any) => {
        thunderRecord.push({
          thunderId: record._id,
          title: record.title,
          deadline: await ThunderServiceUtils.dateFormat(record.deadline),
          hashtags: record.hashtags,
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
