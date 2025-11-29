import { NextFunction, Request, Response } from 'express';
import TaskList from '../models/taskList.model';
import { WorkspaceUser } from '../models/workspaceUser.model';
import AppError from '../lib/AppError';

export const getAllTaskLists = async (req: Request, res: Response, next: NextFunction) => {
  const { workspaceId } = req.params;
  const userId = req.user?.id;
  const isMember = await WorkspaceUser.findOne({
    where: {
      userId: userId,
      workspaceId: workspaceId,
    },
  });

  if (!isMember)
    return next(
      new AppError('You do not have permission to view task lists in this workspace', 403),
    );

  const taskLists = await TaskList.findAll({
    where: { workspaceId: workspaceId },
    order: [['id', 'ASC']],
  });

  res.status(200).json({
    status: 'success',
    results: taskLists.length,
    data: {
      taskLists,
    },
  });
};

export const createTaskList = async (req: Request, res: Response, next: NextFunction) => {
  const { workspaceId } = req.params;
  const { title: rawTitle } = req.body;
  const userId = req.user?.id; // Assuming user info is attached to req.user

  if (typeof rawTitle !== 'string') return next(new AppError('title must be string', 400));
  const title = rawTitle.trim();

  const isMember = await WorkspaceUser.findOne({
    where: { userId, workspaceId },
  });

  if (!isMember) {
    return next(
      new AppError('You do not have permission to create task lists in this workspace', 403),
    );
  }

  const taskList = await TaskList.create({
    title,
    workspaceId: +workspaceId,
  });

  res.status(201).json({ status: 'success', data: { taskList } });
};

export const updateTaskList = async (req: Request, res: Response, next: NextFunction) => {
  const { workspaceId, taskListId } = req.params;
  const { title: rawTitle } = req.body;
  const userId = req.user?.id;

  if (typeof rawTitle !== 'string') {
    return next(new AppError('title must be string', 400));
  }
  const title = rawTitle.trim();

  const isMember = await WorkspaceUser.findOne({
    where: { userId, workspaceId },
  });

  if (!isMember) {
    return next(
      new AppError('You do not have permission to update task lists in this workspace', 403),
    );
  }

  // 2. Find the task list
  const taskList = await TaskList.findOne({
    where: { id: taskListId, workspaceId },
  });
  if (!taskList) return next(new AppError('Task list not found', 404));

  await taskList.update({ title });

  res.status(200).json({ status: 'success', data: { taskList: taskList } });
};
