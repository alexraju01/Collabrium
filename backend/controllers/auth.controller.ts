import { Request, Response } from 'express';
import User from '../models/user.model';
import jwt, { Secret } from 'jsonwebtoken';

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
  //   console.log(typeof (process.env.JWT_SECRET as Secret));
  const token = signToken(String(newUser.id));

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
};
