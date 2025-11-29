import type { AccountResponse } from "./IAccount";

export interface CreateTimeLogRequest {
	/** UUID of the task its assigned to */
	parentId: string;

	/** Account UUID that created the task */
	createdBy: string;

	/** Date the time is logged for */
	logDate: Date;

	/** Total time spent in seconds */
	timeSpent: number;
}

export interface EditTimeLogRequest {
	/** UUID of the time log to edit */
	id: string;

	/** UUID of the task this time log is under */
	parentId: string;

	/** Date the time is logged for */
	logDate?: Date;

	/** Total time spent in seconds */
	timeSpent?: number;
}

export interface TimeLogResponse {
	/** UUID of the time log */
	id: string;

	/** UUID of the task the time log is under */
	parentId: string;

	/** Account that created the time log */
	createdBy: AccountResponse;

	/** Date the time log was created for */
	logDate: Date;

	/** Time spent in seconds logged against the time */
	timeSpent: number;
}
