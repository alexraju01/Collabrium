// @ts-nocheck
import { useAuth } from "@/context/authContext";
import { apiPost } from "@/lib/fetchAxios";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/login")({
	component: LoginPage,
});

function LoginPage() {
	const [login, setLogin] = useState(true);
	return (
		// <Layout>
		<div className='min-h-screen flex flex-col bg-gray-50'>
			<div className='flex flex-1'>
				{/* left side - banner */}
				<div className='hidden md:flex md:w-1/2 flex-col justify-center items-center p-12'>
					<div>
						<h1 className='text-3xl font-bold mb-2'>Welcome to Collabrium</h1>
						<p className='text-lg font-semibold mt-4'>Project Collaboration Space</p>
					</div>
				</div>

				{/* right side - Auth Container */}
				<div className='w-full md:w-1/2 flex flex-col justify-center items-center p-8'>
					<div className='w-full max-w-md'>
						{/* mobile banner */}
						<div className='md:hidden text-center mb-10'>
							<h1 className='text-3xl font-bold mb-2'>Welcome to Collabrium</h1>
							<h2 className='text-2xl font-semibold'>Project Collaboration Space</h2>
						</div>
					</div>

					{/* Login Section */}
					<div className='bg-white rounded shadow-lg p-8 md:p-10'>
						<div className='text-center mb-8'>
							<h2 className='text-2xl font-bold text-gray-800'>Welcome</h2>
						</div>

						{login && <LoginComponent setLogin={() => setLogin(false)} />}

						{/* Register Section */}
						{!login && <RegisterComponent setLogin={setLogin} />}
					</div>
				</div>
			</div>
		</div>
	);
}

interface RegisterForm {
	displayName: string;
	email: string;
	password: string;
}

interface RegisterForm {
	displayName: string;
	email: string;
	password: string;
}

function RegisterComponent({ setLogin }: { setLogin: () => void }) {
	const [username, setUserName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState(""); // <-- new error state
	const router = useRouter();
	async function Register() {
		setError(""); // reset previous error
		if (password !== confirmPassword) {
			setError("Passwords do not match!");
			return;
		}

		const details: RegisterForm & { confirmPassword: string } = {
			displayName: username,
			email,
			password,
			confirmPassword,
		};

		try {
			const response = await apiPost("user/signup", details);
			console.log("responsssssse", response.status);
			// Check the status property
			if (response?.status === "success") {
				setSuccess(true);

				// Navigate after success animation
				setTimeout(() => {
					router.navigate({ to: "/dashboard" }); // ⬅️ TanStack navigation
					setSuccess(false);
				}, 2000);
			} else {
				setError(response?.data?.message || "Registration failed!");
			}
		} catch (err: any) {
			console.error(err);
			setError(err?.response?.data?.message || "Registration failed!");
		}
	}

	return (
		<div>
			<h2 className='text-center'>Register</h2>

			{success ? (
				<div className='text-green-600 text-center my-4'>
					You have been successfully signed up! Redirecting to login...
				</div>
			) : (
				<>
					<div>
						<input
							type='text'
							value={username}
							onChange={(e) => setUserName(e.currentTarget.value)}
							placeholder='Username'
							className='w-full border border-gray rounded px-4 py-3 my-2'
						/>
						<input
							type='email'
							value={email}
							onChange={(e) => setEmail(e.currentTarget.value)}
							placeholder='Email'
							className='w-full border border-gray rounded px-4 py-3 my-2'
						/>
						<input
							type='password'
							value={password}
							onChange={(e) => setPassword(e.currentTarget.value)}
							placeholder='Password'
							className='w-full border border-gray rounded px-4 py-3 my-2'
						/>
						<input
							type='password'
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.currentTarget.value)}
							placeholder='Confirm Password'
							className='w-full border border-gray rounded px-4 py-3 my-2'
						/>
						<button
							className='w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-2'
							onClick={Register}>
							Create an Account
						</button>

						{/* Show error message */}
						{error && <div className='text-red-600 text-center my-2'>{error}</div>}
					</div>
					<div className='flex flex-col md:flex-row md:items-center md:justify-between my-2'>
						<p>Already have an account?</p>
						<button
							className='border bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 md:mt-0'
							onClick={setLogin}>
							Sign In
						</button>
					</div>
				</>
			)}
		</div>
	);
}

interface LoginForm {
	email: string;
	password: string;
}

function LoginComponent({ setLogin }: { setLogin: () => void }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();
	const { setUser } = useAuth();

	async function Login() {
		const details: LoginForm = {
			email: email,
			password: password,
		};

		const { data } = await apiPost("/user/login", details);
		if (!data) {
			console.log("Login failed");
			return;
		}
		console.log(data);
		setUser(data.user);

		// Navigate to dashboard
		router.navigate({ to: "/dashboard" });
	}

	return (
		<div>
			<h2 className='bold'>Login</h2>
			<div>
				<input
					type='email'
					value={email}
					onChange={(e) => setEmail(e.currentTarget.value)}
					placeholder='Email'
					className='w-full border border-gray rounded px-4 py-3 my-2'
				/>
				<input
					type='password'
					onChange={(e) => setPassword(e.currentTarget.value)}
					placeholder='Password'
					className='w-full border border-gray rounded px-4 py-3 my-2'
				/>
				<button
					className='w-full border bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-2'
					onClick={Login}>
					Sign In
				</button>
			</div>

			{/* Forgot Password */}
			<div>
				<a href='#'>Forgot your password?</a>
			</div>
			<div className='flex flex-col md:flex-row md:items-center md:justify-between my-2'>
				<div>
					<p>Don't have an account yet?</p>
				</div>
				<button
					className='border bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-2'
					onClick={setLogin}>
					Register an Account
				</button>
			</div>
		</div>
	);
}
