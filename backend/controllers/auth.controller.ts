import { NextFunction, Request, Response } from 'express';
import User from '../models/user.model';

export const signUp = async (req: Request, res: Response) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
};
