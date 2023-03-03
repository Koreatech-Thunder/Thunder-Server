import { Router } from "express";
import { UserController } from "../controllers";

const router: Router = Router();

router.get('/profile/:userId', UserController.getUserForProfileUpdate);

export default router;