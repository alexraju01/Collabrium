import { Router } from "express";
import {
	assignUsersToTask,
	createTask,
	deleteTask,
	getAllSimpleTask,
	getAllTasks,
	getOneTask,
	searchTasks,
	updateTask,
	updateTaskStatus,
} from "../controllers/task.controller";
import { protect, restrictTo } from "../controllers/auth.controller";

export const taskRouter = Router();

taskRouter.route("/").get(protect, getAllTasks).post(protect, createTask);
taskRouter.route("/simple").get(getAllSimpleTask);
taskRouter.route("/search").get(protect, searchTasks);
taskRouter.route("/:taskId/assign").patch(protect, restrictTo("admin"), assignUsersToTask);

taskRouter.route("/:id/status").patch(protect, restrictTo("admin", "user"), updateTaskStatus);

taskRouter
	.route("/:id")
	.get(protect, getOneTask)
	.patch(protect, restrictTo("admin"), updateTask)
	.delete(protect, restrictTo("admin"), deleteTask);
