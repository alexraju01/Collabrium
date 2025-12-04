// @ts-nocheck
import { Outlet, createRootRoute } from "@tanstack/react-router";
// import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { AuthProvider } from "@/context/authContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const Route = createRootRoute({
	component: () => (
		<AuthProvider>
			<div className=''>
				<Navbar />
				<main className='flex  px-4'>
					<Outlet /> {/* Nested routes render here */}
				</main>
				<Footer />
				{/* Devtools */}
				<TanStackDevtools />
			</div>
		</AuthProvider>
	),
});
