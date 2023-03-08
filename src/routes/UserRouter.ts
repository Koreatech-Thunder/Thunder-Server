import { Router } from "express";
import { UserController } from "../controllers";

const router: Router = Router();

router.put('/:userId', UserController.updateUser);
router.get('/:userId', UserController.findUserById);

export default router;