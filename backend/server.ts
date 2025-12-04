import app from "./app.ts";
import { sequelize } from "./config/db.ts";
import { BLUE, ORANGE, RED, RESET } from "./lib/colours.ts";

async function startServer() {
	try {
		console.log(`${BLUE}Connecting to the database...${RESET}`);
		await sequelize.authenticate();
		console.log(`${BLUE}Successfully connected to the database.${RESET}`);

		// check
		const { PORT } = process.env;
		app.listen(PORT, () => {
			console.log(process.env.NODE_ENV);
			console.log(`${ORANGE}Server listenings on ${process.env.URL} ${RESET}`);
		});
	} catch (error) {
		console.error(`${RED}Unable to connect to the database:${RESET}`, error);
		process.exit(1);
	}
}

startServer();
