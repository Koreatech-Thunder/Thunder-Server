import { Router } from "express";
import { UserController } from "../controllers";

const router: Router = Router();

router.delete('/:userId', UserController.deleteUser);

export default router;