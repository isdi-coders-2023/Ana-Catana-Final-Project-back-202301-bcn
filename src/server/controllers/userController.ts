import { type NextFunction, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import CustomError from "../../CustomError/CustomError.js";
import { type UserStructure } from "./types.js";
import User from "../../models/User.js";

export const registerUser = async (
  req: Request<Record<string, unknown>, Record<string, unknown>, UserStructure>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const feedbackCreateUserMessage = `Account created for ${name}.`;
    res.status(201).json({ message: feedbackCreateUserMessage });
  } catch (error) {
    const customError = new CustomError(
      (error as Error).message,
      500,
      "Unable to create an user."
    );
    next(customError);
  }
};
