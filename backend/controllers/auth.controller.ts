import { Request, Response } from 'express';
import User from '../models/user.model';
import jwt from 'jsonwebtoken';

export const signUp = async (req: Request, res: Response) => {
  const { username, email, password, confirmPassword } = req.body;
  const newUser = await User.create({
    username,
    email,
    password,
    confirmPassword,
  });


  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
};
