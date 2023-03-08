import statusCode from '../../modules/statusCode';
import UserService from '../../services/user/UserService';

import {Request, Response} from 'express';
import {UserInfoDto} from '../../interfaces/user/UserInfoDto';

const getUserForProfileUpdate = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const {userId} = req.params;

  try {
    const data: UserInfoDto | null = await UserService.getUserForProfileUpdate(
      userId,
    );

    res.status(statusCode.OK).send(data);
  } catch (error) {
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(statusCode.INTERNAL_SERVER_ERROR);
  }
};

export default {
  getUserForProfileUpdate,
};
