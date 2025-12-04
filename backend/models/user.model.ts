import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.ts";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export type Roles = "admin" | "user";

export interface UserAttributes {
	id: number;
	displayName: string;
	email: string;
	password: string;
	confirmPassword: string; // Virtual field for validation
	role?: Roles;
	passwordChangedAt: Date | null;

	passwordResetToken?: string | null;
	passwordResetExpires?: Date | null;
	currentWorkspaceRole?: Roles;
}

export type UserCreationAttributes = Omit<UserAttributes, "id" | "currentWorkspaceRole">;

class User extends Model<UserAttributes, UserCreationAttributes> {
	declare id: number;
	declare displayName: string;
	declare email: string;
	declare password: string;
	declare confirmPassword: string;
	declare role?: Roles;
	declare passwordChangedAt: Date | null;

	declare passwordResetToken: string | null;
	declare passwordResetExpires: Date | null;
	currentWorkspaceRole?: Roles;

	// Method to strip sensitive data (passwords) when converting model instance to JSON
	toJSON() {
		const values: Partial<UserAttributes> = this.get();
		delete values.password;
		delete values.confirmPassword;
		return values;
	}

	// Instance method: Compares candidate password with the stored hash
	async correctPassword(candidatePassword: string): Promise<boolean> {
		return await bcrypt.compare(candidatePassword, this.password);
	}

	// Instance method: Checks if password was changed after JWT was issued(for futeure task)
	changedPasswordAfter(JWTTimestamp: number): boolean {
		if (this.passwordChangedAt instanceof Date && this.passwordChangedAt) {
			const changedTimestamp = Math.floor(this.passwordChangedAt.getTime() / 1000);
			return JWTTimestamp < changedTimestamp;
		}
		return false;
	}

	createPasswordResetToken(): string {
		const resetToken = crypto.randomBytes(32).toString("hex");

		this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");

		// expires to 10 minutes
		this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

		return resetToken;
	}
}

User.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		displayName: {
			type: DataTypes.STRING(100),
			allowNull: false,
			unique: false,
			validate: {
				notEmpty: { msg: "Display name is required" },
				len: {
					args: [3, 50],
					msg: "Display name must be between 3 and 50 characters",
				},
				is: {
					args: /^[a-zA-Z0-9._\s]+$/i,
					msg: "Display name can only contain letters, numbers, dots, underscores, and spaces",
				},
			},
		},

		email: {
			type: DataTypes.STRING(255),
			allowNull: false,
			unique: true,
			validate: {
				notEmpty: { msg: "Email is required" },
				isEmail: { msg: "Invalid email format" },
			},
		},

		password: {
			type: DataTypes.STRING(255),
			allowNull: false,
			validate: {
				notEmpty: { msg: "Password is required" },
				len: {
					args: [8, 255],
					msg: "Password must be at least 8 characters long",
				},
			},
		},

		confirmPassword: {
			type: DataTypes.VIRTUAL, // Not saved to DB
			allowNull: false,
			validate: {
				notEmpty: { msg: "Confirm password is required" },
				passwordMatches(value: string) {
					if (value !== (this as User).password) {
						throw new Error("Password and Confirm Password must match.");
					}
				},
			},
		},

		passwordChangedAt: {
			type: DataTypes.DATE,
			allowNull: true,
		},

		role: {
			type: DataTypes.ENUM("admin", "user"),
			allowNull: false,
			defaultValue: "user",
			validate: {
				isIn: {
					args: [["admin", "user"]],
					msg: "Invalid role",
				},
			},
		},

		passwordResetToken: {
			type: DataTypes.STRING,
			allowNull: true,
		},

		passwordResetExpires: {
			type: DataTypes.DATE,
			allowNull: true,
		},
	},
	{
		sequelize,
		timestamps: false,

		hooks: {
			// HASH PASSWORD before creating a new user
			beforeCreate: async (user) => {
				if (user.password) {
					const salt = await bcrypt.genSalt(12);
					user.password = await bcrypt.hash(user.password, salt);
					user.confirmPassword = ""; // Clear the virtual field
				}
			},

			// HASH PASSWORD and set passwordChangedAt before updating an existing user
			beforeUpdate: async (user) => {
				if (user.changed("password") && user.password) {
					const salt = await bcrypt.genSalt(12);
					user.password = await bcrypt.hash(user.password, salt);
					user.confirmPassword = ""; // Clear the virtual field

					user.passwordChangedAt = new Date(Date.now() - 1000);
				}
				if (user.changed("password") && user.passwordResetToken) {
					user.passwordResetToken = null;
					user.passwordResetExpires = null;
				}
			},
		},

		defaultScope: {
			// Default scope excludes password for all standard queries
			attributes: { exclude: ["password"] },
		},

		scopes: {
			withPasswords: {
				// Scope to explicitly include password when needed (e.g., for login)
				attributes: {
					include: ["password"],
				},
			},
		},
	}
);

export default User;
