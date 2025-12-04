import { WorkspaceUser } from "../models/workspaceUser.model.ts";
import AppError from "./AppError.ts";

export const checkWorkspaceAdmin = async (userId: number, workspaceId: number) => {
	const workspaceUser = await WorkspaceUser.findOne({
		where: { userId, workspaceId },
	});

	if (!workspaceUser) {
		throw new AppError("User is not part of this workspace", 403);
	}

	if (workspaceUser.role !== "admin") {
		throw new AppError("You do not have permission to perform this action", 403);
	}

	return true;
};
