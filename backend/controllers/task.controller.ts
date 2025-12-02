import { NextFunction, Request, Response } from "express";
import Task from "../models/task.model";
import AppError from "../lib/AppError";
import { Op } from "sequelize";
import APIFeatures, { QueryString } from "../lib/APIFearure";
import { checkMembership, requireAuth } from "./taskList.controller";
import TaskList from "../models/taskList.model";
import { WorkspaceUser } from "../models/workspaceUser.model";
import { checkWorkspaceAdmin } from "../lib/checkWorkspaceAdmin";

import { sequelize } from "../config/db";

export const getAllTasks = async (req: Request, res: Response, next: NextFunction) => {
	const { userId } = requireAuth(req);
	const { workspaceId, taskListId } = req.body;

	if (!workspaceId) return next(new AppError("Workspace ID is required to fetch tasks", 400));

	const workspaceIdNumber = Number(workspaceId);
	if (isNaN(workspaceIdNumber)) return next(new AppError("Invalid Workspace ID format", 400));

	// Authorization check
	await checkMembership(
		userId,
		workspaceIdNumber,
		"You are not a member of this workspace or it does not exist."
	);

	// Fetch task lists
	const taskLists = taskListId
		? await TaskList.findAll({
				where: { id: taskListId, workspaceId: workspaceIdNumber },
				attributes: ["id"],
			})
		: await TaskList.findAll({
				where: { workspaceId: workspaceIdNumber },
				attributes: ["id"],
				group: ["TaskList.id"],
			});

	if (taskLists.length === 0) {
		return res.status(200).json({ status: "success", results: 0, data: { tasks: [] } });
	}

	const taskListIds = taskLists.map((tl) => tl.id);

	// Build query options
	const features = new APIFeatures(Task, req.query as QueryString).filter().sort();
	const queryOptions = features.options;

	// Fetch tasks
	const tasks = await Task.findAll({
		...queryOptions,
		attributes: { exclude: ["description"] },
		where: {
			...(queryOptions.where as object),
			taskListId: { [Op.in]: taskListIds },
		},
		include: [{ model: TaskList, as: "taskList", attributes: ["id", "title", "workspaceId"] }],
	});

	res.status(200).json({ status: "success", results: tasks.length, data: { tasks } });
};

