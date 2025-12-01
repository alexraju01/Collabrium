import { Router } from 'express';
import {
  createTask,
  deleteTask,
  getAllSimpleTask,
  getAllTasks,
  getOneTask,
  updateTask,
} from '../controllers/task.controller';
import { protect } from '../controllers/auth.controller';

export const taskRouter = Router();

taskRouter.route('/').get(protect, getAllTasks).post(protect, createTask);
taskRouter.route('/simple').get(getAllSimpleTask);

taskRouter
  .route('/:id')
  .get(protect, getOneTask)
  .patch(protect, updateTask)
  .delete(protect, deleteTask);
