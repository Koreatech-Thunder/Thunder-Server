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
        msg: '유저 정보를 불러올 수 없습니다.',
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
        msg: '유저 정보를 불러오지 못했습니다.',
        statusCode: statusCode.NOT_FOUND,
      });
    }

    const result: UserInfoDto = {
      name: data.name,
      introduction: data.introduction,
      hashtags: data.hashtags,
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
    const existUsername = await User.findOne({
      name: userUpdateDto.name,
    });
    if (existUsername) {
      throw errorGenerator({
        msg: message.CONFLICT_USER_NAME,
        statusCode: statusCode.CONFLICT,
      });
    }

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
      hashtags: user!.hashtags,
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
    const user = await User.findById(userId);

    const thunderRecord: UserThunderRecordResponseDto[] = [];

    await Promise.all(
      user!.thunderRecords.map(async (record: any) => {
        const thunder = await Thunder.findById(record);

        thunderRecord.push({
          thunderId: thunder!._id,
          title: thunder!.title,
          deadline: thunder!.deadline.toString(),
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