export const getOneTask = async (req: Request, res: Response, next: NextFunction) => {
	// 1. Authentication: Get user ID and resource ID from request
	const { userId } = requireAuth(req);
	const { workspaceId, taskListId } = req.body;
	const { id } = req.params;

	if (!taskListId || !workspaceId)
		return next(new AppError("taskListId and workspaceId are required", 400));

	await checkMembership(
		userId,
		Number(workspaceId),
		"You do not have permission to view tasks in this workspace"
	);

	const task = await Task.findOne({
		where: {
			id: id,
			taskListId: taskListId,
			workspaceId: workspaceId,
		},
	});

	// 5. Task ID is missing OR context is invalid
	if (!task) {
		return next(
			new AppError("Task not found or does not belong to the specified Task List/Workspace.", 404)
		);
	}

	// 6. Success: Return the found task
	res.status(200).json({
		status: "success",
		data: {
			task,
		},
	});
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
	const { userId, userRole } = requireAuth(req);

	const { id } = req.params;
	const updatedData = req.body;

	const { workspaceId, taskListId, title: rawTitle } = updatedData;

	if (userRole === "user") {
		if (!workspaceId || !taskListId) {
			return next(new AppError("workspaceId and taskListId are required", 400));
		}

		const allowedUserFields = ["status", "workspaceId", "taskListId"];

		const invalidField = Object.keys(updatedData).find(
			(field) => !allowedUserFields.includes(field)
		);

		if (invalidField) {
			return next(new AppError("Users can only update the status of a task", 403));
		}
	}

	if (userRole === "admin") {
		if (!workspaceId || !taskListId) {
			return next(new AppError("workspaceId and taskListId are required", 400));
		}

		if (!rawTitle?.trim()) {
			return next(new AppError("Task title is required", 400));
		}

		updatedData.title = rawTitle.trim();
	}

	// membership check applies to both
	await checkMembership(
		userId,
		workspaceId,
		"You do not have permission to modify tasks in this workspace"
	);

	// only admins need to validate taskList
	if (userRole === "admin") {
		const taskListExists = await TaskList.findOne({
			where: { id: taskListId, workspaceId },
		});

		if (!taskListExists) {
			return next(new AppError("TaskList not found in this workspace", 404));
		}
	}

	const [updatedCount, updatedTask] = await Task.update(updatedData, {
		where: { id },
		returning: true,
	});

	if (!updatedCount) {
		return next(new AppError("Task ID does not exist", 404));
	}

	res.status(200).json({
		message: "success",
		task: updatedTask,
	});
};

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
	const { userId } = requireAuth(req);
	const { workspaceId, taskListId, title } = req.body;
	const taskData = req.body;

	if (!taskListId || !workspaceId)
		return next(new AppError("taskListId and workspaceId are required", 400));

	if (!title) {
		return next(new AppError("Task title is required", 400));
	}

	await checkMembership(
		userId,
		workspaceId,
		"You do not have permission to create a task in this workspace"
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
				"The specified Task List does not exist or is not in the provided workspace.",
				404
			)
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
			new AppError(`A task with the title "${title}" already exists in this task list.`, 409)
		); // 409 Conflict
	}
	const newTask = await Task.create(taskData);

	res.status(201).json({
		status: "success",
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

	if (!deleteTask) return next(new AppError("This task does not exist", 404));

	res.status(204).json({
		status: "success",
		data: null,
	});
};

//  ====================== Simple Task =====================

export const getAllSimpleTask = async (_: Request, res: Response) => {
	const simpleTasks = await Task.findAll({
		attributes: {
			exclude: ["createdAt", "updatedAt", "description"],
		},
	});
	res.status(200).json({ status: "success", results: simpleTasks.length, data: { simpleTasks } });
};

//  ====================== Search Task =====================

export const searchTasks = async (req: Request, res: Response, next: NextFunction) => {
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

export const assignUsersToTask = async (req: Request, res: Response, next: NextFunction) => {
	const { userId } = requireAuth(req);
	const { taskId } = req.params;

	const { workspaceId, assignedUserIds } = req.body as {
		// taskId: number;
		workspaceId: number;
		assignedUserIds: number[];
	};

	if (!assignedUserIds || !workspaceId) {
		return next(new AppError("assignedUserIds and workspaceId are required", 400));
	}

	if (!Array.isArray(assignedUserIds) || assignedUserIds.length === 0) {
		return next(new AppError("assignedUserIds must be a non-empty array", 400));
	}

	await checkWorkspaceAdmin(userId, workspaceId);

	await sequelize.transaction(async (t) => {
		const task = await Task.findOne({
			where: { id: taskId, workspaceId },
			transaction: t,
		});

		if (!task) {
			throw new AppError("Task not found in the specified workspace", 404);
		}

		// b. Validate all assigned users exist in workspace
		const workspaceUsers = await WorkspaceUser.findAll({
			where: {
				userId: assignedUserIds,
				workspaceId,
			},
			transaction: t,
		});

		if (workspaceUsers.length !== assignedUserIds.length) {
			return next(new AppError("One or more users do not exist in this workspace", 404));
		}

		// c. Merge with existing assigned users
		const existingAssigned: number[] = task.assignedTo || [];
		const updatedAssigned = Array.from(new Set([...existingAssigned, ...assignedUserIds]));
		task.assignedTo = updatedAssigned;

		await task.save({ transaction: t });

		res.status(200).json({
			status: "success",
			data: { task },
		});
	});
};
