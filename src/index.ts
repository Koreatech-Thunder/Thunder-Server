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
import Chat from './models/Chat';
import {UserInfo} from './interfaces/user/UserInfo';
import {ChatUserDto} from './interfaces/chat/ChatUserDto';
import {ChatDto} from './interfaces/chat/ChatDto';
import pushHandler from './modules/pushHandler';
require('dotenv').config();
const server = http.createServer(app);
const socketio = require('socket.io');
import path from 'path';

connectDB();

app.set('view engine', 'ejs'); //'ejs'탬플릿을 엔진으로 한다.
app.set('views', path.join(__dirname, 'views')); //폴더, 폴더경로 지정

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
  cors: {
    origin: '*',
  },
});

io.on('connect', (socket: any) => {
  const accessToken = socket.handshake.headers.authorization;
  console.log(`연결 성공 - 소켓ID: ${socket.id}`);

  socket.on('subscribeChat', async (thunderId: string) => {
    const decoded = jwt.decode(accessToken);
    const userId = (decoded as any).user.id;
    const thunderInfo = await chattingHandler.getThunder(userId);

    const tempMember: ObjectId[] = [];
    for (const chatroomId of thunderInfo.members) {
      try {
        const foundChatRoom = await PersonalChatRoom.findOne({
          _id: chatroomId,
        }).populate('userId');
        const foundUserId = foundChatRoom.userId.toString();
        if (userId === foundUserId) {
          await chattingHandler.setConnectState(foundChatRoom._id, true);
        }
        tempMember.push(foundChatRoom._id);
      } catch (err) {
        throw errorGenerator({
          msg: message.NOT_FOUND_MEMBER,
          statusCode: statusCode.NOT_FOUND,
        });
      }
    }

    await chattingHandler.updateThunderMembers(thunderId, tempMember);
    socket.join(thunderId);
  });

  socket.on('unsubscribeChat', async (thunderId: string) => {
    const decoded = jwt.decode(accessToken);
    const userId = (decoded as any).user.id;
    const thunderInfo = await chattingHandler.getThunder(userId);

    const tempMember: ObjectId[] = [];
    for (const chatroomId of thunderInfo.members) {
      try {
        const foundChatRoom = await PersonalChatRoom.findOne({
          _id: chatroomId,
        }).populate('userId');
        const foundUserId = foundChatRoom.userId.toString();
        if (userId === foundUserId) {
          await chattingHandler.setConnectState(foundChatRoom._id, false);
        }
        tempMember.push(foundChatRoom._id);
      } catch (err) {
        throw errorGenerator({
          msg: message.NOT_FOUND_MEMBER,
          statusCode: statusCode.NOT_FOUND,
        });
      }
    }

    await chattingHandler.updateThunderMembers(thunderId, tempMember);
    socket.leave(thunderId);
  });

  socket.on('subscribeChat', (thunderId: string) => {
    const decoded = jwt.decode(accessToken);
    const userId = (decoded as any).user.id;

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
                statusCode: statusCode.NOT_FOUND,
              });
            } else {
              const foundUserId = foundChatRoom.userId.toString();
              if (userId === foundUserId) {
                await chattingHandler.setConnectState(foundChatRoom._id, true);
              }

              tempMember.push(foundChatRoom._id);
            }
          });
      });

      chattingHandler.updateThunderMembers(thunderId, tempMember);

      socket.join(thunderId);
    });
  });

  socket.on('unsubscribeChat', (thunderId: string) => {
    const decoded = jwt.decode(accessToken);
    const userId = (decoded as any).user.id;
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
                statusCode: statusCode.NOT_FOUND,
              });
            } else {
              const foundUserId = foundChatRoom.userId.toString();
              if (userId === foundUserId) {
                await chattingHandler.setConnectState(foundChatRoom._id, false);
              }
              tempMember.push(foundChatRoom._id);
            }
          });
      });

      chattingHandler.updateThunderMembers(thunderId, tempMember);

      socket.leave(thunderId);
    });
  });

  socket.on('sendMessage', (msg: {thunderId: string; message: string}) => {
    const decoded = jwt.decode(accessToken);
    const userId = (decoded as any).user.id;

    const chatEntity = new Chat({
      message: msg.message,
      sender: userId,
      createdAt: Date.now() + 3600000 * 9,
    });

    chattingHandler.updateChats(msg.thunderId, chatEntity);

    const user: Promise<UserInfo> = chattingHandler.getUser(userId);
    user.then((userInfo: UserInfo) => {
      const userDto: ChatUserDto = {
        id: userId,
        name: userInfo.name,
      };
      const chatDto: ChatDto = {
        id: chatEntity.id,
        thunderId: msg.thunderId,
        user: userDto,
        message: msg.message,
        createdAt: chatEntity.createdAt,
        state: 'OTHER',
      };

      socket.broadcast.to(msg.thunderId).emit('newChat', chatDto);
    });

    const thunder: Promise<ThunderInfo> = chattingHandler.getThunder(
      msg.thunderId,
    );
    thunder.then((thunderInfo: ThunderInfo) => {
      thunderInfo.members.forEach(function (chatroomId: ObjectId) {
        PersonalChatRoom.findOne({_id: chatroomId})
          .populate('userId')
          .exec(async (err, foundChatRoom) => {
            if (err) {
              throw errorGenerator({
                msg: message.NOT_FOUND_MEMBER,
                statusCode: statusCode.NOT_FOUND,
              });
            } else {
              const isConnect = foundChatRoom.isConnect;
              const isAlarm = foundChatRoom.isAlarm;
              if (!isConnect && isAlarm && chattingHandler.isAlarm(userId)) {
                pushHandler.pushAlarmToUser(
                  userId,
                  thunderInfo.title + ': 새 메시지',
                  '새 채팅이 올라왔습니다.',
                );
              }
            }
          });
      });
    });
  });

  socket.on('disconnect', (reason: any) => {
    console.log(reason);
    console.log(`연결 종료 - 소켓ID: ${socket.id}`);
  });

  socket.on('error', (error: any) => {
    console.log(`에러 발생: ${error}`);
  });
});

server
  .listen(process.env.PORT, () => {
    console.log(`
    ################################################
          🛡️  Server listening on port 🛡️
    ################################################
  `);
  })

  .on('error', (err: any) => {
    console.error(err);
    process.exit(1);
  });
