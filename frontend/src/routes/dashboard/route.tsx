import { apiGet } from "@/lib/fetchAxios";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
	loader: async () => {
		const user = await apiGet("/user/me");
		if (!user) throw redirect({ to: "/login" });
		return { user };
	},
	component: RouteComponent,
});

function RouteComponent() {
	return <div className=''>Hello "/dashboard"!</div>;
}
