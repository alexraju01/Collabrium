import { NextFunction, Request, Response } from 'express';
import User from '../models/user.model';
import jwt, { Secret } from 'jsonwebtoken';
import AppError from '../lib/AppError';

const signToken = (id: string): string => {
  const secret: Secret = process.env.JWT_SECRET!;
  const expiresIn = process.env.JWT_EXPIRES_IN;
  return jwt.sign({ id }, secret, { expiresIn: expiresIn as any });
};

export const signUp = async (req: Request, res: Response) => {
  const { username, email, password, confirmPassword } = req.body;

  const newUser = await User.create({
    username,
    email,
    password,
    confirmPassword,
  });

  console.log(typeof newUser.id);
  const token = signToken(String(newUser.id));

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.scope('withPasswords').findOne({
    where: {
      email: email,
    },
  });

  if (!user || !(await user.correctPassword(password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const token = signToken(String(user.id));

  res.status(200).json({
    status: 'success',
    token,
  });
};
