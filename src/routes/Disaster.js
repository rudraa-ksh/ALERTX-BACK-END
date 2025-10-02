import Router from 'express';
import {disasterInfo, allDisaster} from '../controllers/disasterController.js';
import {auth} from "../middleware/auth.js";

const router = Router();

router.get('/disasters', auth, allDisaster);
router.get('/disasterinfo',auth,  disasterInfo);

export default router;