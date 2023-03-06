import User from '../models/User';
import axios from 'axios';
import errorGenerator from '../errors/errorGenerator';
import statusCode from '../modules/statusCode';


const deleteUser = async (userId: string) => {
    try {

        const user = await User.findById(userId);

        if (!user) {
            throw errorGenerator({
                msg: '유저 정보를 불러올 수 없습니다.',
                statusCode: statusCode.NOT_FOUND
            })
        }

        await axios.post("https://kapi.kakao.com/v2/user/unlink", { 
            headers: {
                Authorization: `Bearer ${user.accessToken}`,
            },
        });

        await User.findByIdAndDelete(userId);

    } catch (error) {
        console.log(error);
        throw (error);
    };
};




export default {
    deleteUser,
}