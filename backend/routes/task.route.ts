import { Router } from 'express';
import {
  createTask,
  deleteTask,
  getAllTasks,
  getOneTask,
  updateTask,
} from '../controllers/task.controller';
import { protect } from '../controllers/auth.controller';

export const taskRouter = Router();

taskRouter.route('/').get(protect, getAllTasks).post(createTask);

taskRouter.route('/:id').get(getOneTask).patch(updateTask).delete(deleteTask);
