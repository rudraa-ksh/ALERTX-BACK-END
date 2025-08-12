import Router from 'express';
import { checkUser, checkNewUser} from '../controllers/userController.js';

const router = Router();

router.get('/check', checkUser);
router.get('/checknew', checkNewUser);

export default router;