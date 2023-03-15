import statusCode from '../modules/statusCode';
import {Request, Response} from 'express';
import AuthService from '../services/AuthService';
import errorGenerator from '../errors/errorGenerator';
import tokenStatus from '../modules/tokenStatus';

const login = async (req: Request, res: Response): Promise<void> => {
  const fcmToken = req.body['fcmToken'];
  const kakaoToken = req.body['kakaoToken'];

  if (!fcmToken || !kakaoToken) {
    throw errorGenerator({
      msg: '토큰이 존재하지 않습니다.',
      statusCode: statusCode.NOT_FOUND,
    });
  }

  try {
    const tokenData = await AuthService.login(kakaoToken, fcmToken);
    res.status(statusCode.OK).json(tokenData);
  } catch (error: any) {
    if (error.statusCode == statusCode.CONFLICT) {
      //동일 유저 존재로 인한 에러인 경우 CONFLICT 코드 발송.
      res.status(statusCode.CONFLICT).send(statusCode.CONFLICT);
    } else if (error.statusCode.NOT_FOUND) {
      //카카오 서버에서 값을 가져오지 못했다면 NOT FOUND 발송.
      res.status(statusCode.NOT_FOUND).send(statusCode.NOT_FOUND);
    } else if (error.statusCode.BAD_REQUEST) {
      //유저 정보 수정 완료 전 어플리케이션 종료로 수정 작업이 제대로 종료되지 못했다면 BAD REQUEST 발송.
      res.status(statusCode.BAD_REQUEST).send(statusCode.BAD_REQUEST);
    } else {
      res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(statusCode.INTERNAL_SERVER_ERROR);
    }
  }
};

const refresh = async (req: Request, res: Response): Promise<void> => {
  const accessToken = req.body['accessToken'];
  const refreshToken = req.body['refreshToken'];

  if (!accessToken || !refreshToken) {
    throw errorGenerator({
      msg: '토큰이 존재하지 않습니다.',
      statusCode: statusCode.NOT_FOUND,
    });
  }

  try {
    const data = await AuthService.refresh(accessToken, refreshToken);

    if (data === tokenStatus.INVALID_TOKEN) {
      res.status(statusCode.UNAUTHORIZED);
    }
    if (data === tokenStatus.ALL_TOKENS_HAS_EXPIRED) {
      res.status(statusCode.UNAUTHORIZED);
    }
    if (data === tokenStatus.VALID_TOKEN) {
      res.status(statusCode.FORBIDDEN);
    }

    res.status(statusCode.OK).json({accessToken: data});
  } catch (error) {
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(statusCode.INTERNAL_SERVER_ERROR);
  }
};

const logout = async (req: Request, res: Response): Promise<void> => {
  const userId = req.body['userId'];

  if (!userId) {
    throw errorGenerator({
      msg: '유저가 존재하지 않습니다.',
      statusCode: statusCode.NOT_FOUND,
    });
  }

  try {
    await AuthService.logout(userId);
    res.status(statusCode.OK).send(statusCode.OK);
  } catch (error: any) {
    if (error.statusCode == statusCode.NOT_FOUND) {
      res.status(statusCode.NOT_FOUND).send(statusCode.NOT_FOUND);
    } else if (error.statusCode == statusCode.BAD_REQUEST) {
      res.status(statusCode.BAD_REQUEST).send(statusCode.BAD_REQUEST);
    }
    {
      res
        .status(statusCode.INTERNAL_SERVER_ERROR)
        .send(statusCode.INTERNAL_SERVER_ERROR);
    }
  }
};

export default {
  login,
  refresh,
  logout,
};
