import { Outlet, createRootRoute } from "@tanstack/react-router";
// import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { AuthProvider } from "@/context/authContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const Route = createRootRoute({
	component: () => (
		<AuthProvider>
			<div className="grid grid-rows-[auto_1fr_auto] max-h-screen h-screen max-w-screen">
				<Navbar />
				<main className="flex  px-4">
					<Outlet /> {/* Nested routes render here */}
				</main>
				<Footer />
				{/* Devtools */}
				<TanStackDevtools />
			</div>
		</AuthProvider>
	),
});
