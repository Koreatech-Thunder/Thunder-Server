import statusCode from '../../modules/statusCode';
import UserService from '../../services/user/UserService';
import {Request, Response} from 'express';
import {UserInfoDto} from '../../interfaces/user/UserInfoDto';

const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const {userId} = req.params;

  try {
    await UserService.deleteUser(userId);

    res.status(statusCode.NO_CONTENT).send(statusCode.OK);
  } catch (error) {
    console.log(error);
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(statusCode.INTERNAL_SERVER_ERROR);
  }
};

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
  deleteUser,
  getUserForProfileUpdate,
};
