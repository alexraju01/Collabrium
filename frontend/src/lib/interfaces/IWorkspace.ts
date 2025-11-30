import type { TaskListResponse } from "./ITaskList";
import type { Role } from "./types";

/** Create or edit request */
export interface WorkspaceRequest {
	/** Workspace uuid */
	id?: string;

	/** Workspace name */
	name?: string;
}

export interface WorkspaceResponse {
	/** Workspace uuid */
	id: string;

	/** Workspace name */
	name: string;

	/** Workspace invite code */
	inviteCode: string;

	/** Creation date */
	createdAt: Date;

	/** Update date */
	updatedAt: Date;

	/** Total mambers in this workspace */
	memberCount: number;

	/** Array of task lists inside of this workspace */
	taskLists: TaskListResponse[];

	/** My role in this workspace */
	myRole: Role;

	/** All mambers in this workspace */
	allMembers: {
		/** Users uuid */
		id: number;

		/** Users display name */
		displayName: string;

		/** Users email */
		email: string;

		/** Users role in this workspace */
		role: Role;
	};
}
