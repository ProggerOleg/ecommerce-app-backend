import { createUser, forgotPasswordToken, getUser, handleRefreshToken, logginUser, logoutUser, resetPassword, updatePassword } from '../controller/user.contoller';
import { authMiddleware } from '../middlewares/auth.middleware';
import express from 'express';


const router = express.Router();

router.post('/register', createUser);
router.post('/forgot-password-token', forgotPasswordToken);
router.put('/reset-password/:token', resetPassword);

router.put('/password', authMiddleware, updatePassword);
router.post('/login', logginUser);
router.get('/logout', logoutUser);
router.get('/refresh', handleRefreshToken);
router.get('/:id', authMiddleware, getUser);

export { router as authRouter };
