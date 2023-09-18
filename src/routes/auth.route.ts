import { blockUser, createUser, deleteUser, getAllUsers, getUser, logginUser, unblockUser, updateUser } from '../controller/user.contoller';
import { authMiddleware, isAdmin } from '../middlewares/auth.middleware';
import express from 'express';
const router = express.Router();


router.post('/register', createUser);
router.post('/login', logginUser);
router.get('/all-users', getAllUsers);
router.get('/:id', authMiddleware, isAdmin, getUser);
router.delete('/:id', deleteUser);
router.put('/edit-user', authMiddleware, updateUser);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser);


export { router as authRouter };
