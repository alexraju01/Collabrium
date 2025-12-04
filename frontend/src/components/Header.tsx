// @ts-nocheck
function formatTimeToString(date: Date) {
	const d = new Date(date);
	const today = new Date();
	const isToday =
		d.getDate() === today.getDate() &&
		d.getMonth() === today.getMonth() &&
		d.getFullYear() === today.getFullYear();

	if (isToday) {
		return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
	}

	return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()} ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

async function logOut() {
	try {
		const token = localStorage.getItem("authToken");
		const response = await fetch(`${import.meta.env.VITE_BASE_API}/user/logout`, {
			method: "POST",
			headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
		});
		if (!response || response.status != 200) {
			console.log("log out failed");
			return;
		}
		localStorage.removeItem("authToken");
		window.location.href = "/login";
	} catch (error) {
		console.log(error);
	}
}

const Header = () => {
	const username = "user1";
	{
		/*need to change this to actual user name*/
	}
	const currentDate = new Date();

	return (
		<header className='bg-white shadow-sm w-full h-16'>
			<div className='flex items-center justify-between px-6 py-4'>
				<div>
					<h1 className='text-xl font-bold text-gray-900'>Collabrium</h1>
				</div>

				<div className='flex items-center space-x-6'>
					<span className='text-gray-700'> Hello, {username}</span>
					<button
						className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
						onClick={logOut}>
						Log Out
					</button>
					<span className='text-gray-600 font-medium'>{formatTimeToString(currentDate)}</span>
				</div>
			</div>
		</header>
	);
};

export default Header;
