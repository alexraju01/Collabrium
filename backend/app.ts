import dotenv from "dotenv";
dotenv.config({ quiet: true });
import express from "express";
import { taskRouter } from "./routes/task.route.ts";
import { globalErrorHandler } from "./controllers/error.controller.ts";
import AppError from "./lib/AppError.ts";
import { userRouter } from "./routes/user.route.ts";
import { workspaceRouter } from "./routes/workspace.route.ts";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { taskListRouter } from "./routes/taskList.route.ts";
import { dashboardRouter } from "./routes/dashboard.route.ts";

const app = express();

const limiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	limit: 5000,
	message: "Too many request from this IP Address, Please try again in an hour!",
});

// Helemt sets HTTP security headers
app.use(helmet());
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);

app.use("/api", limiter);
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
	next();
});

// Resouces Routing
app.use("/api/v1/task", taskRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/workspace", workspaceRouter);
app.use("/api/v1/tasklist", taskListRouter);
app.use("/api/v1/dashboard", dashboardRouter);

app.get("/{*splat/}", async (req, res, next) => {
	next(new AppError(`can't find the ${req.originalUrl} on the this server`, 404));
});

app.use(globalErrorHandler);

export default app;
