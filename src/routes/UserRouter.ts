import { Router } from "express";
import { UserController } from "../controllers";

const router: Router = Router();

router.put('/:userId', UserController.updateUser);
router.get('/:userId', UserController.findUserById);
router.delete('/:userId', UserController.deleteUser);
router.get('/profile/:userId', UserController.getUserForProfileUpdate);
router.post('/alarm', UserController.pushAlarmToUser);

export default router;