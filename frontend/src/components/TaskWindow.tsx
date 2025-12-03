import {
	PrioBg,
	Priority,
	StatusBg,
	TaskStatus,
	type Role,
} from "@/lib/interfaces/types";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "./Button";
import { cn } from "@/lib/classCombine";
import { ChevronIcon, Divider, PlusIcon } from "./svgs";
import { useOnClickOutside } from "usehooks-ts";
import type { TaskRequest, TaskResponse } from "@/lib/interfaces/ITask";
import type {
	ActivityRequest,
	ActivityResponse,
} from "@/lib/interfaces/IActivity";
import type { TimeLogResponse } from "@/lib/interfaces/ITimeLog";
import { useGetTask } from "@/lib/queries/GetTask";
import axios from "axios";
import type { AccountResponse } from "@/lib/interfaces/IAccount";
import { DateFormatter } from "@/lib/dateFormatter";

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
	//Fetch data
	const { data, isError, isPending } = useGetTask(id);
	const [task] = useState<TaskResponse | null>(data ?? null);

	// if (isPending) return <p>Loading</p>;
	// if (isError) return <p>Error</p>;
	// if(!data) return <p>Could not load data</p>;

	//Set values
	const windowRef = useRef<any>(null);
	const [title, setTitle] = useState(task?.title ?? "Default Title");
	const [description, setDescription] = useState(
		task?.description ?? "No description"
	);
	const [tags, setTags] = useState(task?.tags ?? ["tag 1", "tag 2"]);
	const [status, setStatus] = useState(task?.status ?? 2);
	const [dueDate, setDueDate] = useState(task?.dueDate ?? new Date());
	const [createdBy] = useState(task?.createdBy.displayName ?? "unknown");
	const [createdAt] = useState(task?.createdAt ?? new Date());
	const [assignedTo, setAssignedTo] = useState(task?.assignedTo);
	const [activity, setActivity] = useState(task?.activity ?? []);
	const [priority, setPriority] = useState(task?.prioity ?? 0);

	const [edited, setEdited] = useState(false);

	const [openSave, setOpenSave] = useState(false);

	async function submitComment(e: string) {
		//api call to add comment
		console.log("Comment: ", e);

		try {
			const nActivity: ActivityRequest = {
				message: e,
				createdBy: createdBy,
				parentId: "test",
				// parentId: data!.parentId,
			};

			//post task to the api
			/*
			const url = `${import.meta.env.BASE_URL}/api/v1/activity/${id}`; //CHECK ENDPOINT
			const req = await axios.post(url, nActivity);

			if (req.status >= 200 && req.status < 299) {
				console.log("Successfully created activity");

			const resActivity = req.data as ActivityResponse; //check we get the full data back, might just be the id
			*/

			const FAKEACC = {
				createdAt: new Date(),
				displayName: "Some Name",
				email: "idk",
				id: "123",
			} as AccountResponse;

			const date = new Date();
			date.setMonth(10);

			const PLACEHOLDER = {
				createdAt: date,
				parentId: "123",
				createdBy: FAKEACC, //could get from
				id: "1",
				message: e,
			} as ActivityResponse;

			setActivity([PLACEHOLDER, ...activity]);
			// }

			//didnt work
		} catch (e) {
			console.log(
				"There was an error, likely there was not parentId provided for this task. ParentId: " +
					data?.parentId
			);
		}

		//if added, add it to the list of comments to display
		//Push the comment to the db,
		//get the returned comment with all values
		//add it to the current comment list
		// setActivity([...activity, newcomment])
	}

	function handleSaveTask() {
		console.log("Save task");

		//save task, then close

		closeTask("");

		//then close task
	}

	function handleCancelTask() {
		// console.log("Cancel task edit");
		closeTask("");
	}

	function handleCloseTask() {
		if (!edited) {
			closeTask("");
		}

		setOpenSave(true);

		//open a warning saying cancel or save
	}

	/**@summary IF FALSE, CAN EDIT */
	const [canEdit] = useState(role == "Admin" || role == "Owner" ? true : false); // true if admin+ or task owner	//SET THIS TO !FALSE !!!!!!!!

	return (
		<div className="absolute p-2 bg-base-200 rounded-box h-full flex flex-col w-11/12 max-w-3xl max-h-11/12 top-[calc(1/24*100%)] left-1/2 -translate-x-1/2">
			{/* Task title Box */}
			<div className="overflow-y-scroll scrollbar-thin flex flex-col h-full">
				<div className="flex flex-col rounded-box bg-base-100 border-base-300 border h-min p-2 py-4">
					<div className="flex place-content-between h-min items-center">
						<TitleBox
							canEdit={!canEdit}
							title={title}
							setTitle={setTitle}
							setEdited={setEdited}
						/>
						<div className="flex">
							<Button className="rounded-full p-2" onClick={handleCloseTask}>
								<PlusIcon classname={"rotate-45"} />
							</Button>
						</div>
					</div>
					<p className="flex">
						Created: {DateFormatter(createdAt).toLocaleString()}
						{edited ? "*" : ""}
					</p>
				</div>
				{/* Task Info Dropdown */}
				<details
					open={true}
					className="collapse min-h-fit collapse-arrow bg-base-100 border-base-300 border">
					<summary className="collapse-title font-semibold text-3xl px-2">
						Task Info
					</summary>
					<div className="collapse-content text-sm">
						<div className="grid">
							<div className="flex flex-col gap-1">
								{/* Prio */}
								<h4>Priority</h4>
								<PriorityComponent
									canEdit={canEdit}
									setEdited={setEdited}
									priority={priority}
									setPriority={setPriority}
								/>
							</div>
							<Divider />
							<div>
								{/* Status */}
								<h4>Status</h4>
								<StatusComponent
									setEdited={setEdited}
									status={status}
									setStatus={setStatus}
								/>
							</div>
							<Divider />
							{/* Due date */}
							<div className="flex flex-col">
								<h4>Due Date:</h4>
								<p>{DateFormatter(dueDate)}</p>
							</div>
							<Divider />

							{/* Created by */}
							<div className="flex flex-col">
								<h4>Created by:</h4>
								<p>{createdBy}</p>
							</div>
							<Divider />

							{/* Assigned to */}
							<div className="flex flex-col">
								<h4>Assigned to:</h4>
								<div className="flex flex-row gap-4 flex-wrap">
									{!assignedTo && <p>No one</p>}
									{assignedTo?.map(({ displayName }, index) => (
										<p key={index}>{displayName}</p>
									))}
								</div>
							</div>
						</div>
					</div>
				</details>

				{/* Task Description */}
				<div className="flex flex-col rounded-box bg-base-100 border-base-300 border grow p-2 py-4">
					<h3 className="font-semibold">Description</h3>
					<DescriptionBox
						canEdit={canEdit}
						loadedContent={description}
						setLoadedContent={setDescription}
						setEdited={setEdited}
					/>
				</div>

				<div className="flex flex-col rounded-box bg-base-100 duration-300 transition-all border-base-300 border p-2 py-4">
					<h3 className="font-semibold">Activity / Logs</h3>
					{/* Input activity text area */}
					<NewComment submit={submitComment} />
					<ol className="overflow-y-scroll scrollbar-thin min-h-8 h-full max-h-64 flex flex-col p-2">
						{activity.map((activity, index) => (
							<>
								<TaskActivity key={index} activity={activity} />
								<Divider />
							</>
						))}
					</ol>
				</div>
			</div>
			{openSave && (
				<SaveWindow
					commitSave={handleSaveTask}
					dontSave={handleCancelTask}
					setOpen={setOpenSave}
				/>
			)}
		</div>
	);
}

