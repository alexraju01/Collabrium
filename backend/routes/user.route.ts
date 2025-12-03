import { Router } from "express";
import {
	deleteAccount,
	deleteUser,
	getAllUsers,
	getOneUser,
	updateDisplayName,
} from "../controllers/user.controller";
import { login, logout, protect, signUp } from "../controllers/auth.controller";

export const userRouter = Router();

userRouter.post("/signup", signUp);
userRouter.post("/login", login);
userRouter.get("/logout", logout);

// Protected routes - require authentication (must be before /:id routes)
userRouter.patch("/me/displayName", protect, updateDisplayName);
userRouter.delete("/me", protect, deleteAccount);
userRouter.get("/me", protect, (req, res) => {
	// `protect` middleware should attach the user to req.user
	// e.g., req.user = { id: ..., username: ..., email: ... }
	if (!req.user) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	res.json({
		email: req.user.email,
		displayName: req.user.displayName, // whatever fields you want
	});
});

userRouter.route("/").get(getAllUsers);
userRouter.route("/:id").get(getOneUser).delete(deleteUser);
