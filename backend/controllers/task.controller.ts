import { Request, Response } from 'express';
import Task from '../models/task.model';

export const getAllTasks = async (_: Request, res: Response) => {
  const tasks = await Task.findAll();
  res.status(200).json({ status: 'success', data: tasks });
};
