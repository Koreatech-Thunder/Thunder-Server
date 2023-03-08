import User from '../models/User';
import errorGenerator from '../errors/errorGenerator';
import statusCode from '../modules/statusCode';
import { UserInfoDto } from '../interfaces/user/UserInfoDto';
import { UserInfo } from '../interfaces/user/UserInfo';


const deleteUser = async (userId: string) => {
    try {

        const user = await User.findById(userId);

        if (!user) {
            throw errorGenerator({
                msg: '유저 정보를 불러올 수 없습니다.',
                statusCode: statusCode.NOT_FOUND
            })
        }

        await User.findByIdAndDelete(userId);

    } catch (error) {
        console.log(error);
        throw (error);
    };
};


const getUserForProfileUpdate = async (userId: string) => {

    try {
        const data: UserInfo | null = await User.findById(userId);

        if (!data) {
            throw errorGenerator ({
                msg: '유저 정보를 불러오지 못했습니다.',
                statusCode: statusCode.NOT_FOUND
            })
        }
        
        const result: UserInfoDto = {
            "name": data.name,
            "introduction": data.introduction,
            "hashtags" : data.hashtags
        }

        return result;
    }

    catch (error) {
        console.log(error);
        throw (error);
    }
    

}

export default {
    deleteUser,
    getUserForProfileUpdate,
}