import { Router } from 'express';
import { register, login } from '../controllers/auth';
import { cookieMiddleware } from '../controllers/auth/cookieMiddleware';

const router = Router();

router.post('/', register);
router.post('/login', [cookieMiddleware], login);

export default router;
