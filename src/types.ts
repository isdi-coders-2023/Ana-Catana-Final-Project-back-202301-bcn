import { type Request } from "express";
import { type UserLoginCredentials } from "./server/controllers/types.js";

export type CustomRequest = Request<
  Record<string, unknown>,
  Record<string, unknown>,
  UserLoginCredentials
>;
