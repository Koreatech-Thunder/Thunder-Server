import express, {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import chattingHandler from './modules/chattingHandler';

const app = express();
const http = require('http');
import connectDB from './loaders/db';
import routes from '././routes';
import {ThunderInfo} from './interfaces/thunder/ThunderInfo';
import {ObjectId} from 'mongoose';
import PersonalChatRoom from './models/PersonalChatRoom';
import errorGenerator from './errors/errorGenerator';
import message from './modules/message';
import statusCode from './modules/statusCode';
import {PersonalChatRoomInfo} from './interfaces/chat/PersonalChatRoomInfo';
require('dotenv').config();
const server = http.createServer(app);
const socketio = require('socket.io');

connectDB();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(routes); //라우터
app.use(function (req: Request, res: Response) {
  res.status(404);
  res.render('error');
});

interface ErrorType {
  message: string;
  status: number;
}

app.use(function (err: ErrorType, req: Request, res: Response) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'production' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const io = socketio(server, {
  path: '/socket.io',
  cors: {
    origin: '*',
  },
});

io.on('connect', (socket: any) => {
  console.log(`Connection : Socket Id = ${socket.id}`);
  const accessToken = socket.handshake.headers.authorization;

  socket.on('subscribeChatRoom', () => {
    // 채팅방 목록 진입
    const userId: string = jwt.decode(accessToken) as string;
    const thunders: Promise<ThunderInfo[]> =
      chattingHandler.getThunders(userId);

    thunders.then((thunderInfos: ThunderInfo[]) => {
      thunderInfos.forEach((thunder: ThunderInfo) => {
        const tempMember: ObjectId[] = [];
        thunder.members.forEach(function (chatroomId: ObjectId) {
          PersonalChatRoom.findOne({_id: chatroomId})
            .populate('userId')
            .exec(async (err, foundChatRoom) => {
              if (err) {
                throw errorGenerator({
                  msg: message.NOT_FOUND_MEMBER,
                  statusCode: 404,
                });
              } else {
                const foundUserId = foundChatRoom.userId.toString();
                if (userId === foundUserId) {
                  await chattingHandler.setConnectState(
                    foundChatRoom._id,
                    true,
                  );
                  tempMember.push(foundChatRoom._id);
                } else {
                  tempMember.push(foundChatRoom._id);
                }
              }
            });
        });
        chattingHandler.updateThunderMembers(thunder.thunderId, tempMember);

        socket.join(thunder.thunderId);
      });
    });
  });

  socket.on('unsubscribeChatRoom', () => {
    // 채팅방 목록 이탈
    const userId: string = jwt.decode(accessToken) as string;
    const thunders: Promise<ThunderInfo[]> =
      chattingHandler.getThunders(userId);
    thunders.then((thunderInfos: ThunderInfo[]) => {
      thunderInfos.forEach((thunder: ThunderInfo) => {
        const tempMember: ObjectId[] = [];
        thunder.members.forEach(function (chatroomId: ObjectId) {
          PersonalChatRoom.findOne({_id: chatroomId})
            .populate('userId')
            .exec(async (err, foundChatRoom) => {
              if (err) {
                throw errorGenerator({
                  msg: message.NOT_FOUND_MEMBER,
                  statusCode: 404,
                });
              } else {
                const foundUserId = foundChatRoom.userId.toString();
                if (userId === foundUserId) {
                  await chattingHandler.setConnectState(
                    foundChatRoom._id,
                    false,
                  );
                  tempMember.push(foundChatRoom._id);
                } else {
                  tempMember.push(foundChatRoom._id);
                }
              }
            });
        });
        chattingHandler.updateThunderMembers(thunder.thunderId, tempMember);

        socket.leave(thunder.thunderId);
      });
    });
  });

  socket.on('subscribeChat', (thunderId: string) => {
    const userId: string = jwt.decode(accessToken) as string;
    const thunder: Promise<ThunderInfo> = chattingHandler.getThunder(userId);
    thunder.then((thunderInfo: ThunderInfo) => {
      const tempMember: ObjectId[] = [];
      thunderInfo.members.forEach(function (chatroomId: ObjectId) {
        PersonalChatRoom.findOne({_id: chatroomId})
          .populate('userId')
          .exec(async (err, foundChatRoom) => {
            if (err) {
              throw errorGenerator({
                msg: message.NOT_FOUND_MEMBER,
                statusCode: 404,
              });
            } else {
              const foundUserId = foundChatRoom.userId.toString();
              if (userId === foundUserId) {
                await chattingHandler.setConnectState(foundChatRoom._id, true);
                tempMember.push(foundChatRoom._id);
              } else {
                tempMember.push(foundChatRoom._id);
              }
            }
          });
      });

      chattingHandler.updateThunderMembers(thunderInfo.thunderId, tempMember);

      socket.leave(thunderInfo.thunderId);
    });
  });
});

app
  .listen(process.env.PORT, () => {
    console.log(`
    ################################################
          🛡️  Server listening on port 🛡️
    ################################################
  `);
  })

  .on('error', err => {
    console.error(err);
    process.exit(1);
  });
