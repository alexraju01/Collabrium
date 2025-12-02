import { Router } from "express";
import { protect, restrictTo } from "../controllers/auth.controller";
import {
	createTaskList,
	deleteTaskList,
	getAllTaskLists,
	getOneTaskList,
	updateTaskList,
} from "../controllers/taskList.controller";

export const taskListRouter = Router({ mergeParams: true });

taskListRouter.use(protect);

taskListRouter.route("/").get(getAllTaskLists).post(restrictTo("admin"), createTaskList);
taskListRouter
	.route("/:taskListId")
	.get(getOneTaskList)
	.patch(restrictTo("admin"), updateTaskList)
	.delete(restrictTo("admin"), deleteTaskList);
