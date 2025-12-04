import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import Footer from "@/components/Footer";

export const Route = createFileRoute("/")({
	component: LandingPage,
});

function LandingPage() {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		setIsVisible(true);
	}, []);

	return (
		<div className='min-h-screen bg-white flex flex-col'>
			{/* Main Content */}
			<div className='flex-1'>
				{/* Hero Section */}
				<section className='pt-32 pb-20 px-8'>
					<div className='max-w-6xl mx-auto'>
						<div
							className={`text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
							{/* Logo Banner */}
							<div className='mb-12 inline-flex items-center gap-6 bg-gradient-to-r from-gray-50 via-white to-gray-50 px-12 py-6 rounded-2xl'>
								<img src='/collabrium-logo-new.jpeg' alt='Collabrium' className='h-24 w-auto' />
								<div className='text-left'>
									<h2 className='text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
										Collabrium
									</h2>
									<p className='text-gray-600 text-lg mt-1'>Project Collaboration Space</p>
								</div>
							</div>

							<h1 className='text-6xl md:text-7xl font-bold mb-6 text-gray-900 leading-tight'>
								Work together,
								<br />
								<span className='bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
									achieve more
								</span>
							</h1>

							<p className='text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed'>
								A modern workspace platform that brings teams together. Simple, powerful, and built
								for collaboration.
							</p>

							<div className='flex gap-4 justify-center flex-wrap'>
								<Link
									to='/dashboard'
									className='px-8 py-3.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all text-lg font-bold'>
									Start for free
								</Link>
								<Link
									to='/login'
									className='px-8 py-3.5 bg-white text-gray-900 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-all text-lg'>
									View demo
								</Link>
							</div>
						</div>

						{/* Metrics */}
						<div className='grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-24'>
							<div className='text-center'>
								<div className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2'>
									5+
								</div>
								<div className='text-gray-600'>Active teams</div>
							</div>
							<div className='text-center border-l border-r border-gray-200'>
								<div className='text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2'>
									10K+
								</div>
								<div className='text-gray-600'>Tasks completed</div>
							</div>
							<div className='text-center'>
								<div className='text-4xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent mb-2'>
									99.9%
								</div>
								<div className='text-gray-600'>Uptime</div>
							</div>
						</div>
					</div>
				</section>

				{/* Features Section */}
				<section className='py-20 px-8 bg-gray-50'>
					<div className='max-w-6xl mx-auto'>
						<div className='text-center mb-16'>
							<h2 className='text-4xl font-bold text-gray-900 mb-4'>Everything you need</h2>
							<p className='text-lg text-gray-600'>Powerful features designed for modern teams</p>
						</div>

						<div className='grid md:grid-cols-3 gap-8'>
							<div className='bg-white p-8 rounded-xl border border-gray-200 hover:border-blue-400 transition-all'>
								<div className='w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mb-6'></div>
								<h3 className='text-xl font-bold text-gray-900 mb-3'>Workspaces</h3>
								<p className='text-gray-600 leading-relaxed'>
									Organize your team into dedicated spaces with role-based access control
								</p>
							</div>

							<div className='bg-white p-8 rounded-xl border border-gray-200 hover:border-purple-400 transition-all'>
								<div className='w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl mb-6'></div>
								<h3 className='text-xl font-bold text-gray-900 mb-3'>Smart search</h3>
								<p className='text-gray-600 leading-relaxed'>
									Find anything instantly across all your workspaces with powerful search
								</p>
							</div>

							<div className='bg-white p-8 rounded-xl border border-gray-200 hover:border-pink-400 transition-all'>
								<div className='w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl mb-6'></div>
								<h3 className='text-xl font-bold text-gray-900 mb-3'>Task management</h3>
								<p className='text-gray-600 leading-relaxed'>
									Create and track tasks with priorities, tags, and due dates
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* PLACEHOLDER: Product Preview */}
				<section className='py-20 px-8 bg-white'>
					<div className='max-w-6xl mx-auto'>
						<div className='bg-gray-50 rounded-2xl p-16 text-center border-2 border-dashed border-gray-300'>
							<h3 className='text-2xl font-semibold text-gray-400 mb-3'>Product Preview Section</h3>
							<p className='text-gray-500 mb-6'>Interactive dashboard mockup will go here</p>
							<div className='flex gap-3 justify-center flex-wrap'>
								<span className='px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm'>
									Browser window
								</span>
								<span className='px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm'>
									Clean screenshots
								</span>
								<span className='px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm'>
									Animated demo
								</span>
							</div>
						</div>
					</div>
				</section>

				{/* PLACEHOLDER: Benefits */}
				<section className='py-20 px-8 bg-gray-50'>
					<div className='max-w-6xl mx-auto'>
						<div className='bg-white rounded-2xl p-16 text-center border-2 border-dashed border-gray-300'>
							<h3 className='text-2xl font-semibold text-gray-400 mb-3'>Benefits / Use Cases</h3>
							<p className='text-gray-500 mb-6'>Showcase real-world benefits or testimonials</p>
							<div className='flex gap-3 justify-center flex-wrap'>
								<span className='px-4 py-2 bg-gray-50 border border-gray-200 text-gray-600 rounded-lg text-sm'>
									Icon grid
								</span>
								<span className='px-4 py-2 bg-gray-50 border border-gray-200 text-gray-600 rounded-lg text-sm'>
									Large cards
								</span>
								<span className='px-4 py-2 bg-gray-50 border border-gray-200 text-gray-600 rounded-lg text-sm'>
									Testimonials
								</span>
							</div>
						</div>
					</div>
				</section>

				{/* Placeholder: CTA */}
				<section className='py-20 px-8 bg-white'>
					<div className='max-w-6xl mx-auto'>
						<div className='bg-gray-50 rounded-2xl p-16 text-center border-2 border-dashed border-gray-300'>
							<h3 className='text-2xl font-semibold text-gray-400 mb-3'>Call to Action</h3>
							<p className='text-gray-500 mb-6'>Final push to sign up</p>
							<div className='flex gap-3 justify-center flex-wrap'>
								<span className='px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm'>
									Simple centered
								</span>
								<span className='px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm'>
									Gradient background
								</span>
								<span className='px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm'>
									Split layout
								</span>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
