import { useState } from "react";
import { apiGet, apiPost } from "@/lib/fetchAxios";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";

export const Route = createFileRoute("/workspace")({
	beforeLoad: async () => {
		const user = await apiGet("/user/me");
		if (!user) throw redirect({ to: "/login" });
		return { user };
	},
	loader: async () => {
		const { data: workspace, results: totalWorkspace } = await apiGet("workspace");
		return { workspace, totalWorkspace };
	},
	component: WorkspacePage,
});

function WorkspacePage() {
	const {
		workspace: { workspaces },
		totalWorkspace,
	} = Route.useLoaderData();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [newWorkspaceName, setNewWorkspaceName] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleCreateWorkspace = async () => {
		if (!newWorkspaceName.trim()) return;

		setIsLoading(true);
		try {
			await apiPost("/workspace/create", { name: newWorkspaceName });
			window.location.reload();
		} catch (err) {
			console.error(err);
			alert("Failed to create workspace");
		} finally {
			setIsLoading(false);
			setIsModalOpen(false);
			setNewWorkspaceName("");
		}
	};

	return (
		<main className='flex flex-col md:flex-row gap-6 p-6 md:p-10 bg-gray-50 min-h-screen'>
			{/* Sidebar */}
			<aside className='w-full md:w-64 bg-white shadow-lg rounded-2xl p-6 border border-gray-200 flex flex-col'>
				<h2 className='text-xl font-bold text-gray-800 mb-6'>Navigation</h2>
				<ul className='space-y-3 flex-1'>
					<li>
						<Link
							to='/overview'
							className='block p-3 rounded-lg hover:bg-blue-50 transition-all text-gray-700 font-medium'>
							Overview
						</Link>
					</li>
				</ul>
			</aside>

			{/* Main Content */}
			<section className='flex-1 flex flex-col gap-6'>
				{/* Header */}
				<div className='flex justify-between items-center'>
					<h1 className='text-3xl font-extrabold text-gray-900'>Workspace Overview</h1>
					<button
						onClick={() => setIsModalOpen(true)}
						className='inline-flex items-center gap-2 bg-linear-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-xl shadow-md transform hover:-translate-y-1 transition-all duration-300'>
						<PlusIcon />
						Create Workspace
					</button>
				</div>

				{/* Metrics Cards */}
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
					<div className='bg-linear-to-b from-white to-blue-50 border border-blue-300 p-6 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 cursor-pointer '>
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
							to={`/workspace/${workspace.id}`}
							className='bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-6 border border-gray-200 flex flex-col justify-between hover:bg-indigo-50'>
							<h3 className='text-lg font-semibold text-gray-900 truncate'>{workspace.name}</h3>
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
					{workspaces.length === 0 && (
						<p className='text-gray-500 col-span-full'>No workspaces found.</p>
					)}
				</div>
			</section>

			{/* Modal from Daisy UI */}
			{isModalOpen && (
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
							<button onClick={() => setIsModalOpen(false)} className='btn btn-ghost'>
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
		</main>
	);
}

export default WorkspacePage;
