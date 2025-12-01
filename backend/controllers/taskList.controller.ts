import { NextFunction, Request, Response } from 'express';
import TaskList from '../models/taskList.model';
import { WorkspaceUser } from '../models/workspaceUser.model';
import AppError from '../lib/AppError';
import Workspace from '../models/workspace.model';
import Task from '../models/task.model';
import { sequelize } from '../config/db';

export const requireAuth = (req: Request) => {
  const userId = req.user?.id;
  if (!userId) throw new AppError('User not authenticated', 401);
  return userId;
};

export const checkMembership = async (
  userId: number,
  workspaceId: number,
  errorMessage?: string,
) => {
  const isMember = await WorkspaceUser.findOne({ where: { userId, workspaceId } });
  if (!isMember)
    throw new AppError(errorMessage || 'You do not have permission for this workspace', 403);
};

export const getAllTaskLists = async (req: Request, res: Response, next: NextFunction) => {
  const userId = requireAuth(req);
  const { workspaceId } = req.body;

  await checkMembership(
    userId,
    workspaceId,
    'You do not have permission to view task lists in this workspace',
  );

  if (!workspaceId) return next(new AppError('workspaceId is required', 400));

  const memberships = await WorkspaceUser.findAll({
    where: { workspaceId },
    attributes: ['workspaceId'],
    order: [['id', 'ASC']],
  });

  if (memberships.length === 0) {
    return res.status(200).json({
      status: 'success',
      results: 0,
      data: { taskLists: [] },
    });
  }

  const workspaceIds = memberships.map((m) => m.workspaceId);

  const taskLists = await TaskList.findAll({
    where: { workspaceId: workspaceIds },
    order: [['id', 'ASC']],
  });

  res.status(200).json({ status: 'success', results: taskLists.length, data: { taskLists } });
};

export const getOneTaskList = async (req: Request, res: Response, next: NextFunction) => {
  const userId = requireAuth(req);
  const { taskListId } = req.params;
  const { workspaceId } = req.body;

  if (!workspaceId) return next(new AppError('workspaceId is required', 400));

  await checkMembership(
    userId,
    workspaceId,
    'You do not have permission to view task lists in this workspace',
  );

  const taskList = await TaskList.findOne({
    where: { id: taskListId, workspaceId },
    include: [{ model: Task, as: 'tasks' }],
  });

  if (!taskList) return next(new AppError('Task list not found', 404));

  res.status(200).json({ status: 'success', data: { taskList } });
};

export const createTaskList = async (req: Request, res: Response, next: NextFunction) => {
  const userId = requireAuth(req);
  const { title: rawTitle, workspaceId } = req.body;
  const title = rawTitle?.trim();

  if (!title || !workspaceId) return next(new AppError('Title and workspaceId are required', 400));

  await checkMembership(
    userId,
    workspaceId,
    'You do not have permission to create task lists in this workspace',
  );

  const existingTaskList = await TaskList.findOne({
    where: { title, workspaceId },
  });

  if (existingTaskList)
    return next(new AppError('A task list with this title already exists in this workspace', 400));

  await sequelize.query(
    `SELECT setval(pg_get_serial_sequence('"TaskLists"', 'id'), COALESCE(MAX(id), 1)) FROM "TaskLists";`,
  );

  const taskList = await TaskList.create({ title, workspaceId });

  res.status(201).json({ status: 'success', data: { taskList } });
};

export const updateTaskList = async (req: Request, res: Response, next: NextFunction) => {
  const userId = requireAuth(req);
  const { taskListId } = req.params;
  const { title: rawTitle, workspaceId } = req.body;

  const title = rawTitle?.trim();

  if (!title || !workspaceId) {
    return next(new AppError('Title and workspaceId are required', 400));
  }
  await checkMembership(
    userId,
    workspaceId,
    'You do not have permission to update task lists in this workspace',
  );

  const taskList = await TaskList.findOne({
    where: { id: taskListId, workspaceId },
  });

  if (!taskList) return next(new AppError('Task list not found', 404));

  const existingTaskList = await TaskList.findOne({
    where: { title, workspaceId },
  });

  if (existingTaskList)
    return next(new AppError('A task list with this title already exists in this workspace', 400));

  await taskList.update({ title });

  res.status(200).json({ status: 'success', data: { taskList: taskList } });
};

export const deleteTaskList = async (req: Request, res: Response, next: NextFunction) => {
  const userId = requireAuth(req);
  const { taskListId } = req.params;
  const { workspaceId } = req.body;

  if (!workspaceId) {
    return next(new AppError('workspaceId is required', 400));
  }

  // 2. Check if workspace exists
  const workspace = await Workspace.findByPk(workspaceId);
  if (!workspace) {
    return next(new AppError('Workspace not found', 404));
  }

  await checkMembership(
    userId,
    workspaceId,
    'You do not have permission to delete task lists in this workspace',
  );

  const taskList = await TaskList.findOne({
    where: { id: taskListId, workspaceId },
  });

  if (!taskList) return next(new AppError('Task list not found', 404));

  await taskList.destroy();

  res.status(204).json({ status: 'success', data: null });
};
