import { Request, Response } from 'express';
import Workspace from '../models/workspace.model';

export const getAllWorkspace = async (_: Request, res: Response) => {
  const workspaces = await Workspace.findAll();

  res.status(200).json({ status: 'success', results: workspaces.length, workspaces });
};

export const createWorkspace = async (req: Request, res: Response) => {
  const { name } = req.body;
  console.log(name);
  const workspace = await Workspace.create({ name });

  res.status(200).json({ status: 'success', workspace });
};
