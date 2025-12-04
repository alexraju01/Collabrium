import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/workspace/$workspaceId/tasklist/$tasklistId")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/workspace/$workspaceId/tasklist/$tasklistId"!</div>;
}
