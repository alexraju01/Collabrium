import { NextFunction, Request, Response } from 'express';
import Task from '../models/task.model';
import AppError from '../lib/AppError';
import { Op } from 'sequelize';
import APIFeatures, { QueryString } from '../lib/APIFearure';
import { checkMembership, requireAuth } from './taskList.controller';
import TaskList from '../models/taskList.model';
import { WorkspaceUser } from '../models/workspaceUser.model';

export const getAllTasks = async (req: Request, res: Response, next: NextFunction) => {
  const userId = requireAuth(req);
  const { workspaceId, taskListId } = req.body;

  if (!workspaceId) return next(new AppError('Workspace ID is required to fetch tasks', 400));

  const workspaceIdNumber = Number(workspaceId);
  if (isNaN(workspaceIdNumber)) return next(new AppError('Invalid Workspace ID format', 400));

  // Authorization check
  await checkMembership(
    userId,
    workspaceIdNumber,
    'You are not a member of this workspace or it does not exist.',
  );

  // Fetch task lists
  const taskLists = taskListId
    ? await TaskList.findAll({
        where: { id: taskListId, workspaceId: workspaceIdNumber },
        attributes: ['id'],
      })
    : await TaskList.findAll({
        where: { workspaceId: workspaceIdNumber },
        attributes: ['id'],
        group: ['TaskList.id'],
      });

  if (taskLists.length === 0) {
    return res.status(200).json({ status: 'success', results: 0, data: { tasks: [] } });
  }

  const taskListIds = taskLists.map((tl) => tl.id);

  // Build query options
  const features = new APIFeatures(Task, req.query as QueryString).filter().sort();
  const queryOptions = features.options;

  // Fetch tasks
  const tasks = await Task.findAll({
    ...queryOptions,
    where: {
      ...(queryOptions.where as object),
      taskListId: { [Op.in]: taskListIds },
    },
    include: [{ model: TaskList, as: 'taskList', attributes: ['id', 'title', 'workspaceId'] }],
  });

  res.status(200).json({ status: 'success', results: tasks.length, data: { tasks } });
};

export const getOneTask = async (req: Request, res: Response, next: NextFunction) => {
  // 1. Authentication: Get user ID and resource ID from request
  const userId = requireAuth(req);
  const { workspaceId, taskListId } = req.body;
  const { id } = req.params;

  if (!taskListId || !workspaceId)
    return next(new AppError('taskListId and workspaceId are required', 400));

  await checkMembership(
    userId,
    Number(workspaceId),
    'You do not have permission to view tasks in this workspace',
  );

  const task = await Task.findOne({
    where: {
      id: id,
      taskListId: taskListId,
      workspaceId: workspaceId,
    },
  });

  // 5. Handle Not Found: Task ID is missing OR context is invalid
  if (!task) {
    return next(
      new AppError('Task not found or does not belong to the specified Task List/Workspace.', 404),
    );
  }

  // 6. Success: Return the found task
  res.status(200).json({
    status: 'success',
    data: {
      task,
    },
  });
};
export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  const userId = requireAuth(req);
  const { id } = req.params;
  const { workspaceId, taskListId, title: rawTitle } = req.body;
  const updatedData = req.body;

  if (!taskListId || !workspaceId)
    return next(new AppError('taskListId and workspaceId are required', 400));
  const title = rawTitle.trim();

  if (!title) {
    return next(new AppError('Task title is required', 400));
  }
  updatedData.title = title;
  await checkMembership(
    userId,
    workspaceId,
    'You do not have permission to create a task in this workspace',
  );

  const taskListExists = await TaskList.findOne({
    where: {
      id: taskListId,
      workspaceId: workspaceId,
    },
  });

  if (!taskListExists) {
    return next(
      new AppError(
        'The specified Task List does not exist or is not in the provided workspace.',
        404,
      ),
    ); // 404 Not Found
  }

  const [updatedCount, updatedTask] = await Task.update(updatedData, {
    where: { id },
    returning: true,
  });

  if (!updatedCount) return next(new AppError('ID with this task does not exist', 404));

  res.status(200).json({
    message: 'success',
    task: updatedTask,
  });
};

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  const userId = requireAuth(req);
  const { workspaceId, taskListId, title } = req.body;
  const taskData = req.body;

  if (!taskListId || !workspaceId)
    return next(new AppError('taskListId and workspaceId are required', 400));

  if (!title) {
    return next(new AppError('Task title is required', 400));
  }

  await checkMembership(
    userId,
    workspaceId,
    'You do not have permission to create a task in this workspace',
  );

  const taskListExists = await TaskList.findOne({
    where: {
      id: taskListId,
      workspaceId: workspaceId,
    },
  });

  if (!taskListExists) {
    return next(
      new AppError(
        'The specified Task List does not exist or is not in the provided workspace.',
        404,
      ),
    ); // 404 Not Found
  }

  const existingTask = await Task.findOne({
    where: {
      title: title,
      taskListId: taskListId, // Crucial: Scope the check to the specific TaskList
    },
  });

  if (existingTask) {
    return next(
      new AppError(`A task with the title "${title}" already exists in this task list.`, 409),
    ); // 409 Conflict
  }
  const newTask = await Task.create(taskData);

  res.status(201).json({
    status: 'success',
    data: newTask,
  });
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const deleteTask = await Task.destroy({
    where: {
      id,
    },
  });

  if (!deleteTask) return next(new AppError('This task does not exist', 404));

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

//  ====================== Simple Task =====================

export const getAllSimpleTask = async (_: Request, res: Response) => {
  const simpleTasks = await Task.findAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'description'],
    },
  });
  res.status(200).json({ status: 'success', results: simpleTasks.length, data: { simpleTasks } });
};

//  ====================== Search Task =====================

export const searchTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. Get the authenticated user's ID
  const userId = requireAuth(req);
  // 2. Get the search query string from the request query parameters
  const query = req.query.q as string;
  if (!query || query.trim() === "") {
    return res.status(400).json({
      status: "fail",
      message: "Search query (q) is required.",
    });
  }
  // 3. Find all Workspace IDs the user is a member of
  const userWorkspaces = await WorkspaceUser.findAll({
    where: { userId },
    attributes: ["workspaceId"], // We only need the IDs
  });
  const workspaceIds = userWorkspaces.map((wu) => wu.workspaceId);
  if (workspaceIds.length === 0) {
    return res.status(200).json({
      status: "success",
      results: 0,
      data: {
        tasks: [],
      },
      message: "You are not a member of any workspace.",
    });
  }
  // 4. Search for Tasks within those Workspaces matching the title query
  const tasks = await Task.findAll({
    where: {
      workspaceId: {
        [Op.in]: workspaceIds, // Task belongs to one of the user's workspaces
      },
      title: {
        [Op.iLike]: `%${query}%`, // Case-insensitive partial match
      },
    },
    order: [
      ["createdAt", "DESC"], // Order results, e.g., by creation date
    ],
  });
  // 5. Send the response
  res.status(200).json({
    status: "success",
    results: tasks.length,
    data: {
      tasks,
    },
  });
};
