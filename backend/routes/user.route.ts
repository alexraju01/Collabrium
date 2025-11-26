import { Router } from 'express';
import { deleteUser, getAllUsers, getOneUser } from '../controllers/user.controller';
import { signUp } from '../controllers/auth.controller';

export const userRouter = Router();

userRouter.post('/signup', signUp);

userRouter.route('/').get(getAllUsers);
userRouter.route('/:id').get(getOneUser).delete(deleteUser);
