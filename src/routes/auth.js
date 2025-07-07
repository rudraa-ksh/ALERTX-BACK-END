import Router from 'express';
import { registerUser, loginUser} from '../controllers/authController.js';

const router = Router();

router.post('/register', registerUser);
router.get('/login', loginUser);
// router.get('/:id', logoutUser);
// router.patch('/:id', updateUser);
// router.delete('/:id', deleteUser);


export default router;