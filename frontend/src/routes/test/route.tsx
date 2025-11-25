import { TaskWindow } from "@/components/TaskWindow";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/test")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="w-full min-w-screen min-h-screen h-full bg-neutral-300">
			<TaskWindow />
		</div>
	);
}