function TaskActivity({ activity }: { activity: ActivityResponse }) {
	return (
		<div className="flex flex-col p-1">
			<div className="text-sm">
				{/* This should show a time if the date is today, otherwise date, maybe on hover shows full tooltip */}
				{`${activity.createdBy.displayName} | ${DateFormatter(activity.createdAt)}`}
			</div>
			<div className="w-full text-wrap">{activity.message}</div>
		</div>
	);
}

function SaveWindow({
	commitSave,
	dontSave,
	setOpen,
}: {
	commitSave: () => void;
	dontSave: () => void;
	setOpen: (b: boolean) => void;
}) {
	return (
		<div className="absolute p-2 bg-base-300 shadow-md rounded-box h-fit flex flex-col w-11/12 max-w-3xl max-h-11/12 top-1/2 -translate-y-1/2  left-1/2 -translate-x-1/2">
			<div className="flex place-content-between items-center">
				<h2>Save Task?</h2>
				<div className="flex">
					<Button className="rounded-full p-2" onClick={() => setOpen(false)}>
						<PlusIcon classname={"rotate-45"} />
					</Button>
				</div>
			</div>
			<div>Do you want to save any changes made to this task?</div>
			<div className="flex justify-end items-center gap-4">
				<Button onClick={dontSave} className="w-24 bg-error text-error-content">
					Don't Save
				</Button>
				<Button
					onClick={commitSave}
					className="w-24 bg-success text-success-content">
					Save
				</Button>
			</div>
		</div>
	);
}

