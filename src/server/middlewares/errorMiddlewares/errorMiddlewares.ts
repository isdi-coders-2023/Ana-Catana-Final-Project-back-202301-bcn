import "../../../loadEnviroments.js";
import createDebug from "debug";
import { type Request, type Response, type NextFunction } from "express";
import CustomError from "../../../CustomError/CustomError.js";

const debug = createDebug("jobtrail:errorMiddlewares");

export const notFoundError = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new CustomError("Path not found", 404, "Endpoint not found");

  next(error);
};

export const generalError = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  debug(error.message);

  const statusCode = error.statusCode || 500;
  const publicMessage = error.publicMessage || "Something went wrong";

  res.status(statusCode).json({ error: publicMessage });
};
