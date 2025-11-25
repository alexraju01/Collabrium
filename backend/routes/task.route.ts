import express, { Request, Response, Router } from 'express';

export const taskRouter = Router();

taskRouter.get('/', (_: Request, res: Response) => {
  res.status(200).json({ status: 'success', message: 'Task route is working' });
});
