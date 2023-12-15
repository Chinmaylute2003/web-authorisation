import express from 'express';
import { loginUser, registerUser, getUser, logout } from '../controllers/index.js';
import { protect } from "../middleware/index.js"
const router = express.Router();

router.get('/userinfo', protect, getUser)


router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logout);
export default router;