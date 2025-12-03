import { sequelize } from "../config/db.ts";
import { GREEN, RED, RESET } from "../lib/colours.ts";
import Task from "../models/task.model.ts";
import TaskList from "../models/taskList.model.ts";
import User from "../models/user.model.ts";
import Workspace from "../models/workspace.model.ts";
import { WorkspaceUser } from "../models/workspaceUser.model.ts";

import usersData from "./users.seed.json" with { type: "json" };
import workspaceUsersData from "./workspaceUsers.seed.json" with { type: "json" };
import workspacesData from "./workspaces.seed.json" with { type: "json" };
import taskListsData from "./taskLists.seed.json" with { type: "json" };
import tasksData from "./tasks.seed.json" with { type: "json" };

const seedDatabase = async () => {
	try {
		await sequelize.sync({ force: true });

		await User.bulkCreate(usersData, { individualHooks: true });
		console.log(`${GREEN} Users seeded Successfully!${RESET}`);

		await Workspace.bulkCreate(workspacesData);
		console.log(`${GREEN} Workspaces seeded Successfully!${RESET}`);

		await WorkspaceUser.bulkCreate(workspaceUsersData);
		console.log(`${GREEN} WorkspaceUser pivot table seeded Successfully!${RESET}`);

		await TaskList.bulkCreate(taskListsData);
		console.log(`${GREEN} Tasklist seeded Successfully!${RESET}`);

		await Task.bulkCreate(tasksData);
		console.log(`${GREEN} Tasks seeded Successfully!${RESET}`);

		// 5. Exit the process
		process.exit(0); // Use code 0 for a successful exit
	} catch (error) {
		console.error(`${RED}Database seeding failed:${RESET}`, error);
		process.exit(1); // Use code 1 for an error exit
	}
};

seedDatabase();
