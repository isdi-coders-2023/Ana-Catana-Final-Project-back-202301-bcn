import morgan from "morgan";
import express from "express";
import cors from "cors";
import options from "../middlewares/cors";

const app = express();

app.disable("x-powered-by");

app.use(morgan("dev"));
app.use(express.json());
app.use(cors(options));

export default app;
