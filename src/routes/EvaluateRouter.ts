//router index file
import {Router} from 'express';
import EvaluateController from '../controllers/evaluate/EvaluateController';
import auth from '../middlewares/auth';

const router: Router = Router();

router.put('/:thunderId', auth.auth, EvaluateController.evaluateThunder);
router.get('/:userId/:thunderId', EvaluateController.getUserEvaluateInfo);

export default router;
