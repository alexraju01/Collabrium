// components/Navbar.tsx
import { Link, useMatchRoute } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/authContext";

const Navbar = () => {
	const matchRoute = useMatchRoute();
	const { user, logout } = useAuth();

	const isActive = (to: string) =>
		matchRoute({ to, fuzzy: false })
			? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
			: "";

	const handleLogout = async () => {
		try {
			await logout();
		} catch (err) {
			console.error("Logout failed:", err);
		}
	};

	return (
		<header className='w-full bg-white shadow-sm py-4 px-8 flex justify-between items-center border-b border-blue-100'>
			<h1 className='text-xl font-bold text-gray-800'>Collabrium</h1>

			<nav className='flex items-center space-x-6 text-gray-600'>
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

				{/* USER LOGGED IN */}
				{user ? (
					<div className='relative group'>
						<button className='w-9 h-9 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold uppercase'>
							{user.displayname
								.split(" ")
								.map((n) => n[0])
								.join("")}
						</button>

						{/* Dropdown */}
						<div
							className='absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-md 
							opacity-0 group-hover:opacity-100 invisible group-hover:visible 
							transition-all duration-150'>
							<button
								onClick={handleLogout}
								className='w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-700'>
								<LogOut size={16} />
								Log Out
							</button>
						</div>
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
