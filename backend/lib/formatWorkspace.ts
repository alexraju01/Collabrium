export const formatWorkspace = (workspace: any) => {
	const ws = workspace.toJSON();

	// Flatten members
	const members = ws.allMembers?.map((member: any) => ({
		id: member.id,
		displayName: member.displayName,
		email: member.email,
		role: member.WorkspaceUser?.role,
	}));

	return {
		...ws,
		allMembers: members,
		memberCount: members?.length || 0,
	};
};

export const formatWorkspaces = (workspaces: any[]) => {
	return workspaces.map((workspace) => formatWorkspace(workspace));
};
