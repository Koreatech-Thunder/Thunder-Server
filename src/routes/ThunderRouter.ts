//router index file
import {Router} from 'express';
import {query} from 'express-validator/check';
import ThunderController from '../controllers/thunder/ThunderController';
import auth from '../middlewares/auth';

const router: Router = Router();

router.get(
  '/hashtags',
  auth.auth,
  [query('hashtag').isString().trim()],
  ThunderController.getThunderByHashtag,
);
router.post('/', auth.auth, ThunderController.createThunder);
router.get('/', auth.auth, ThunderController.getThunderAll);
router.get('/:thunderId', auth.auth, ThunderController.getThunderOne);
router.put('/:thunderId', auth.auth, ThunderController.updateThunder);
router.put('/join/:thunderId', auth.auth, ThunderController.joinThunder);
router.put('/out/:thunderId', auth.auth, ThunderController.outThunder);

export default router;
