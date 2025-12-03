import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/setting")({
	component: SettingComponent,
});

function SettingComponent() {
	const [displayName, setDisplayName] = useState("username");

	async function UpdateDisplayName() {
		console.log(`save display name ${displayName} button`);
		const detials = {
			displayName: displayName,
		};
		try {
			const response = await fetch("http://localhost:3001/api/users/update-displayName", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(detials),
			});
			if (!response || response.status != 200) {
				console.log("failed to save display name");
				return;
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function DeleteAccount() {
		console.log(`click delete button`);
		try {
			const response = await fetch({
				method: "DELETE",
				headers: { Authorization: `Bearer ${token}` },
			});
			if (!response || response.status != 200) {
				console.log("failed to delete account");
				return;
			}
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<div className='min-h-screen bg-gray-50'>
			<div className='mx-auto px-4 py-8'>
				<h1 className='text-3xl font-bold text-gray-900 mb-8'>Settings</h1>
			</div>
			{/* change display name Section */}
			<div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8'>
				<div className='mb-6'>
					<h2 className='text-2xl font-semibold text-gray-900'>Change Display Name</h2>
				</div>
				<div className='space-y-6'>
					<div>
						<label className='block text-sm font-medium text-gray-900 mb-2'>Display Name</label>
						<input
							type='text'
							value={displayName}
							onChange={(e) => setDisplayName(e.target.value)}
							className='w-full max-w-md px-4 py-3 border border-gray-300 rounded-lg focus:ring-1'
							placeholder='Enter your display name'
						/>
						<p className='mt-2 text-sm text-gray-500 mb-6'>
							This name will be visible to other users.
						</p>
						<button
							className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
							onClick={UpdateDisplayName}>
							Change Username
						</button>
					</div>
				</div>
			</div>

			{/* Delete Account Section */}
			<div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8'>
				<div className='flex items-center gap-3 mb-6'>
					<h2 className='text-2xl font-semibold text-gray-900'>Delete Account</h2>
				</div>
				<div className='space-y-6'>
					<div>
						<p className='mt-2 text-sm text-gray-500 mb-6'>
							Deleting your account will permanently remove your data, settings, and history.
						</p>
						<button
							className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
							onClick={DeleteAccount}>
							Delete Account
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
