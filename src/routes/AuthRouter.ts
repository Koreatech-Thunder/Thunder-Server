import { Router } from "express";
import { AuthController } from "../controllers";
import auth from "../middlewares/auth";



const router: Router = Router();



router.post("/login",  AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/logout', auth.auth, AuthController.logout);

export default router;