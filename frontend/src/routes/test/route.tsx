import { Button } from "@/components/Button";
import { TaskWindow } from "@/components/TaskWindow";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/test")({
	component: RouteComponent,
});

function RouteComponent() {
	const [currentTaskId, setCurrentTaskId] = useState("");

	return (
		<div className="w-full min-w-screen min-h-screen h-full bg-neutral-300 relative">
			<div className="flex flex-col">
				{/* Simple tasks, id */}
				<Button onClick={() => setCurrentTaskId("1")}>Open Task</Button>
				<Button onClick={() => setCurrentTaskId("2")}>Open Task</Button>
				<Button onClick={() => setCurrentTaskId("3")}>Open Task</Button>
				<Button onClick={() => setCurrentTaskId("4")}>Open Task</Button>
				<Button onClick={() => setCurrentTaskId("5")}>Open Task</Button>
			</div>
			{currentTaskId && (
				<TaskWindow role="Admin" id={currentTaskId} closeTask={setCurrentTaskId} />
			)}
		</div>
	);
}
