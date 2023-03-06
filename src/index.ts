import "./loadEnviroments.js";
import createDebug from "debug";
import startServer from "./server/startServer.js";
import connectDatabase from "./database/connectDatabase.js";

export const debug = createDebug("users:*");

const port = process.env.PORT ?? 4000;
const mongoDdUrl = process.env.MONGODB_CONNECTION_URL!;

try {
  await connectDatabase(mongoDdUrl);
  debug("Connected to data base");

  await startServer(Number(port));
  debug(`Server listening on port ${port}`);
} catch (error) {
  debug(error.message);
}
