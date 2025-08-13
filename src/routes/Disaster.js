import Router from 'express';
import {disasterInfo, allDisaster} from '../controllers/disasterController.js';

const router = Router();

router.get('/disasters', allDisaster);
router.get('/disasterinfo', disasterInfo);

export default router;