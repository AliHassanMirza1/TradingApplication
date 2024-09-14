import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userController.js';
import { authenticate } from './authenticate.js';

const router = express.Router();

router.get('/profile', getUserProfile);
router.post('/profile/update',updateUserProfile);

export default router;
