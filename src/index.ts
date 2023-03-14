import "./loadEnviroments.js";
import createDebug from "debug";
import startServer from "./server/startServer.js";
import connectDatabase from "./database/connectDatabase.js";

export const debug = createDebug("jobtrail:server");

const port = process.env.PORT ?? 4001;
const mongoDdUrl = process.env.MONGODB_CONNECTION_URL!;

try {
  await connectDatabase(mongoDdUrl);
  debug("Connected to data base");

  await startServer(+port);
  debug(`Server listening on port ${port}`);
} catch (error) {
  debug(error.message);
}
