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

export const PrioBg = ["bg-blue-400", "bg-yellow-400", "bg-red-400"];

export const StatusBg = [
	"bg-slate-400",
	"bg-yellow-400",
	"bg-green-400",
	"bg-blue-400",
];
