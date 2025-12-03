import dotenv from "dotenv";
dotenv.config({ quiet: true });

import { Sequelize } from "sequelize";

// Use the full connection URI from the environment variable
const connectionUri = process.env.DB_URI;

if (!connectionUri) {
	throw new Error("DB_UIR environment variable is not set.");
}

export const sequelize = new Sequelize(connectionUri, {
	// You must explicitly set 'ssl: true' and include
	// 'rejectUnauthorized: false' in dialectOptions for Neon's required SSL connection.
	// The `sslmode=require` in the URI implies SSL is needed,
	// but Sequelize might require the options object to be set correctly too.
	dialectOptions: {
		ssl: {
			require: true,
			rejectUnauthorized: false, // This is often necessary for cloud providers like Neon
		},
		clientMinMessages: "notice",
	},
	// The dialect, database, username, etc., are all parsed from the URI,
	// so you don't need to specify them individually.
	logging: false,
});
