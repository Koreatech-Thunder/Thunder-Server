import { Router } from "express";
import { ThunderController } from "../controllers";

const router: Router = Router();

router.post('/', ThunderController.createThunder);
router.get("/", ThunderController.getThunderList);
router.get("/:postId", ThunderController.getThunder);
router.get("/search/:tag", ThunderController.getThunderByHashtags);

export default router;