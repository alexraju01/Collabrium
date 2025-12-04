// @ts-nocheck
import { apiGet, apiPost } from "@/lib/fetchAxios";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardIcon, CheckIcon } from "@heroicons/react/24/outline"; // Using Heroicons
import { useEffect, useState } from "react";

interface Member {
	id: number;
	displayName: string;
	email: string;
	role: "admin" | "user";
}

interface WorkspaceDetails {
	id: number;
	name: string;
	memberCount: number;
	inviteCode: string;
	createdAt: string;
	updatedAt: string;
}

interface LoaderData {
	workspace: WorkspaceDetails;
	allMembers: Member[];
}

export const Route = createFileRoute("/workspace/$workspaceId/")({
	loader: async ({ params }) => {
		const { workspaceId } = params;

		try {
			const { data: workspace } = await apiGet<LoaderData>(`/workspace/${workspaceId}`);
			return workspace;
		} catch (error) {
			console.error("Failed to load workspace data:", error);
			throw new Error(`Could not fetch workspace ${workspaceId}`);
		}
	},

	component: RouteComponent,
});

interface DetailCardProps {
	title: string;
	value: string | number;
	colorClass: string;
	boldValue?: boolean;
}

function DetailCard({ title, value, colorClass, boldValue = false }: DetailCardProps) {
	return (
		<div className='bg-white rounded-xl shadow-md p-5 text-center'>
			<h4 className='text-sm text-gray-500 mb-2'>{title}</h4>
			<p className={`text-2xl ${boldValue ? "font-bold" : "font-semibold"} ${colorClass}`}>
				{value}
			</p>
		</div>
	);
}

// Tasklist type
interface Tasklist {
	id: number;
	name: string;
	createdAt: string;
	updatedAt: string;
}

function RouteComponent() {
	const { workspace } = Route.useLoaderData();
	const { workspaceId } = Route.useParams();
	const [copied, setCopied] = useState(false);

	// Tasklists state
	const [tasklists, setTasklists] = useState<Tasklist[]>([]);
	const [loadingTasks, setLoadingTasks] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Copy to clipboard
	const handleCopy = (text: string) => {
		navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	// Fetch tasklists after component mounts
	useEffect(() => {
		const fetchTasklists = async () => {
			setLoadingTasks(true);
			setError(null);
			try {
				const { data } = await apiPost<Tasklist[]>("/tasklist", { workspaceId });
				console.log(data.taskLists);
				setTasklists(data.taskLists);
			} catch (err) {
				console.error(err);
				setError("Failed to load tasklists.");
			} finally {
				setLoadingTasks(false);
			}
		};

		fetchTasklists();
	}, [workspaceId]);

	return (
		<div className='flex min-h-screen bg-gray-50'>
			{/* Sidebar with members */}
			<aside className='w-72 mt-5 mb-5 ml-5 p-5 bg-white rounded-xl shadow-md flex-shrink-0 border border-gray-100'>
				<h3 className='text-lg text-gray-900 border-b-2 border-indigo-600 pb-3 mb-5 font-semibold flex gap-2 justify-center items-center'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-5 w-5 text-indigo-500'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M12 12a4 4 0 100-8 4 4 0 000 8z'
						/>
					</svg>
					<p>Workspace Members ({workspace.memberCount})</p>
				</h3>

				<ul className='list-none p-0'>
					{workspace.allMembers.map((member) => (
						<li
							key={member.id}
							className='flex justify-between items-center py-2.5 border-b border-gray-100 last:border-b-0'>
							<span
								className={
									member.role === "admin" ? "font-semibold text-gray-800" : "text-gray-700"
								}>
								{member.displayName}
							</span>
							{member.role === "admin" && (
								<span className='bg-indigo-600 text-white px-2 py-0.5 rounded text-xs font-bold uppercase'>
									Admin
								</span>
							)}
						</li>
					))}
				</ul>
			</aside>

			{/* Main content */}
			<main className='grow p-5'>
				<h1 className='text-4xl text-gray-900 mb-1 font-bold'>{workspace.name}</h1>
				<p className='text-lg text-indigo-600 mb-8 font-medium'>Workspace ID: {workspaceId}</p>

				<div className='grid grid-cols-2  lg:grid-cols-4 gap-5'>
					<DetailCard
						title='Total Members'
						value={workspace.memberCount}
						colorClass='text-blue-600'
					/>

					<div className='relative bg-white rounded-xl shadow-md p-5 text-center'>
						<h4 className='text-sm text-gray-500 mb-2'>Invite Code</h4>
						<p className='text-2xl font-bold text-yellow-600'>{workspace.inviteCode}</p>
						<button
							onClick={() => handleCopy(workspace.inviteCode)}
							className='absolute top-2 right-2 p-1 text-gray-400 hover:text-indigo-600'>
							{copied ? <CheckIcon className='h-5 w-5' /> : <ClipboardIcon className='h-5 w-5' />}
						</button>
					</div>

					<DetailCard
						title='Created On'
						value={new Date(workspace.createdAt).toLocaleDateString()}
						colorClass='text-gray-900'
					/>
					<DetailCard
						title='Last Updated'
						value={new Date(workspace.updatedAt).toLocaleDateString()}
						colorClass='text-gray-900'
					/>
				</div>

				{/* Tasklists */}
				<section className='mt-10'>
					<h2 className='text-2xl font-semibold mb-4'>Tasklists</h2>

					{loadingTasks && <p>Loading tasklists...</p>}
					{error && <p className='text-red-500'>{error}</p>}

					{!loadingTasks && !error && (
						<>
							{tasklists.length === 0 ? (
								<p className='text-gray-500'>No tasklists available.</p>
							) : (
								<ul className='space-y-3'>
									{tasklists.map((tasklist) => (
										<li
											key={tasklist.id}
											// Applying Collabrium theme styling
											className='bg-white p-4 rounded-lg shadow-sm 
                       cursor-pointer hover:shadow-md transition-shadow duration-150'>
											<Link
												// Tanstack Router's 'to' prop is type-safe and points to the dynamic route path
												to='./tasklist/$tasklistId'
												// The 'params' prop is where you pass the dynamic variable(s)
												params={{ workspaceId: workspace.id, tasklistId: tasklist.id }}
												className='flex justify-between w-full items-center no-underline' // Ensure link covers the area
											>
												<span className='font-medium text-gray-800'>{tasklist.title}</span>
												<span className='text-gray-500 text-sm'>
													Created: {new Date(tasklist.createdAt).toLocaleDateString()}
												</span>
											</Link>
										</li>
									))}
								</ul>
							)}
						</>
					)}
				</section>
			</main>
		</div>
	);
}
