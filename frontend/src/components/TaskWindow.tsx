import { Priority, TaskStatus, type Role } from "@/lib/interfaces/types";
import { useEffect, useRef, useState } from "react";
import { Button } from "./Button";
import { cn } from "@/lib/classCombine";
import { PlusIcon } from "./svgs";
import { useOnClickOutside } from "usehooks-ts";
import type { TaskRequest, TaskResponse } from "@/lib/interfaces/ITask";
import type { ActivityResponse } from "@/lib/interfaces/IActivity";
import type { TimeLogResponse } from "@/lib/interfaces/ITimeLog";
import { useGetTask } from "@/lib/queries/GetTask";

/*

WORKSPACE -> Owner creates

TASK LIST -> PEOPLE WITH WRITE ACCESS CAN CRUD

TASKS-> 
	CAN CRUD 
	CAN READ (ALLOWS COMMENTS AND TIME LOGS)

OWNER = OWENER OF WORKSAPCE, FULL ACCESS
ADMIN = FULL CRUD ACCESS (BELOW WORKSPACE LEVEL) CANT EDIT WORKSPACE NAME OR DELETE 
USER = READ ALL (CAN COMMENT AND TIME LOG ON TASKS)


*/

export function TaskWindow({
	id,
	closeTask,
	role,
}: {
	id: string;
	closeTask: (e: string) => void;
	role: Role;
}) {
	const { data, isError, isPending } = useGetTask(id);
	const [task, setTask] = useState<TaskResponse | null>(data ?? null);
	const windowRef = useRef<any>(null);
	const [title, setTitle] = useState(task?.title ?? "Default Title");
	const [description, setDescription] = useState(task?.description ?? "");
	const [tags, setTags] = useState(task?.tags ?? ["tag 1", "tag 2"]);
	const [status, setStatus] = useState(task?.status ?? 2);
	const [dueDate, setDueDate] = useState(task?.dueDate ?? "??/??/????");
	const [createdBy] = useState(task?.createdBy.displayName ?? "unknown");
	const [createdAt] = useState(task?.createdAt ?? "unknown");
	const [assignedTo, setAssignedTo] = useState(task?.assignedTo);
	const [activity, setActivity] = useState(task?.activity ?? []);
	const [timeLogs, setTimeLogs] = useState(task?.timeLogs ?? []);
	const [priority, setPriority] = useState(task?.prioity ?? 0);

	const [timeLogOpen, setTimeLogOpen] = useState(false);

	function submitComment(e: string) {
		//api call to add comment
		console.log("Comment: ", e);

		//if added, add it to the list of comments to display
		//Push the comment to the db,
		//get the returned comment with all values
		//add it to the current comment list
		// setActivity([...activity, newcomment])
	}



	function handleSaveTask() {
		console.log("Save task");
		//then close task
	}

	function handleCancelTask() {
		console.log("Cancel task edit");
		//do not save, close window
	}

	function handleCloseTask() {
		console.log("Handle Close");
		//if have edit permission, save,
		//close
		if (!timeLogOpen) closeTask("");
	}

	function openNewTimeLog() {
		console.log("openingNewTimeLog");
		setTimeLogOpen(true);
	}

	// useOnClickOutside(windowRef, handleCloseTask);

	/**@summary IF FALSE, CAN EDIT */
	const [canEdit] = useState(role == "Admin" || role == "Owner" ? true : false); // true if admin+ or task owner	//SET THIS TO !FALSE !!!!!!!!

	return (
		<>
			<div
				ref={windowRef}
				className="absolute w-11/12 divide-y-2 max-h-11/12 top-[calc(1/24*100%)] left-1/2 -translate-x-1/2">
				{/* Top bar */}
				<section className="flex bg-neutral-400 place-content-between pl-2">
					{/* Make this a dropdown button to change which list its under */}
					<div className="flex gap-2 items-baseline">
						<h3>Task List Name</h3>
						<p className="text-xs text-black/50">id:{id}</p>
					</div>
					<div className="gap-2 flex">
						<button>Actions</button>
						<Button className="aspect-square" onClick={handleCloseTask}>
							<PlusIcon classname="rotate-45" />
						</Button>
					</div>
				</section>
				{/* Content */}
				<div className="grid grid-cols-[3fr_2fr] divide-y-2 divide-x-2">
					{/* Left side */}
					<section className="bg-neutral-400 p-2">
						<div className="flex flex-row place-content-between">
							{/* Title */}
							<TitleBox canEdit={canEdit} title={title} setTitle={setTitle} />
							{/* Prio */}
							<div className="place-self-start self-center p-1 px-4 bg-amber-300">
								{Priority[priority]}
							</div>
						</div>
						<p>created: {createdAt.toLocaleString()}</p>
						<div className="flex flex-wrap gap-2">
							{tags.map((tag, index) => (
								<li key={index}>{tag}</li>
							))}
							<button>Add tag</button>
						</div>
						<h3>Description</h3>
						{/* requires markdown editor */}
						<DescriptionBox
							canEdit={canEdit}
							loadedContent={description}
							setLoadedContent={setDescription}
						/>
						{/* Comment section */}
						<div>
							<h2>Comments / Activity</h2>
							{/* Input activity text area */}
							<NewComment submit={submitComment} />
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
							<div className="grid gap-4 grid-cols-2">
								{/* Status */}
								<div className="place-self-start p-1 px-4 bg-amber-300">
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
									{assignedTo?.map(({ displayName }, index) => (
										<p key={index}>{displayName}</p>
									))}
								</div>
								{/* Time log */}
								<div>
									<h2>Time log</h2>
									<Button onClick={openNewTimeLog}>Add time log</Button>
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
					{/* Window Buttons */}
					{/* Only show if they have edit permissions */}
					<div className="bg-neutral-400 col-span-2 flex justify-end gap-4 p-1">
						<Button onClick={handleCancelTask} className="w-20">
							Cancel
						</Button>
						<Button onClick={handleSaveTask} className="w-20">
							Save
						</Button>
					</div>
				</div>

				{timeLogOpen && <TimeLogPanel setOpen={setTimeLogOpen} />}
			</div>
		</>
	);
}

