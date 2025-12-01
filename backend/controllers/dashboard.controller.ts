import { Op } from 'sequelize';
import TaskList from '../models/taskList.model';
import Task from '../models/task.model';
import Workspace from '../models/workspace.model';
import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';

export const getDashboardData = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.id;

  const today = new Date();
  const end = new Date(today);
  end.setMonth(end.getMonth() + 6);

  const workspaces = await Workspace.findAll({
    include: [
      {
        model: User,
        as: 'allMembers',
        where: { id: userId },
        attributes: [],
      },
    ],
    attributes: ['id'],
  });

  const workspaceIds = workspaces.map((w) => w.id);

  const buckets: Record<string, number> = {};
  const cursor = new Date(today.getFullYear(), today.getMonth(), 1);

  for (let i = 0; i < 6; i++) {
    const key = `${cursor.getFullYear()}-${cursor.getMonth() + 1}`;
    buckets[key] = 0;
    cursor.setMonth(cursor.getMonth() + 1);
  }

  if (workspaceIds.length === 0) {
    return res.json({ status: 'success', data: formatMonthLabels(buckets) });
  }

  const tasks = await Task.findAll({
    include: [
      {
        model: TaskList,
        as: 'taskList',
        required: true,
        where: { workspaceId: workspaceIds },
        attributes: [],
      },
    ],
    where: {
      dueBy: { [Op.between]: [today, end] },
    },
    attributes: ['dueBy'],
  });

  for (const task of tasks) {
    if (!task.dueBy) continue;
    const key = `${task.dueBy.getFullYear()}-${task.dueBy.getMonth() + 1}`;
    if (buckets[key] !== undefined) buckets[key]++;
  }

  res.json({ status: 'success', data: formatMonthLabels(buckets) });
};

const formatMonthLabels = (buckets: Record<string, number>) => {
  const result: Record<string, number> = {};

  for (const key of Object.keys(buckets)) {
    const [year, month] = key.split('-');
    const date = new Date(Number(year), Number(month) - 1);
    const label = date.toLocaleString('default', { month: 'short', year: 'numeric' });
    result[label] = buckets[key];
  }

  return result;
};
