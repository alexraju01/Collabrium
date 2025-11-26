import { NextFunction, Request, Response } from 'express';
import User from '../models/user.model';
import AppError from '../lib/AppError';

export const getAllUsers = async (_: Request, res: Response) => {
  const users = await User.findAll();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users },
  });
};

export const getOneUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await User.findByPk(id);

  res.status(200).json({ status: 'success', data: { user } });
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const deleteUser = await User.destroy({
    where: {
      id,
    },
  });

  if (!deleteUser) return next(new AppError('This user does not exist', 404));

  res.status(204).json({
    status: 'success',
    data: null,
  });
};
