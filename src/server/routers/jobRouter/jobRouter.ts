import { Router } from "express";
import { getJobs } from "../../controllers/jobControllers/jobControllers";

const jobRouter = Router();

jobRouter.get("/", getJobs);

export default jobRouter;
