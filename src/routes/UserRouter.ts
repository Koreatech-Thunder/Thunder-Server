import { Router } from "express";
import { UserController } from "../controllers";

const router: Router = Router();

router.delete('/:userId', UserController.deleteUser);
router.get('/profile/:userId', UserController.getUserForProfileUpdate);

export default router;