import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.ts";
import TaskList from "./taskList.model.ts";
import Workspace from "./workspace.model.ts";

type Status = "not started" | "in progress" | "completed" | "in review";
type Priority = "low" | "medium" | "high";

// 1. Define the attributes required for a Task instance (a row in the DB)
export interface TaskAttributes {
	id: number;
	title: string;
	description: string;
	status: Status;
	tags: string[];
	priority: Priority;
	dueBy: Date;
	taskListId: number; // Forgein key
	createdAt?: Date;
	updatedAt?: Date;
	workspaceId: number;
	assignedTo?: number[];
}

// 2. Define the attributes required for creation (ID is optional)
export type TaskCreationAttributes = Omit<
	TaskAttributes,
	"id" | "createdAt" | "updatedAt" | "assignedTo"
>;

// 3. Define the Model Class extending Sequelize.Model
class Task extends Model<TaskAttributes, TaskCreationAttributes> {
	declare id: number;
	declare title: string;
	declare description: string;
	declare status: Status;
	declare priority: Priority;
	declare tags: string[];
	declare dueBy: Date | null;
	declare assignedTo: number[];
	declare taskListId: number;
	declare createdAt: Date;
	declare workspaceId: number;
	declare updatedAt: Date;
}

Task.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},

		title: {
			type: DataTypes.STRING(100),
			allowNull: false,
			unique: true,
			validate: {
				notEmpty: {
					msg: "Title is required and cannot be empty.",
				},

				len: {
					args: [1, 100],
					msg: "Title must be between 1 and 100 characters long.",
				},
			},
		},

		description: {
			type: DataTypes.STRING(2048),
			allowNull: true,
		},

		status: {
			type: DataTypes.ENUM("not started", "in progress", "completed", "in review"),
			allowNull: false,
			defaultValue: "not started",
			validate: {
				isIn: {
					args: [["not started", "in progress", "completed", "in review"]],
					msg: "Invalid status value.",
				},
			},
		},

		priority: {
			type: DataTypes.ENUM("low", "medium", "high"),
			allowNull: true,
			validate: {
				isIn: {
					args: [["low", "medium", "high"]],
					msg: "Priority must be one of: low, medium, or high.",
				},
			},
		},

		tags: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			allowNull: true,
			defaultValue: [],
		},

		dueBy: {
			type: DataTypes.DATE,
			allowNull: true,
			validate: {
				// Ensure dueBy is not a date in the past
				isFuture(value: Date | null) {
					if (value && value < new Date()) {
						throw new Error("Due date cannot be in the past");
					}
				},
			},
		},

		assignedTo: {
			type: DataTypes.ARRAY(DataTypes.INTEGER),
			defaultValue: [],
		},

		taskListId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				key: "id",
			},
			onUpdate: "CASCADE",
			onDelete: "CASCADE",
		},
		workspaceId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Workspace, // Reference the Workspace model (assumed imported)
				key: "id",
			},
			onUpdate: "CASCADE",
			onDelete: "CASCADE",
		},
	},

	{
		sequelize,
	}
);

// ######### Define Associations ##########

TaskList.hasMany(Task, {
	foreignKey: "taskListId",
	as: "tasks",
	onDelete: "CASCADE",
});

Task.belongsTo(TaskList, {
	foreignKey: "taskListId",
	as: "taskList",
});

Task.belongsTo(Workspace, {
	foreignKey: "workspaceId",
	as: "workspace", // Use a meaningful alias
});
export default Task;
