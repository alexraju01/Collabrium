import { Router } from 'express';
import {
  getAllTasks,
  getOneTask,
  updateTask,
} from '../controllers/task.controller';

export const taskRouter = Router();

taskRouter.route('/').get(getAllTasks);

taskRouter.route('/:id').get(getOneTask).patch(updateTask);
