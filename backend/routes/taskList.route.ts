import { Router } from 'express';
import { protect } from '../controllers/auth.controller';
import {
  createTaskList,
  deleteTaskList,
  getAllTaskLists,
  updateTaskList,
} from '../controllers/taskList.controller';

export const taskListRouter = Router({ mergeParams: true });

taskListRouter.use(protect);

taskListRouter.route('/').get(getAllTaskLists).post(createTaskList);
taskListRouter.route('/:taskListId').patch(updateTaskList).delete(deleteTaskList);
