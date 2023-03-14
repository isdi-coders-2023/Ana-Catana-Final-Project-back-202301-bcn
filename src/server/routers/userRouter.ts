import { Router } from "express";
import { validate } from "express-validation";
import { loginUser } from "../controllers/userControllers.js";
import loginSchema from "../schemas/loginSchema.js";

const userRouter = Router();

userRouter.post(
  "/login",
  loginUser,
  validate(loginSchema, {}, { abortEarly: false })
);

export default userRouter;
