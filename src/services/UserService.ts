import { UserUpdateDto } from "../interfaces/user/UserUpdateDto";
import { UserResponseDto } from "../interfaces/user/UserResponseDto";
import User from "../models/User";

const updateUser = async (userId: any, userUpdateDto: UserUpdateDto) => {
  try {
    const updatedUser = {
      name: userUpdateDto.name,
      introduction: userUpdateDto.introduction,
      mannerTemperature: userUpdateDto.mannerTemperature,
      hashtags: userUpdateDto.hashtags,
      isLogOut: userUpdateDto.isLogOut,
      kakaoId: userUpdateDto.kakaoId,
      fcmToken: userUpdateDto.fcmToken,
    };

    await User.findByIdAndUpdate(userId, updatedUser);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

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

export default {
  updateUser,
  findUserById,
  findUserByKakao,
};
