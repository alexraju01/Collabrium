import Layout from "@/components/Layout";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/workspace")({
	component: WorkspacePage,
});

function WorkspacePage() {
	return (
		<Layout>
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
							<p className='text-sm sm:text-base md:text-md font-bold text-blue-900'>8</p>
						</div>
					</div>
					<h3 className='text-xl font-semibold text-gray-800 mb-4 border-b pb-2'>My Workspaces</h3>
				</section>
			</main>
		</Layout>
	);
}

export default WorkspacePage;
