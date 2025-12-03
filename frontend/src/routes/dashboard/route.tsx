import { apiGet } from "@/lib/fetchAxios";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Briefcase, ClipboardList } from "lucide-react";
import React from "react";

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
		const user = await apiGet("/user/me");
		if (!user) {
			console.warn("User not authenticated, redirecting to login.");
			throw redirect({ to: "/login" });
		}
		return { user };
	},
	loader: async () => {
		const response = await apiGet("dashboard");
		const dashboard = response?.data?.dashboard;

		if (!dashboard) {
			throw new Error("Dashboard data could not be fetched.");
		}
		const { totalWorkspaces, totalTasks } = dashboard;
		return { totalWorkspaces, totalTasks };
	},
	component: DashboardPage,
});

const ThemedDashboardCard = ({ title, value, subtitle, icon, color }: ThemedCardProps) => {
	return (
		<div
			className={`
                rounded-xl border bg-white shadow-lg 
                transition-shadow duration-300 hover:shadow-xl 
                border-t-4 ${color} p-6
            `}>
			<div className='flex items-center justify-between mb-4'>
				<span className='text-sm font-medium text-gray-500 uppercase tracking-wider'>{title}</span>
				<div
					className={`p-2 rounded-full bg-opacity-10 ${color.replace("border", "bg")} text-gray-700`}>
					{icon}
				</div>
			</div>

			{/* Content / Value Section */}
			<div className='flex flex-col'>
				<span className='text-4xl font-extrabold text-gray-900'>{value}</span>
				<p className='text-sm text-gray-500 mt-1'>{subtitle}</p>
			</div>
		</div>
	);
};

function DashboardPage() {
	const dashboard = Route.useLoaderData() as DashboardData;
	const { user } = Route.useRouteContext();
	console.log(user);

	console.log("Dashboard Data Loaded:", dashboard);

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
					subtitle={`${dashboard.totalTasks} task require your attention.`}
					icon={<ClipboardList size={24} className='text-red-600' />}
					color='border-red-600'
				/>
			</div>
		</div>
	);
}
