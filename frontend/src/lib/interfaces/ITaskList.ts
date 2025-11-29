import type { SimpleTaskResponse } from "./ITask";

export interface CreateTaskListRequest {
	/** Workspace id to assign this tasklist under */
	parentId: string;

	/** Name of this tasklist */
	name: string;
}

export interface EditTaskListRequest {
	/** UUID of the task to edit */
	id: string;

	/** UUID of the workspace this task list is under */
	paretnId: string;

	/** Task list name to update to */
	name: string;
}

export interface TaskListResponse {
	/** UUID of the tasklist */
	id: string;

	/** UUID of the workspace this task list is under */
	parentId: string;

	/** Task list name */
	name: string;

	/** Date the task list was created */
	createdAt: Date;

	/** Array of simple tasks under this tasklist */
	tasks: SimpleTaskResponse[];
}
