import { Router } from "express";
import { getJobs } from "../../controllers/jobControllers/jobControllers.js";

const jobRouter = Router();

jobRouter.get("/", getJobs);

export default jobRouter;
