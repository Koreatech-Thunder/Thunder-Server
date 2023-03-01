import { Router } from "express";
import { UserController } from "../controllers";

const router: Router = Router();

router.post('/', UserController.createUser);
router.put('/:userId', UserController.updateUser);
router.get('/:userId', UserController.findUserById);
router.get('/', UserController.findUserList);
router.delete('/:userId', UserController.deleteUser);
router.get('/profile/:userId', UserController.getUserForProfileUpdate);

export default router;