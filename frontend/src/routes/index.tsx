import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	return (
		<div className='bg-red-500'>
			<h1>text</h1>
		</div>
	);
}
