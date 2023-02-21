import { UserCreateDto } from '../interfaces/user/UserCreateDto';
import { UserUpdateDto } from '../interfaces/user/UserUpdateDto';
import { UserResponseDto } from '../interfaces/user/UserResponseDto';
import User from '../models/User';


const createUser = async (userCreateDto: UserCreateDto) => {
    try {
        const user = new User({
            name: userCreateDto.name,
            introduction: userCreateDto.introduction,
            mannerTemperature: userCreateDto.mannerTemperature,
            hashtags: userCreateDto.hashtags,
            kakaoId: userCreateDto.kakaoId,
            fcmToken: userCreateDto.fcmToken
        });

        await user.save();
        const data = {
            _id: user._id
        };

        return data;
    } catch (error)
    {
        console.log(error);
        throw(error);
    };
}

const updateUser = async (userId: string, userUpdateDto: UserUpdateDto) => {
    try {
        const updatedUser = {
            name: userUpdateDto.name,
            introduction: userUpdateDto.introduction,
            mannerTemperature: userUpdateDto.mannerTemperature,
            hashtags: userUpdateDto.hashtags,
            kakaoId: userUpdateDto.kakaoId,
            fcmToken: userUpdateDto.fcmToken
        }

        await User.findByIdAndUpdate(userId, updatedUser);

    } catch (error)
    {
        console.log(error);
        throw(error);
    };
}

const findUserById = async (userId: string) => {
    try {
        const user: UserResponseDto | null = await User.findById(userId);

        return user;
    } catch (error)
    {
        console.log(error);
        throw(error);
    };
}


const findUserList = async () => {
    try {
        const users: UserResponseDto[] | null = await User.find();

        return users;
    } catch (error)
    {
        console.log(error);
        throw(error);
    };
}

const findUserByKakao = async (userId: any) => {
    try {
        const user: UserResponseDto | null = await User.findOne({kakaoId: userId});

        return user;
    } catch (error)
    {
        console.log(error);
        throw(error);
    }

};

const deleteUser = async (userId: string) => {
    try {
        await User.findByIdAndDelete(userId);
    } catch (error)
    {
        console.log(error);
        throw(error);
    };
}



export default {
    createUser,
    updateUser,
    findUserById,
    findUserList,
    deleteUser,
    findUserByKakao
}