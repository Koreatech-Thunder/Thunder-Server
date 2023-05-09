//router index file
import {Router} from 'express';
import ReportController from '../controllers/report/ReportController';
import auth from '../middlewares/auth';

const router: Router = Router();

router.post('/thunder/:thunderId', auth.auth, ReportController.reportThunder);
router.post('/chat/:thunderId', ReportController.reportChat);

export default router;
