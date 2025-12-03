import { apiGet } from "@/lib/fetchAxios";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";

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

	return (
		<main className='flex flex-col md:flex-row gap-4 md:gap-6'>
			{/* Sidebar */}
			<aside className='w-full md:w-64 bg-white shadow-xl rounded-xl p-6 border border-gray-100'>
				<h2 className='text-lg font-semibold mb-4 text-gray-700'>Navigation</h2>
				<ul className='space-y-3'>
					<li>
						<Link
							to='/overview'
							className='block p-2 rounded-lg transition duration-150 hover:bg-gray-100'>
							Overview
						</Link>
					</li>
				</ul>
			</aside>

			{/* Main Content */}
			<section className='flex-1 bg-white shadow-xl rounded-xl p-2  md:p-8 border border-gray-100'>
				<h2 className='text-2xl md:text-3xl font-bold text-gray-800 mb-6'>Workspace Overview</h2>

				<div className=' grid   grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4'>
					{/* Metric Card */}
					<div className=' bg-blue-50 p-6 rounded-xl shadow-md border-b-4 border-blue-500 flex flex-col items-center'>
						<h3 className='text-sm sm:text-base md:text-md font-semibold text-blue-700 mb-2 text-center'>
							Active Workspaces
						</h3>
						<p className='text-sm sm:text-base md:text-md font-bold text-blue-900'>
							{totalWorkspace}
						</p>
					</div>
				</div>
				<h3 className='text-xl font-semibold text-gray-800 mb-4 border-b pb-2'>My Workspaces</h3>

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
					{workspaces.map((workspace) => (
						<Link
							key={workspace.id}
							to={`/workspace/${workspace.id}`}
							className='bg-white border-t-4 border-blue-300 p-5 rounded-xl shadow-md hover:shadow-lg transition duration-300 cursor-pointer block' // 'block' is needed for Link to fill the card
						>
							<h4 className='text-lg font-bold text-gray-800 truncate mb-2'>{workspace.name}</h4>
							<p className='text-sm text-gray-600'>
								<span className='font-semibold text-blue-600'>{workspace.members}</span> Team
								Members
							</p>
						</Link>
					))}
					{workspaces.length === 0 && (
						<p className='text-gray-500 col-span-full'>No workspaces found.</p>
					)}
				</div>
			</section>
		</main>
	);
}

export default WorkspacePage;
