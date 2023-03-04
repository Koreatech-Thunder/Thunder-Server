
import { UserInfoDto } from '../interfaces/user/UserInfoDto';
import User from '../models/User';


const getUserForProfileUpdate = async (userId: any) => {

    try {
        const data: UserInfoDto | null = await User.findById(userId);

        return data;
    }

    catch (error) {
        console.log(error);
        throw (error);
    }
    

}

export default {
    getUserForProfileUpdate
}