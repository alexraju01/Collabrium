import type { SimpleTaskResponse } from "./ITask";

export interface DashboardResponse {
	/** All tasks asigned to me, ordered by due date desc */
	myTasks: SimpleTaskResponse[];

	/** Next task due date */
	nextDueDate: Date;

	/** Total workspaces I am in */
	totalWorkspaces: number;

	/** Total tasks that are assigned to me */
	totalTasks: number;

	/** Total tasks that are assigned to me and have a status of not started */
	totalTasksNotStarted: number;

	/** Total tasks that are assigned to me and have a status of in progress */
	totalTasksInProgress: number;

	/** Total tasks that are assigned to me and have a status of completed */
	totalTasksCompleted: number;

	/** Total tasks that are assigned to me and have a status of in review */
	totalTasksInReview: number;

	/** Gets the next 6 months work of due tasks for each month */
	monthlyBreakdown: {
		/** Full date time stamp of month */
		month: Date;
		/** Total tasks due  */
		dueTotal: number;
	}[];

	/** sum of all time logs under my user */
	totalTimeSpent: number;
}
