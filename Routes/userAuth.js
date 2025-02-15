import express from 'express'
import auth from '../Middleware/auths.js';
import { register,login,getProfile } from '../Controllers/userController.js'

const router=express.Router();

router.get('/user',auth,getProfile);
router.post('/login',login);
router.post('/register',register);

export default router