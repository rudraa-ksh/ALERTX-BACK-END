import Router from 'express';
import { createDisaster, updateDisaster} from '../controllers/adminController.js';

const router = Router();

router.post('/disaster', createDisaster);
router.patch('/disaster', updateDisaster);

export default router;