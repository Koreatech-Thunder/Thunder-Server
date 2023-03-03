
import User from '../models/User';




const deleteUser = async (userId: string) => {
    try {
        await User.findByIdAndDelete(userId);
    } catch (error) {
        console.log(error);
        throw (error);
    };
};




export default {
    deleteUser,
}