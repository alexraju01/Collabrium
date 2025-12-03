import { useState } from "react";
import { Link, useMatchRoute, useNavigate } from "@tanstack/react-router";
import { LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/context/authContext";

interface Props {
	onLogout?: () => void;
	className?: string;
	avatarSize?: string;
	textSize?: string;
}

const Navbar = () => {
	const matchRoute = useMatchRoute();
	const { user, logout } = useAuth();
	const navigate = useNavigate();

	const [isOpen, setIsOpen] = useState(false);

	const isActive = (to: string) =>
		matchRoute({ to, fuzzy: false })
			? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
			: "";

	const handleLogout = async () => {
		try {
			await logout();
			navigate({ to: "/" });
		} catch (err) {
			console.error("Logout failed:", err);
		}
	};

	const initials = user
		? user.displayName
				.split(" ")
				.map((n) => n[0])
				.join("")
		: "";

	return (
		<header className='w-full bg-white shadow-sm border-b border-blue-100'>
			<div className='py-4 px-6 flex justify-between items-center'>
				<h1 className='text-xl font-bold text-gray-800'>Collabrium</h1>

				<nav className='hidden md:flex items-center space-x-6 text-gray-600'>
					<Link to='/' className={`hover:text-blue-600 ${isActive("/home")}`}>
						Home
					</Link>

					<Link to='/dashboard' className={`hover:text-blue-600 ${isActive("/dashboard")}`}>
						Dashboard
					</Link>

					<Link to='/workspace' className={`hover:text-blue-600 ${isActive("/workspace")}`}>
						Workspace
					</Link>

					{user ? (
						<div className='relative group'>
							<button className='w-9 h-9 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold uppercase'>
								{initials}
							</button>

							<div
								className='absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg 
                                opacity-0 group-hover:opacity-100 invisible group-hover:visible
                                transition-all duration-150 p-4'>
								<UserMenuContent onLogout={handleLogout} />
							</div>
						</div>
					) : (
						<Link to='/login' className={`hover:text-blue-600 ${isActive("/login")}`}>
							Sign In
						</Link>
					)}
				</nav>

				<button className='md:hidden text-gray-700' onClick={() => setIsOpen(!isOpen)}>
					{isOpen ? <X size={28} /> : <Menu size={28} />}
				</button>
			</div>

			{isOpen && (
				<div className='md:hidden bg-white border-t px-6 py-5 shadow-md rounded-b-xl space-y-5 animate-fadeDown'>
					<nav className='space-y-4'>
						<Link
							to='/'
							onClick={() => setIsOpen(false)}
							className={`block text-lg font-medium text-gray-700 hover:text-blue-600 transition ${isActive("/home")}`}>
							Home
						</Link>

						<Link
							to='/dashboard'
							onClick={() => setIsOpen(false)}
							className={`block text-lg font-medium text-gray-700 hover:text-blue-600 transition ${isActive("/dashboard")}`}>
							Dashboard
						</Link>

						<Link
							to='/workspace'
							onClick={() => setIsOpen(false)}
							className={`block text-lg font-medium text-gray-700 hover:text-blue-600 transition ${isActive("/workspace")}`}>
							Workspace
						</Link>
					</nav>

					{user ? (
						<div className='pt-4 border-t'>
							<UserMenuContent
								onLogout={() => {
									handleLogout();
									setIsOpen(false);
								}}
								avatarSize='w-12 h-12'
								textSize='text-base'
							/>
						</div>
					) : (
						<Link
							to='/login'
							onClick={() => setIsOpen(false)}
							className='block text-lg font-medium text-gray-700 hover:text-blue-600 transition'>
							Sign In
						</Link>
					)}
				</div>
			)}
		</header>
	);
};

const UserMenuContent = ({
	onLogout,
	className,
	avatarSize = "w-10 h-10",
	textSize = "text-sm",
}: Props) => {
	const { user } = useAuth();
	if (!user) return null;

	const initials = user.displayName
		.split(" ")
		.map((n) => n[0])
		.join("");

	return (
		<div className={`space-y-4 ${className || ""}`}>
			<div className='flex items-center gap-3'>
				<div
					className={`${avatarSize} bg-blue-500 aspect-square h-full text-white rounded-full 
                    flex items-center justify-center font-semibold uppercase shadow-sm`}>
					{initials}
				</div>

				<div className='flex flex-col min-w-0'>
					<p className='text-gray-900 font-semibold leading-tight'>{user.displayName}</p>
					<p
						className={`
                        text-gray-500 leading-tight ${textSize}
                        truncate whitespace-nowrap overflow-hidden text-ellipsis `}>
						{user.email}
					</p>
				</div>
			</div>

			<button
				onClick={onLogout}
				className='w-full flex items-center gap-2 px-4 py-2 rounded-lg 
                cursor-pointer bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-medium transition'>
				<LogOut size={16} /> Log Out
			</button>
		</div>
	);
};

export default Navbar;
