import Layout from "@/components/Layout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/workspace")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<Layout>
			<div className='min-h-screen bg-[#f6f7f9] flex flex-col'>Welcome to workspace</div>;
		</Layout>
	);
}

export default RouteComponent;
