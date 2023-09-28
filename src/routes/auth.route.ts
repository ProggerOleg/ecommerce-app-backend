import { blockUser, createUser, deleteUser, forgotPasswordToken, getAllUsers, getUser, handleRefreshToken, logginUser, logoutUser, resetPassword, unblockUser, updatePassword, updateUser } from '../controller/user.contoller';
import { authMiddleware, isAdmin } from '../middlewares/auth.middleware';
import express from 'express';


const router = express.Router();

router.post('/register', createUser);
router.post('/forgot-password-token', forgotPasswordToken);
router.put('/reset-password/:token', resetPassword);

router.put('/password', authMiddleware, updatePassword);
router.post('/login', logginUser);
router.get('/logout', logoutUser);
router.get('/all-users', getAllUsers);
router.get('/refresh', handleRefreshToken);
router.put('/edit-user', authMiddleware, updateUser);
router.get('/:id', authMiddleware, isAdmin, getUser);
router.delete('/:id', deleteUser);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser);

export { router as authRouter };
