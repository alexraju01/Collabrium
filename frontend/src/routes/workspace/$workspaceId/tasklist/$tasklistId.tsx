// @ts-nocheck
import { apiPost } from "@/lib/fetchAxios";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { useState, useEffect } from "react";

interface Task {
	id: string;
	title: string;
	description?: string;
}

interface TaskListResponse {
	data: {
		taskList: {
			tasks: Task[];
		};
	};
}

export const Route = createFileRoute("/workspace/$workspaceId/tasklist/$tasklistId")({
	component: RouteComponent,
});

function RouteComponent() {
	const { workspaceId, tasklistId } = useParams({
		from: "/workspace/$workspaceId/tasklist/$tasklistId",
	});

	const [tasks, setTasks] = useState<Task[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchTasks() {
			setIsLoading(true);
			setError(null);
			const url = `tasklist/${tasklistId}`;

			try {
				const response = await apiPost<TaskListResponse>(url, {
					workspaceId,
					tasklistId,
				});

				setTasks(response.data.taskList.tasks);
			} catch (err) {
				console.error("Failed to fetch tasks:", err);
				setError("Failed to load tasks.");
			} finally {
				setIsLoading(false);
			}
		}

		fetchTasks();
	}, [workspaceId, tasklistId]);

	// 3. Render the component based on the fetch state
	if (isLoading) {
		return <div className='p-4 text-lg text-gray-600'>Loading tasks...</div>;
	}

	if (error) {
		return <div className='p-4 text-lg text-red-600'>Error: {error}</div>;
	}

	return (
		<div className='p-4 sm:p-6 lg:p-8'>
			<h1 className='text-2xl font-bold mb-4'>Task List</h1>

			{tasks.length > 0 ? (
				<div className='grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
					{tasks.map((task) => (
						// **Task Card Styling**
						<div
							key={task.id}
							className='bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 ease-in-out p-5 border-t-4 border-blue-500 flex flex-col justify-between'>
							<div>
								<h3
									className='text-xl font-semibold text-gray-800 mb-2 truncate'
									title={task.title}>
									{task.title}
								</h3>
								{task.description && (
									<p className='text-gray-600 mb-3 line-clamp-2'>{task.description}</p>
								)}
							</div>
							<div className='text-sm text-gray-400 mt-2 pt-2 border-t border-gray-100'>
								Task ID: <span className='font-mono text-xs'>{task.id}</span>
							</div>
						</div>
					))}
				</div>
			) : (
				<div className='p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center text-yellow-800'>
					<p className='font-medium'>No tasks found for this tasklist.</p>
					<p className='text-sm mt-1'>Time to create a new one!</p>
				</div>
			)}
		</div>
	);
}
