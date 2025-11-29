// type WorkspaceUser = {
// 	workspaceId: number; //make PK
// 	userId: number;
// 	role: Role; //Level of perms in that workspace

// 	id: number; //dont need
// };

/** Workspace User Roles */
export type Role = "Owner" | "Admin" | "User";

/** Task Priority types */
export enum Priority {
	LOW = 0,
	MEDIUM = 1,
	HIGH = 2,
}

/** Task Status types */
export enum TaskStatus {
	NOTSTARTED = 0,
	INPROGRESS = 1,
	COMPLETED = 2,
	INREVIEW = 3,
}
