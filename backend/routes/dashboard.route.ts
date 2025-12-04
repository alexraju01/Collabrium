import { Router } from "express";
import { getDashboardData } from "../controllers/dashboard.controller.ts";
import { protect } from "../controllers/auth.controller.ts";

export const dashboardRouter = Router();

dashboardRouter.route("/").get(protect, getDashboardData);