function TimeLogPanel({ setOpen }: { setOpen: (e: boolean) => void }) {
	const [logContent, setLogContent] = useState("");
	const pannelRef = useRef<any>(null);
	const maxLength = 255;

	function handleCancel() {
		console.log("Cancel Time log");
	}

	function handleSave() {
		console.log("Save time log");
	}

	function handleCloseTimeLog() {
		console.log("Close time log");
		setOpen(false);
	}

	useOnClickOutside(pannelRef, handleCloseTimeLog);

	return (
		<div className="absolute z-10 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-black/20 w-full h-full grid place-items-center">
			<div
				ref={pannelRef}
				className="grid grid-rows-[auto_1fr_auto] max-w-xl w-11/12 h-64 bg-neutral-500 outline divide-y-2">
				<div className="h-12  place-items-center place-content-between gap-4 flex px-1">
					<h2>Log Time</h2>
					<Button onClick={handleCloseTimeLog}>
						<PlusIcon classname="rotate-45" />
					</Button>
				</div>
				<form className="grid grid-cols-2 h-full items-center p-2">
					{/* Set Date */}
					<div>
						<label>Date:</label>
					</div>
					{/* Set hours + mins spent */}
					<div>Time Spent</div>
					{/* Comment log box */}
					<div className="col-span-2 h-full">
						<div className="w-full relative h-full">
							<textarea
								value={logContent}
								onChange={(e) => setLogContent(e.currentTarget.value)}
								placeholder="start typing your comment..."
								maxLength={maxLength}
								className="outline w-full h-full px-1 resize-none"
							/>
							<p
								className={cn(
									"absolute text-sm bottom-1 right-5",
									maxLength - (logContent.length ?? 0) == 0
										? "text-red-500"
										: "text-inherit"
								)}>
								{maxLength - (logContent.length ?? 0)}
							</p>
						</div>
					</div>
				</form>
				<div className="h-12 place-items-center place-content-end gap-4 flex px-1">
					<Button onClick={handleCancel} className="w-20">
						Cancel
					</Button>
					<Button onClick={handleSave} className="w-20">
						Save
					</Button>
				</div>
			</div>
		</div>
	);
}

