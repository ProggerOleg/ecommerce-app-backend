const express = require('express');
const { createUser } = require('../controller/user.contoller');
const router = express.Router();
router.post('/register');


router.post('/register', createUser);

export { router as authRouter };
