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
import dayjs from 'dayjs';
import User from './models/User';

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
  reconnect: true,
});

io.on('connect', (socket: any) => {
  const accessToken = socket.handshake.headers.authorization;
  console.log(`연결 성공 - 소켓ID: ${socket.id}`);

  socket.on('subscribeChatRoom', () => {
    // 채팅방 목록 진입
    console.log(`채팅방 목록 진입 성공 - 소켓ID: ${socket.id}`);
    const decoded = jwt.decode(accessToken);
    const userId = (decoded as any).user.id;
    const thunders: Promise<ThunderInfo[]> =
      chattingHandler.getThunders(userId);

    thunders.then(async (thunderInfos: any) => {
      for (const thunder of thunderInfos) {
        const tempMember: ObjectId[] = [];
        for (const chatroomId of thunder.members) {
          try {
            const foundChatRoom = await PersonalChatRoom.findOne({
              _id: chatroomId,
            });

            const foundUserId = foundChatRoom.userId;
            if (userId === foundUserId.toString()) {
              console.log('scChatRoom - connect state changed!');
              //console.log('s1: ', foundChatRoom);
              await PersonalChatRoom.findByIdAndUpdate(foundChatRoom._id, {
                isConnect: true,
              });

              console.log('state: ', foundChatRoom);
            }
            tempMember.push(foundChatRoom._id);
          } catch (err) {
            throw errorGenerator({
              msg: message.NOT_FOUND_MEMBER,
              statusCode: statusCode.NOT_FOUND,
            });
          }
        }
        await chattingHandler.updateThunderMembers(thunder._id, tempMember);
        await socket.join(thunder._id.toString());
      }
    });
  });

  socket.on('unsubscribeChatRoom', () => {
    // 채팅방 목록 이탈
    console.log(`채팅방 목록 이탈 성공 - 소켓ID: ${socket.id}`);
    const decoded = jwt.decode(accessToken);
    const userId = (decoded as any).user.id;
    const thunders: Promise<ThunderInfo[]> =
      chattingHandler.getThunders(userId);
    thunders.then(async (thunderInfos: any) => {
      for (const thunder of thunderInfos) {
        const tempMember: ObjectId[] = [];
        for (const chatroomId of thunder.members) {
          try {
            const foundChatRoom = await PersonalChatRoom.findOne({
              _id: chatroomId,
            });

            const foundUserId = foundChatRoom.userId;
            if (userId === foundUserId.toString()) {
              console.log('unscChatRoom - connect state changed!');
              //console.log('lastState: ', foundChatRoom);
              await PersonalChatRoom.findByIdAndUpdate(foundChatRoom._id, {
                isConnect: false,
              });
              console.log('state: ', foundChatRoom);
            }
            tempMember.push(foundChatRoom._id);
          } catch (err) {
            throw errorGenerator({
              msg: message.NOT_FOUND_MEMBER,
              statusCode: statusCode.NOT_FOUND,
            });
          }
        }
        await chattingHandler.updateThunderMembers(thunder._id, tempMember);
        await socket.leave(thunder._id.toString());
      }
    });
  });

  socket.on('subscribeChat', async (thunderId: any) => {
    console.log(`채팅방 진입 성공 - 소켓ID: ${socket.id}`);
    const decoded = jwt.decode(accessToken);
    const userId = (decoded as any).user.id;

    const thunder: Promise<ThunderInfo> = chattingHandler.getThunder(thunderId);

    try {
      const thunderInfo: ThunderInfo = await thunder;
      const tempMember: ObjectId[] = [];

      for (const chatroomId of thunderInfo.members) {
        const foundChatRoom = await PersonalChatRoom.findOne({_id: chatroomId});

        if (!foundChatRoom) {
          throw errorGenerator({
            msg: message.NOT_FOUND_MEMBER,
            statusCode: statusCode.NOT_FOUND,
          });
        }

        const foundUserId = foundChatRoom.userId;

        if (userId === foundUserId.toString()) {
          console.log('scChat - connect state changed!');
          //console.log('lastState: ', foundChatRoom);
          await PersonalChatRoom.findByIdAndUpdate(foundChatRoom._id, {
            isConnect: true,
          });
          console.log('state: ', foundChatRoom);
        }

        tempMember.push(foundChatRoom._id);
      }

      await chattingHandler.updateThunderMembers(thunderId, tempMember);
      await socket.join(thunderId);
    } catch (err) {
      throw errorGenerator({
        msg: message.NOT_FOUND,
        statusCode: statusCode.NOT_FOUND,
      });
    }
  });

  socket.on('unsubscribeChat', async (thunderId: any) => {
    console.log(`채팅방 이탈 성공 - 소켓ID: ${socket.id}`);
    const decoded = jwt.decode(accessToken);
    const userId = (decoded as any).user.id;

    const thunder: Promise<ThunderInfo> = chattingHandler.getThunder(thunderId);

    try {
      const thunderInfo: ThunderInfo = await thunder;
      const tempMember: ObjectId[] = [];

      for (const chatroomId of thunderInfo.members) {
        const foundChatRoom = await PersonalChatRoom.findOne({_id: chatroomId});

        if (!foundChatRoom) {
          throw errorGenerator({
            msg: message.NOT_FOUND_MEMBER,
            statusCode: statusCode.NOT_FOUND,
          });
        }

        const foundUserId = foundChatRoom.userId;
        if (userId === foundUserId.toString()) {
          console.log('unscChat - connect state changed!');
          //console.log('lastState: ', foundChatRoom);
          await PersonalChatRoom.findByIdAndUpdate(foundChatRoom._id, {
            isConnect: false,
          });
          console.log('state: ', foundChatRoom);
        }

        tempMember.push(foundChatRoom._id);
      }

      await chattingHandler.updateThunderMembers(thunderId, tempMember);

      await socket.leave(thunderId);
    } catch (err) {
      throw errorGenerator({
        msg: message.NOT_FOUND,
        statusCode: statusCode.NOT_FOUND,
      });
    }
  });

  socket.on('sendMessage', (msg: {thunderId: string; message: string}) => {
    const decoded = jwt.decode(accessToken);
    const userId = (decoded as any).user.id;

    const parsed = JSON.parse(msg.toString());

    const chatEntity = new Chat({
      message: parsed.message,
      sender: userId,
      createdAt: Date.now() + 3600000 * 9,
    });

    chatEntity.save();

    chattingHandler.updateChats(parsed.thunderId, chatEntity);

    const user: Promise<UserInfo> = chattingHandler.getUser(userId);
    user.then((userInfo: UserInfo) => {
      const userDto: ChatUserDto = {
        userId: userId,
        name: userInfo.name,
      };
      const chatDto: ChatDto = {
        id: chatEntity.id,
        thunderId: parsed.thunderId,
        user: userDto,
        message: parsed.message,
        createdAt: dayjs(chatEntity.createdAt).format('MM/DD HH:mm'),
        state: 'OTHER',
      };

      const myChatDto: ChatDto = {
        id: chatEntity.id,
        thunderId: parsed.thunderId,
        user: userDto,
        message: parsed.message,
        createdAt: dayjs(chatEntity.createdAt).format('MM/DD HH:mm'),
        state: 'ME',
      };

      socket.broadcast.to(parsed.thunderId).emit('newChat', chatDto);
      io.to(socket.id).emit('newChat', myChatDto);
    });

    const thunder: Promise<ThunderInfo> = chattingHandler.getThunder(
      parsed.thunderId,
    );
    thunder.then((thunderInfo: ThunderInfo) => {
      thunderInfo.members.forEach(function (chatroomId: ObjectId) {
        PersonalChatRoom.findOne({_id: chatroomId}).exec(
          async (err, foundChatRoom) => {
            if (err) {
              throw errorGenerator({
                msg: message.NOT_FOUND_MEMBER,
                statusCode: statusCode.NOT_FOUND,
              });
            } else {
              const isConnect = foundChatRoom.isConnect;
              console.log(
                'isConnect of ',
                foundChatRoom.userId,
                ' : ',
                isConnect,
              );
              const isAlarm = foundChatRoom.isAlarm;
              console.log('isAlarm of ', foundChatRoom.userId, ' : ', isAlarm);
              console.log('userId: ', foundChatRoom.userId);
              console.log(
                '전체알람설정 : ',
                await chattingHandler.isAlarm(foundChatRoom.userId.toString()),
              );
              if (
                !isConnect &&
                isAlarm &&
                (await chattingHandler.isAlarm(foundChatRoom.userId.toString()))
              ) {
                const userInfo = await User.findById(userId);

                await pushHandler.pushAlarmToUser(
                  foundChatRoom.userId.toString(),
                  thunderInfo.title + ' : 새 메시지',
                  userInfo.name + ' : ' + parsed.message,
                  parsed.thunderId,
                );
              }
            }
          },
        );
      });
    });
  });

  socket.on('disconnect', (reason: any) => {
    console.log(reason);
    console.log(`연결 종료 - 소켓ID: ${socket.id}`);
    socket.rooms.forEach((room: any) => {
      socket.leave(room);
    });
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
