import Router from 'express';
import { createDisaster, updateDisaster} from '../controllers/adminController.js';
import {auth} from  "../middleware/auth.js";

const router = Router();

router.post('/disaster', auth, createDisaster);
router.patch('/disaster', auth, updateDisaster);

export default router;