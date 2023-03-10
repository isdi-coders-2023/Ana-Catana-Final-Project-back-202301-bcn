import "../loadEnviroments.js";
import createDebug from "debug";
import app from "./index.js";
import type CustomError from "../CustomError/CustomError.js";

const debug = createDebug("jobtrail:server");

const startServer = async (port: number) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(`Start with server 'http://localhost:${port}'`);
      resolve(server);
    });

    server.on("error", (error: CustomError) => {
      const errorMessage = "Error on starting the server";

      if (error.code === "EADDRINUSE") {
        debug(errorMessage, `The port number ${port} is already in use`);
      }

      reject(new Error(errorMessage));
    });
  });

export default startServer;
