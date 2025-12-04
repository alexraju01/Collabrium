import { Router } from "express";
import {
	createWorkspace,
	deleteWorkspace,
	getAllWorkspace,
	getOneWorkspace,
	joinWorkspace,
	updateWorkspace,
} from "../controllers/workspace.controller.ts";
import { protect, restrictTo } from "../controllers/auth.controller.ts";

export const workspaceRouter = Router();

workspaceRouter.route("/").get(protect, getAllWorkspace);

workspaceRouter.route("/create").post(protect, createWorkspace);
workspaceRouter.route("/join").post(protect, joinWorkspace);

workspaceRouter
	.route("/:id")
	.get(protect, getOneWorkspace)
	.patch(protect, restrictTo("admin"), updateWorkspace)
	.delete(protect, restrictTo("admin"), deleteWorkspace);
