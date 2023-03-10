import { type NextFunction, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { type UserLoginCredentials, type CustomJwtPayload } from "./types.js";
import User from "../../../database/models/User.js";
import CustomError from "../../../CustomError/CustomError.js";

export const loginUser = async (
  req: Request<
    Record<string, unknown>,
    Record<string, unknown>,
    UserLoginCredentials
  >,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).exec();

    if (!user) {
      const error = new CustomError("User not found", 401, "User not found");
      throw error;
    }

    if (!(await bcrypt.compare(password, user.password))) {
      const error = new CustomError(
        "Wrong user credentials",
        401,
        "Wrong user credentials"
      );
      throw error;
    }

    const jsonWebTokenPayload: CustomJwtPayload = {
      name: user.name,
      sub: user._id.toString(),
    };

    const token = jwt.sign(jsonWebTokenPayload, process.env.JWT_SECRET!, {
      expiresIn: "2d",
    });

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};
