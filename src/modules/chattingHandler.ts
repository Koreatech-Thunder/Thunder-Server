import Thunder from '../models/Thunder';
import User from '../models/User';

const getThunders = async (userId: string): Promise<void> => {
  const user = await User.findById(userId);

  const result = user.thunderRecords;
};
