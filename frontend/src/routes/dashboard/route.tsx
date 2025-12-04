// @ts-nocheck
import { apiGet } from "@/lib/fetchAxios";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Briefcase, ClipboardList } from "lucide-react";
import React from "react";

type UserData = {
	displayName: string;
	id: string;
};

type DashboardData = {
	totalWorkspaces: number;
	totalTasks: number;
};

type ThemedCardProps = {
	title: string;
	value: number | string;
	subtitle: string;
	icon: React.ReactNode;
	color: string;
};

export const Route = createFileRoute("/dashboard")({
	beforeLoad: async () => {
		const user = await apiGet<UserData>("/user/me");
		if (!user || !user.displayName) throw redirect({ to: "/login" });
		return { user };
	},

	loader: async () => {
		const response = await apiGet<{ dashboard: DashboardData }>("dashboard");
		return response?.dashboard;
	},

	pendingComponent: () => (
		<div className='flex justify-center items-center h-screen'>
			<span className='loading loading-spinner loading-lg text-indigo-600'></span>
		</div>
	),

	component: DashboardPage,
});

const ThemedDashboardCard = ({ title, value, subtitle, icon, color }: ThemedCardProps) => (
	<div
		className={`
            rounded-xl border bg-white shadow-lg 
            transition-shadow duration-300 hover:shadow-xl 
            border-t-4 ${color} p-6
        `}>
		<div className='flex items-center justify-between mb-4'>
			<span className='text-sm font-medium text-gray-500 uppercase tracking-wider'>{title}</span>
			<div className={`p-2 rounded-full bg-opacity-10 ${color.replace("border", "bg")}`}>
				{icon}
			</div>
		</div>

		<div className='flex flex-col'>
			<span className='text-4xl font-extrabold text-gray-900'>{value}</span>
			<p className='text-sm text-gray-500 mt-1'>{subtitle}</p>
		</div>
	</div>
);

function DashboardPage() {
	const dashboard = Route.useLoaderData() as DashboardData | undefined;
	const { user } = Route.useRouteContext() as { user: UserData };

	if (!user?.displayName) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<span className='loading loading-spinner loading-lg text-indigo-600'></span>
			</div>
		);
	}

	if (!dashboard) {
		// Skeleton loading state
		return (
			<div className='min-h-screen p-8 bg-gray-50 space-y-8 animate-pulse'>
				<div className='h-10 w-96 bg-gray-200 rounded'></div>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					{Array.from({ length: 3 }).map((_, i) => (
						<div
							key={i}
							className='rounded-xl border bg-white shadow-lg border-t-4 border-gray-200 p-6'>
							<div className='flex items-center justify-between mb-4'>
								<div className='h-4 w-32 bg-gray-200 rounded'></div>
								<div className='h-10 w-10 bg-gray-200 rounded-full'></div>
							</div>
							<div className='flex flex-col'>
								<div className='h-10 w-20 bg-gray-200 rounded mb-2'></div>
								<div className='h-4 w-40 bg-gray-200 rounded'></div>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen p-8 bg-gray-50 space-y-8'>
			<h1 className='text-3xl font-bold text-gray-800 pb-4'>
				Welcome to your Dashboard, {user.displayName}!
			</h1>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				<ThemedDashboardCard
					title='Workspaces'
					value={dashboard.totalWorkspaces}
					subtitle={`You manage ${dashboard.totalWorkspaces} active project spaces.`}
					icon={<Briefcase size={24} className='text-blue-600' />}
					color='border-blue-600'
				/>

				<ThemedDashboardCard
					title='Open Tasks'
					value={dashboard.totalTasks}
					subtitle={`${dashboard.totalTasks} tasks require your attention.`}
					icon={<ClipboardList size={24} className='text-red-600' />}
					color='border-red-600'
				/>
			</div>
		</div>
	);
}

export default DashboardPage;
