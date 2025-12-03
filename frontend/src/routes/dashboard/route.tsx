import Layout from "@/components/Layout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
});

/**
 * @summary The users personalized dashboard
 * @returns
 */
function RouteComponent() {
	return (
		<Layout>
			<div className=''>Hello "/dashboard"!</div>
		</Layout>
	);
}
