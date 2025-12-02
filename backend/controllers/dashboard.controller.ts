import { Op } from "sequelize";
import TaskList from "../models/taskList.model";
import Task from "../models/task.model";
import Workspace from "../models/workspace.model";
import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import { requireAuth } from "./taskList.controller";

export const getDashboardData = async (req: Request, res: Response, next: NextFunction) => {
	const userId = requireAuth(req);

	const today = new Date();
	const sixMonthsFromNow = new Date(today);
	sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

	// Fetch workspaces user is part of
	const workspaces = await Workspace.findAll({
		include: [
			{
				model: User,
				as: "allMembers",
				where: { id: userId },
				attributes: [],
			},
		],
		attributes: ["id"],
	});

	const workspaceIds = workspaces.map((w) => w.id);

	// Prepare monthly task counts
	const monthlyTaskCounts: Record<string, number> = {};

	const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

	for (let i = 0; i < 6; i++) {
		const key = `${currentMonth.getFullYear()}-${currentMonth.getMonth() + 1}`;
		monthlyTaskCounts[key] = 0;
		currentMonth.setMonth(currentMonth.getMonth() + 1);
	}
	console.log(monthlyTaskCounts);

	// If no workspaces, return early
	if (workspaceIds.length === 0) {
		return res.json({
			status: "success",
			data: {
				monthlyTasks: formatMonthLabels(monthlyTaskCounts),
				totalWorkspaces: 0,
				totalTasks: 0,
			},
		});
	}

	// Fetch tasks for user's workspaces
	const tasks = await Task.findAll({
		include: [
			{
				model: TaskList,
				as: "taskList",
				required: true,
				where: { workspaceId: workspaceIds },
				attributes: [],
			},
		],
		where: {
			dueBy: { [Op.between]: [today, sixMonthsFromNow] },
		},
		attributes: ["dueBy"],
	});

	// Fill monthly task counts
	for (const task of tasks) {
		if (!task.dueBy) continue;
		const key = `${task.dueBy.getFullYear()}-${task.dueBy.getMonth() + 1}`;
		if (monthlyTaskCounts[key] !== undefined) monthlyTaskCounts[key]++;
	}

	res.json({
		status: "success",
		data: {
			dashboard: {
				monthlyTasks: formatMonthLabels(monthlyTaskCounts),
				totalWorkspaces: workspaceIds.length,
				totalTasks: tasks.length,
			},
		},
	});
};

const formatMonthLabels = (monthlyTaskCounts: Record<string, number>) => {
	const result: Record<string, number> = {};

	for (const key of Object.keys(monthlyTaskCounts)) {
		const [year, month] = key.split("-");
		const date = new Date(Number(year), Number(month) - 1);
		const label = date.toLocaleString("default", { month: "short", year: "numeric" });
		result[label] = monthlyTaskCounts[key];
	}

	return result;
};
