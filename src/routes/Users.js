import Router from 'express';
import { checkUser, checkNewUser, registerUser, updateLocation} from '../controllers/userController.js';

const router = Router();

router.get('/check', checkUser);
router.get('/checknew', checkNewUser);
router.post('/register', registerUser)
router.patch('/location', updateLocation)

export default router;