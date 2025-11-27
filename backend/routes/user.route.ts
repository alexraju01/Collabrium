import { Router } from 'express';
import { deleteUser, getAllUsers, getOneUser } from '../controllers/user.controller';
import { forgotPassword, login, resetPassword, signUp } from '../controllers/auth.controller';

export const userRouter = Router();

userRouter.post('/signup', signUp);
userRouter.post('/login', login);

userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password', resetPassword);

userRouter.route('/').get(getAllUsers);
userRouter.route('/:id').get(getOneUser).delete(deleteUser);
