import Router from 'express';
import { checkUser, checkNewUser} from '../controllers/userController.js';
import {auth} from "../middleware/auth.js";

const router = Router();

router.get('/check', auth, checkUser);
router.get('/checknew', auth, checkNewUser);

export default router;