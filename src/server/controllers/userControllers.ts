import { type NextFunction, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { type UserLoginCredentials, type CustomJwtPayload } from "./types.js";
import User from "../../models/User.js";
import CustomError from "../../CustomError/CustomError.js";

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

    if (!user || !(await bcrypt.compare(password, user.password))) {
      const error = new CustomError("User not found", 401, "User not found");
      next(error);
      return;
    }

    const jsonWebTokenPayload: CustomJwtPayload = {
      sub: user._id.toString(),
      email: user.email,
    };

    const token = jwt.sign(jsonWebTokenPayload, process.env.JWT_SECRET!, {
      expiresIn: "2d",
    });

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};
