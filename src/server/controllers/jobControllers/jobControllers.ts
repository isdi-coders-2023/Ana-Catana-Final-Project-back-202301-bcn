import { type NextFunction, type Request, type Response } from "express";
import CustomError from "../../../CustomError/CustomError.js";
import Job from "../../../database/models/Job.js";

export const getJobs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const jobs = await Job.find().exec();
    res.status(200).json({ jobs });
  } catch (error) {
    const customError = new CustomError(
      (error as Error).message,
      500,
      "No jobs found."
    );
    next(customError);
  }
};
