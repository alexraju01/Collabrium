// components/Navbar.tsx
import { Link, useMatchRoute } from "@tanstack/react-router";
import { useAuth } from "@/context/authContext";
import { useState } from "react";
import { LogOut } from "lucide-react"; // install lucide-react if not yet

const Navbar = () => {
	const matchRoute = useMatchRoute();
	const { user } = useAuth();
	const [loading, setLoading] = useState(false);

	const isActive = (to: string) =>
		matchRoute({ to, fuzzy: false })
			? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
			: "";

	const handleLogout = async () => {
		setLoading(true);
		try {
			await logout(); // assuming logout is async
		} catch (error) {
			console.error("Logout failed:", error);
			// optionally show a toast/error message
		} finally {
			setLoading(false);
		}
	};

	return (
		<header className='w-full bg-white shadow-sm py-4 px-8 flex justify-between items-center border-b border-blue-100'>
			<h1 className='text-xl font-bold text-gray-800'>Collabrium</h1>
			<nav className='space-x-6 text-gray-600'>
				<Link to='/' className={`hover:text-blue-600 transition duration-150 ${isActive("/home")}`}>
					Home
				</Link>
				<Link
					to='/dashboard'
					className={`hover:text-blue-600 transition duration-150 ${isActive("/dashboard")}`}>
					Dashboard
				</Link>
				<Link
					to='/workspace'
					className={`hover:text-blue-600 transition duration-150 ${isActive("/workspace")}`}>
					Workspace
				</Link>

				{user ? (
					<div className='flex items-center gap-4'>
						<span className='text-gray-800 font-medium'>Hello, {user.displayname}</span>
						<button
							onClick={handleLogout}
							disabled={loading}
							className={`flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-150 ${
								loading ? "opacity-50 cursor-not-allowed" : ""
							}`}>
							<LogOut size={16} />
							{loading ? "Logging out..." : "Log Out"}
						</button>
					</div>
				) : (
					<Link
						to='/login'
						className={`hover:text-blue-600 transition duration-150 ${isActive("/login")}`}>
						Sign In
					</Link>
				)}
			</nav>
		</header>
	);
};

export default Navbar;
