import {Router} from 'express';
import {ChatController} from '../controllers';
import auth from '../middlewares/auth';

const router: Router = Router();

router.get('/', auth.auth, ChatController.getChatRooms);
router.get('/:thunderId', auth.auth, ChatController.getChatRoomDetail);
router.put('/:thunderId/alarm', auth.auth, ChatController.putChatRoomAlarm);

export default router;