function TaskActivity({ activity }: { activity: ActivityResponse }) {
	return (
		<div className="outline flex flex-row gap-2">
			<div className="place-self-center">10/10/2025</div>
			<div className="outline w-full text-wrap">{activity.message}</div>
		</div>
	);
}

function TimeLog({ timelog }: { timelog: TimeLogResponse }) {
	return (
		<div className="grid grid-cols-[4fr_auto_2fr] gap-2 outline px-2 p-1">
			{/* Can click on to edit and view details */}
			<p className="text-nowrap text-ellipsis overflow-hidden outline">
				brief description about the timelog
			</p>
			<p className="text-center outline">{timelog.timeSpent}H</p>
			<p className="text-end outline">
				On - {timelog.createdAt.toLocaleTimeString()}
			</p>
		</div>
	);
}

function TitleBox({
	canEdit,
	title,
	setTitle,
}: {
	canEdit: boolean;
	title: string;
	setTitle: (title: string) => void;
}) {
	const ref = useRef<HTMLInputElement | null>(null);
	const maxLength = 100;

	useEffect(() => {
		if (ref.current) ref.current.value = title;
	}, [title]);

	function validateTitle(e: string) {
		e = e.trim() ?? "";
		if (e.length > 0) {
			setTitle(e);
		} else {
			if (ref.current) ref.current.value = title;
		}
	}

	return (
		<input
			disabled={!canEdit}
			className="text-4xl"
			ref={ref}
			maxLength={maxLength}
			onBlur={(e) => validateTitle(e.currentTarget.value)}
		/>
	);
}

/**
 * Value is set on blur
 */
function DescriptionBox({
	canEdit,
	loadedContent,
	setLoadedContent,
}: {
	canEdit: boolean;
	loadedContent: string;
	setLoadedContent: (e: string) => void;
}) {
	const ref = useRef<HTMLTextAreaElement | null>(null);
	const maxLength = 255;

	useEffect(() => {
		if (ref.current) ref.current.value = loadedContent;
	}, [loadedContent]);

	return (
		<div className="w-full relative ">
			<textarea
				disabled={!canEdit}
				ref={ref}
				onBlur={(e) => setLoadedContent(e.currentTarget.value)}
				placeholder="start typing your comment..."
				maxLength={maxLength}
				rows={3}
				className="outline w-full px-1 resize-none"
			/>
			<p
				className={cn(
					"absolute text-sm bottom-1 right-5",
					maxLength - (ref.current?.value.length ?? 0) == 0
						? "text-red-500"
						: "text-inherit"
				)}>
				{maxLength - (ref.current?.value.length ?? 0)}
			</p>
		</div>
	);
}

function NewComment({ submit }: { submit: (e: string) => void }) {
	const [commentMsg, setCommentMsg] = useState<string>("");
	const maxLength = 255;

	return (
		<div className="flex flex-row w-full gap-2">
			<div className="w-full relative ">
				<textarea
					value={commentMsg}
					onChange={(e) => setCommentMsg(e.currentTarget.value)}
					placeholder="start typing your comment..."
					maxLength={maxLength}
					rows={3}
					className="outline w-full px-1 resize-none"
				/>
				<p
					className={cn(
						"absolute text-sm bottom-1 right-5",
						maxLength - commentMsg.length == 0 ? "text-red-500" : "text-inherit"
					)}>
					{maxLength - commentMsg.length}
				</p>
			</div>
			<Button
				onClick={() => {
					if (commentMsg.trim().length > 0) submit(commentMsg);
					setCommentMsg("");
				}}
				className="aspect-square h-max self-center">
				<PlusIcon />
			</Button>
		</div>
	);
}