function StatusComponent({
	setEdited,
	status,
	setStatus,
}: {
	setEdited: (e: boolean) => void;
	status: TaskStatus;
	setStatus: (e: TaskStatus) => void;
}) {
	return (
		<select
			value={TaskStatus[status]}
			className={cn(
				"place-self-start p-1 px-4 rounded-field",
				StatusBg[status]
			)}
			onChange={(e) => {
				setEdited(true);
				setStatus(TaskStatus[e.currentTarget.value]);
			}}>
			<option className="bg-base-100" value={TaskStatus[0]}>
				Not Started
			</option>
			<option className="bg-base-100" value={TaskStatus[1]}>
				In Progress
			</option>
			<option className="bg-base-100" value={TaskStatus[2]}>
				Completed
			</option>
			<option className="bg-base-100" value={TaskStatus[3]}>
				In Review
			</option>
		</select>
	);
}

function PriorityComponent({
	canEdit,
	setEdited,
	priority,
	setPriority,
}: {
	canEdit: boolean;
	setEdited: (e: boolean) => void;
	priority: Priority;
	setPriority: (e: Priority) => void;
}) {
	return canEdit ? (
		// Can edit, return select
		<select
			disabled={!canEdit}
			value={Priority[priority]}
			className={cn(
				"flex rounded-field place-self-start p-1 px-4",
				PrioBg[priority]
			)}
			onChange={(e) => {
				setEdited(true);
				setPriority(Priority[e.currentTarget.value]);
			}}>
			<option className={"bg-base-100"} value={Priority[0]}>
				{Priority[0]}
			</option>
			<option className={"bg-base-100"} value={Priority[1]}>
				{Priority[1]}
			</option>
			<option className={"bg-base-100"} value={Priority[2]}>
				{Priority[2]}
			</option>
		</select>
	) : (
		// Can not edit, return icon
		<div
			className={cn(PrioBg[priority], "rounded-field w-fit text-lg p-1 px-4")}>
			{Priority[priority]}
		</div>
	);
}

function TitleBox({
	canEdit,
	title,
	setTitle,
	setEdited,
}: {
	canEdit: boolean;
	title: string;
	setTitle: (title: string) => void;
	setEdited: (v: boolean) => void;
}) {
	const ref = useRef<HTMLInputElement | null>(null);
	const maxLength = 100;

	useEffect(() => {
		if (ref.current) ref.current.value = title;
	}, [title]);

	function validateTitle(e: string) {
		e = e.trim() ?? "";

		if (e === title) return;

		if (e.length > 0) {
			setEdited(true);
			setTitle(e);
		} else {
			if (ref.current) ref.current.value = title;
		}
	}

	return (
		<input
			disabled={canEdit}
			className="text-4xl font-bold w-full flex line-clamp-1 text-ellipsis"
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
	setEdited,
}: {
	canEdit: boolean;
	loadedContent: string;
	setLoadedContent: (e: string) => void;
	setEdited: (v: boolean) => void;
}) {
	const ref = useRef<HTMLTextAreaElement | null>(null);
	const maxLength = 2048;

	useEffect(() => {
		if (ref.current) ref.current.value = loadedContent;
	}, [loadedContent]);

	return (
		<div className="w-full relative flex h-full overflow-visible">
			<textarea
				disabled={!canEdit}
				ref={ref}
				onBlur={(e) => {
					if (loadedContent !== e.currentTarget.value) {
						setEdited(true);
						setLoadedContent(e.currentTarget.value);
					}
				}}
				placeholder="start typing your comment..."
				maxLength={maxLength}
				className="bg-base-200 outline-base-300 rounded-field p-4 w-full min-h-64 resize-none"
			/>
			{canEdit && (
				<p
					className={cn(
						"absolute text-sm bottom-1 right-5",
						maxLength - (ref.current?.value.length ?? 0) == 0
							? "text-red-500"
							: "text-inherit"
					)}>
					{maxLength - (ref.current?.value.length ?? 0)}
				</p>
			)}
		</div>
	);
}

function NewComment({ submit }: { submit: (e: string) => void }) {
	const [commentMsg, setCommentMsg] = useState<string>("");
	const maxLength = 255;

	return (
		<div className="flex flex-row w-full gap-2 bg-base-200 p-2 rounded-box focus-within:outline-1 outline-base-300">
			<div className="w-full relative ">
				<textarea
					value={commentMsg}
					onChange={(e) => setCommentMsg(e.currentTarget.value)}
					placeholder="start typing your comment..."
					maxLength={maxLength}
					rows={3}
					className="w-full px-1 resize-none focus-within:outline-none"
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
				className="aspect-square rounded-selector h-max self-center">
				<PlusIcon />
			</Button>
		</div>
	);
}
