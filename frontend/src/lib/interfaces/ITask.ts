import type { Priority, TaskStatus } from "./types";
import type { AccountResponse } from "./IAccount";
import type { ActivityResponse } from "./IActivity";
import type { TimeLogResponse } from "./ITimeLog";


export interface TaskRequest {
	/** Task UUID */
	id?: string;

	/** Due date of task */
	dueDate?: Date;

	/** Status of the task */
	status?: TaskStatus;

	/** Task Priority */
	priority?: Priority;

	/** Task title */
	title?: string;

	/** Task description */
	description?: string;

	/** Task tags */
	tags?: string[];
}

export interface TaskResponse {
	/** Task UUID */
	id: string;

	/** Task creation date */
	createdAt: Date;

	/** Task update date */
	updatedAt: Date;

	/** Account assigned to the task */
	assignedTo: AccountResponse[];

	/** Account that created the task */
	createdBy: AccountResponse;

	/** Task due date */
	dueDate?: Date;

	/** Task completed on date */
	completedDate?: Date;

	/** Time logs against the task */
	timeLogs: TimeLogResponse[];

	/** Task status */
	status: TaskStatus;

	/** Task priority */
	prioity: Priority;

	/** Task title */
	title: string;

	/** Task description */
	description: string;

	/** Task tags */
	tags: string[];

	/** Task activity  */
	activity: ActivityResponse[];
}

export interface SimpleTaskResponse {
	/** UUID of the task */
	id: string;

	/** parent tasklist UUID  */
	parentId: string;

	/** Task title */
	title: string;

	/** list of accounts the task is assigned to */
	assignedTo: AccountResponse[];

	/** Task due date */
	dueDate?: Date;

	/** Task status */
	status: TaskStatus;

	/** Task priority  */
	prioity: Priority;

	/** Task tags */
	tags: string[];

	/** Total time spent in seconds on the task, sum of time logs */
	timeSpend: number;
}
