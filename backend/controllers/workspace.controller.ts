import { NextFunction, Request, Response } from 'express';
import Workspace from '../models/workspace.model';
import AppError from '../lib/AppError';

export const getAllWorkspace = async (_: Request, res: Response) => {
  const workspaces = await Workspace.findAll({
    order: [['id', 'asc']],
  });

  res.status(200).json({ status: 'success', results: workspaces.length, data: { workspaces } });
};

export const createWorkspace = async (req: Request, res: Response) => {
  console.log(req.body);
  const { name } = req.body;
  console.log(name);
  const workspace = await Workspace.create({ name });

  res.status(200).json({ status: 'success', data: { workspace } });
};

export const updateWorkspace = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { name } = req.body;
  const workspace = await Workspace.findByPk(id);

  if (!workspace) {
    return next(new AppError('Workspace with this ID does not exist', 404));
  }

  const updatedWorkspace = await workspace.update({ name });

  res.status(200).json({
    status: 'success',
    data: updatedWorkspace,
  });
};
