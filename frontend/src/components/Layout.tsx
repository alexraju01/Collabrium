import { ReactNode, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";

interface LayoutProps {
	children?: React.ReactNode;
}

interface SidebarItemProps {
	isSelected: boolean;
	onClick: () => void;
}

function Sidebar({ isSelected, onClick }: SidebarItemProps) {
	return (
		<li
			//   onClick={() => setSelectedPage(page.key)}
			className={`w-full text-left px-3 py-2 rounded ${
				isSelected
					? "bg-blue-50 text-blue-600 border-r-4 border-blue-500"
					: "text-gray-700 hover:bg-gray-100"
			}`}
			onClick={onClick}>
			workspace
		</li>
	);
}

export default function Layout({ children }: LayoutProps) {
	const [selectedPage, setSelectedPage] = useState("dashboard");

	// const renderPageLinks = () => {
	// return pages.map(page => (
	//    <li
	//       key={page.key}
	//       onClick={() => setSelectedPage(page.key)}
	//       className='w-full text-left px-3 py-2 rounded-lg transition-colors'
	//     >
	//       {page.name}
	//     </li>
	//     ));
	//   }

	return (
		<div className='min-h-screen flex flex-col '>
			{/* header */}
			<Header />

			{/* Sidebar */}
			<aside className='flex flex-1 pt-16 w-64 bg-gray-100 m-h-[cal(100vh-4rem)]'>
				<ul>
					<Sidebar />
				</ul>
			</aside>

			{/* maincontent */}
			<section className='flex-1 p-6'>{children}</section>

			{/* Footer */}
			<Footer />
		</div>
	);
}
