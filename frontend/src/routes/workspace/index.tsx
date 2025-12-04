// @ts-nocheck
import { createFileRoute, redirect, Router } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { apiGet, apiPost, apiDelete } from "@/lib/fetchAxios";
import { Link } from "@tanstack/react-router";
import { PlusIcon, Trash2, UserPlus } from "lucide-react";

export const Route = createFileRoute("/workspace/")({
	beforeLoad: async () => {
		const user = await apiGet("/user/me");
		if (!user) throw redirect({ to: "/login" });
		return { user };
	},

	loader: () => {
		return {};
	},

	pendingComponent: () => (
		<div className='flex justify-center items-center h-screen'>
			<span className='loading loading-spinner loading-lg text-indigo-600'></span>
		</div>
	),

	component: WorkspacePage,
});

function WorkspacePage() {
	const [loading, setLoading] = useState(true);
	const [workspaces, setWorkspaces] = useState([]);
	const [totalWorkspace, setTotalWorkspace] = useState(0);

	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

	const [newWorkspaceName, setNewWorkspaceName] = useState("");
	const [inviteCode, setInviteCode] = useState("");

	const [isLoading, setIsLoading] = useState(false);

	const fetchWorkspaces = async () => {
		setLoading(true);
		try {
			const ws = await apiGet("workspace");
			setWorkspaces(ws.data.workspaces);
			setTotalWorkspace(ws.results);
		} catch (error) {
			console.error("Failed to fetch workspaces:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchWorkspaces();
	}, []);

	const handleCreateWorkspace = async () => {
		if (!newWorkspaceName.trim()) return;

		setIsLoading(true);
		try {
			await apiPost("/workspace/create", { name: newWorkspaceName });
			await fetchWorkspaces();
			setIsCreateModalOpen(false);
			setNewWorkspaceName("");
		} catch (err) {
			console.error(err);
			alert("Failed to create workspace");
		} finally {
			setIsLoading(false);
		}
	};

	const handleJoinWorkspace = async () => {
		if (!inviteCode.trim()) return;

		setIsLoading(true);
		try {
			await apiPost("/workspace/join", { inviteCode });
			await fetchWorkspaces();
			setIsJoinModalOpen(false);
			setInviteCode("");
		} catch (err) {
			console.error(err);
			alert("Failed to join workspace. Please check the invite code.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleDeleteWorkspace = async (workspaceId, workspaceName, event) => {
		event.preventDefault();
		event.stopPropagation();

		try {
			await apiDelete(`/workspace/${workspaceId}`);
			await fetchWorkspaces();
		} catch (err) {
			console.error(`Failed to delete workspace ${workspaceId}:`, err);
			alert("Failed to delete workspace. Please try again.");
		}
	};

	if (loading) {
		return (
			<main className='flex flex-col md:flex-row gap-6 p-6 md:p-10 bg-gray-50 min-h-screen animate-pulse'>
				<section className='flex-1 flex flex-col gap-8'>
					{/* Header Row */}
					<div className='flex justify-between items-center'>
						<div className='h-10 w-60 bg-gray-200 rounded'></div>
						<div className='h-12 w-48 bg-gray-300 rounded-xl'></div>
					</div>

					{/* Metrics Card */}
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
						<div className='h-28 bg-gray-200 rounded-2xl'></div>
					</div>

					{/* Title */}
					<div className='h-7 w-52 bg-gray-200 rounded'></div>

					{/* Workspace Cards */}
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
						{Array.from({ length: 8 }).map((_, i) => (
							<div key={i} className='h-40 bg-gray-200 rounded-2xl shadow-md'></div>
						))}
					</div>
				</section>
			</main>
		);
	}

	return (
		<main className='flex flex-col md:flex-row gap-6 p-6 md:p-10 bg-gray-50 min-h-screen'>
			<section className='flex-1 flex flex-col gap-6'>
				<div className='flex justify-between items-center '>
					<h1 className='text-3xl font-extrabold text-gray-900'>Workspace Overview</h1>
					<div className='flex gap-3'>
						<button
							onClick={() => setIsCreateModalOpen(true)}
							className='btn btn-primary flex items-center gap-2'>
							<PlusIcon className='h-4 w-4' /> Create Workspace
						</button>
						<button
							onClick={() => setIsJoinModalOpen(true)}
							className='btn btn-secondary flex items-center gap-2'>
							<UserPlus />
							Join Workspace
						</button>
					</div>
				</div>

				{/* Metrics */}
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
					<div className='bg-white border border-blue-300 p-6 rounded-2xl shadow-lg'>
						<h3 className='text-sm font-semibold text-indigo-600 mb-2 text-center'>
							Active Workspaces
						</h3>
						<p className='text-2xl font-bold text-indigo-800 text-center'>{totalWorkspace}</p>
					</div>
				</div>

				{/* My Workspaces */}
				<h2 className='text-2xl font-bold text-gray-800 mt-8 mb-4 border-b pb-2'>My Workspaces</h2>
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
					{workspaces.map((workspace) => (
						<Link
							key={workspace.id}
							to='/workspace/$workspaceId'
							params={{ workspaceId: workspace.id }}
							className='group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-6 border border-gray-200 flex flex-col justify-between hover:bg-indigo-50'>
							<button
								onClick={(e) => handleDeleteWorkspace(workspace.id, workspace.name, e)}
								className='absolute top-3 right-3 p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-500 hover:text-white transition duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 z-10'
								title='Delete Workspace'>
								<Trash2 className='h-4 w-4' />
							</button>
							<h3 className='text-lg font-semibold text-gray-900 truncate pr-8'>
								{workspace.name}
							</h3>
							<div className='flex items-center gap-2 mt-4'>
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
								<span className='text-sm font-medium text-indigo-700 bg-indigo-100 rounded-full px-3 py-1'>
									{workspace.memberCount} Member{workspace.memberCount !== 1 && "s"}
								</span>
							</div>
						</Link>
					))}
				</div>
			</section>

			{/* Create Workspace Modal */}
			{isCreateModalOpen && (
				<div className='modal modal-open'>
					<div className='modal-box rounded-xl p-6'>
						<h3 className='text-xl font-bold mb-4'>Create New Workspace</h3>
						<input
							type='text'
							placeholder='Workspace Name'
							value={newWorkspaceName}
							onChange={(e) => setNewWorkspaceName(e.target.value)}
							className='input input-bordered w-full mb-4'
						/>
						<div className='modal-action flex justify-end gap-3'>
							<button onClick={() => setIsCreateModalOpen(false)} className='btn btn-ghost'>
								Cancel
							</button>
							<button
								onClick={handleCreateWorkspace}
								className={`btn btn-primary ${isLoading ? "loading" : ""}`}>
								Create
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Join Workspace Modal */}
			{isJoinModalOpen && (
				<div className='modal modal-open'>
					<div className='modal-box rounded-xl p-6'>
						<h3 className='text-xl font-bold mb-4'>Join Workspace</h3>
						<input
							type='text'
							placeholder='Invite Code'
							value={inviteCode}
							onChange={(e) => setInviteCode(e.target.value)}
							className='input input-bordered w-full mb-4'
						/>
						<div className='modal-action flex justify-end gap-3'>
							<button onClick={() => setIsJoinModalOpen(false)} className='btn btn-ghost'>
								Cancel
							</button>
							<button
								onClick={handleJoinWorkspace}
								className={`btn btn-secondary ${isLoading ? "loading" : ""}`}>
								Join
							</button>
						</div>
					</div>
				</div>
			)}
		</main>
	);
}

export default WorkspacePage;
