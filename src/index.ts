import express, {Request, Response} from 'express';
const app = express();
import connectDB from './loaders/db';
import routes from '././routes';
require('dotenv').config();
const jwt = require('jsonwebtoken');
import chattingHandler from './modules/chattingHandler';
import {ThunderInfo} from './interfaces/thunder/ThunderInfo';
import {UserInfo} from './interfaces/user/UserInfo';
import {PersonalChatRoomInfo} from './interfaces/chat/PersonalChatRoomInfo';
import {ObjectId} from 'mongoose';
import PersonalChatRoom from './models/PersonalChatRoom';

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

const server = app
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

const socketio = require('socket.io');

const io = socketio(server, {path: '/socket.io'});
io.on('connect', (socket: any) => {
  console.log(`Connection : SocketId = ${socket.id}`);

  socket.on('subscribeChatRoom', async () => {
    const userId = jwt.verify(
      socket.handshake.headers.authorization,
      process.env.SECRET_KEY,
    );
    const thunders: ThunderInfo[] = await chattingHandler.getThunders(userId);

    thunders.forEach(function (thunder: ThunderInfo) {
      const tempMember = [];
      thunder.members.forEach(function (member: ObjectId) {
        if(PersonalChatRoom.findOne({_id: member}).populate("userId"))
      });
    });
  });
});
