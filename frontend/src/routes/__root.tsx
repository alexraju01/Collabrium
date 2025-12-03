import { Outlet, createRootRoute } from "@tanstack/react-router";
// import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { AuthProvider } from "@/context/authContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const Route = createRootRoute({
	component: () => (
		<AuthProvider>
			<div className='min-h-screen flex flex-col'>
				<Navbar />
				<main className='flex-1 p-4 h-full'>
					<Outlet /> {/* Nested routes render here */}
				</main>

				<Footer />

				{/* Devtools */}
				<TanStackDevtools />
			</div>
		</AuthProvider>
	),
});
