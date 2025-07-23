import Router from 'express';
import { checkUser} from '../controllers/userController.js';

const router = Router();

router.get('/check', checkUser);

export default router;