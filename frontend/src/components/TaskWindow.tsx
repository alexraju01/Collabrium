import {
	TaskStatus,
	type Activity,
	type Task,
	type TimeLog,
} from "@/lib/types";
import { useState } from "react";
import { Button } from "./Button";

export function TaskWindow({ task }: { task?: Task }) {
	const [title, setTitle] = useState(task?.title ?? "Default Title");
	const [description, setDescription] = useState(
		task?.description ?? "No Description"
	);
	const [tags, setTags] = useState(task?.tags ?? ["tag 1", "tag 2"]);
	const [status, setStatus] = useState(task?.status ?? 0);
	const [dueDate, setDueDate] = useState(task?.dueDate ?? "??/??/????");
	const [createdBy] = useState(task?.createdBy.username ?? "unknown");
	const [createdAt] = useState(task?.createdAt ?? "unknown");
	const [assignedTo, setAssignedTo] = useState(task?.assignedTo);
	const [activity, setActivity] = useState(task?.activity ?? []);
	const [timeLogs, setTimeLogs] = useState(task?.timeLogs ?? []);

	return (
		<div className="absolute w-11/12 divide-y-2 max-h-11/12 border top-[calc(1/24*100%)] left-1/2 -translate-x-1/2">
			{/* Top bar */}
			<section className="flex bg-neutral-400 place-content-between px-2">
				{/* Make this a dropdown button to change which list its under */}
				<h3>Task List Name</h3>
				<div className="gap-2 flex ">
					<button>Actions</button>
					<button>X</button>
				</div>
			</section>
			<div className="grid grid-cols-[3fr_2fr] divide-x-2">
				{/* Left side */}
				<section className="bg-neutral-400 p-2">
					<h1 className="text-4xl">{title}</h1>
					<p>created: {createdAt}</p>
					<div className="flex flex-wrap gap-2">
						{tags.map((tag, index) => (
							<li key={index}>{tag}</li>
						))}
						<button>Add tag</button>
					</div>
					<h3>Description</h3>
					{/* requires markdown editor */}
					<p>{description}</p>
					{/* Comment section */}
					<div>
						<h2>Comments / Activity</h2>
						{/* Input activity text area */}
						<input placeholder="start typing..." />
						<ol>
							{activity.map((activity, index) => (
								<TaskActivity key={index} activity={activity} />
							))}
						</ol>
					</div>
				</section>

				{/* Right side */}
				<section className="bg-neutral-500 p-2">
					{/* task info */}
					<div>
						<h2>Task info</h2>
						<div className="flex flex-col">
							{/* Status */}
							<div className="outline place-self-start p-1 px-4 bg-amber-300">
								{TaskStatus[status]}
							</div>
							{/* Due date */}
							<div className="flex flex-row">
								<p>Due Date:</p>
								<p>{dueDate.toString()}</p>
							</div>
							{/* Created by */}
							<div className="flex flex-row">
								<p>Created by:</p>
								<p>{createdBy}</p>
							</div>
							{/* Assigned to */}
							<div className="flex flex-row">
								<p>Assigned to:</p>
								{assignedTo?.map(({ username }, index) => (
									<p key={index}>{username}</p>
								))}
							</div>
							{/* Time log */}
							<div>
								<h2>Time log</h2>
								<Button>Add time log</Button>
								{/* List of time logs */}
								<ol>
									{timeLogs.map((log, index) => (
										<TimeLog key={index} timelog={log} />
									))}
								</ol>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}

function TaskActivity({ activity }: { activity: Activity }) {
	return (
		<div className="outline flex flex-row gap-2">
			<div className="place-self-center">10/10/2025</div>
			<div className="outline w-full text-wrap">{activity.content}</div>
		</div>
	);
}

function TimeLog({ timelog }: { timelog: TimeLog }) {
	return (
		<div className="grid grid-cols-[4fr_auto_2fr] gap-2 outline px-2 p-1">
			{/* Can click on to edit and view details */}
			<p className="text-nowrap text-ellipsis overflow-hidden outline">
				brief description about the timelog
			</p>
			<p className="text-center outline">{timelog.timeSpent}H</p>
			<p className="text-end outline">
				On - {timelog.createAt.toLocaleTimeString()}
			</p>
		</div>
	);
}
