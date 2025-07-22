import Router from 'express';
import { disasters} from '../controllers/disasterController.js';

const router = Router();


router.get('/disasters', disasters);



export default router;