import morgan from "morgan";
import express from "express";
import cors from "cors";
import options from "./middlewares/cors.js";
import userRouter from "./routers/userRouter/userRouter.js";
import {
  generalError,
  notFoundError,
} from "./middlewares/errorMiddlewares/errorMiddlewares.js";

const app = express();

app.disable("x-powered-by");

app.use(morgan("dev"));
app.use(express.json());
app.use(cors(options));

app.use("/users", userRouter);

app.use(notFoundError);
app.use(generalError);

export default app;
