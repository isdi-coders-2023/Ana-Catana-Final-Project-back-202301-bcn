import mongoose from "mongoose";
import { type Response, type Request } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/User";
import { type UserStructure } from "./types.js";
import { loginUser } from "./userControllers";

const mockedUser: UserStructure = {
  name: "Alina",
  email: "alina@gmail.com",
  password: "12345678",
};

describe("Given a POST 'users/login' endpoint", () => {
  describe("When it receives a login request with email 'alina@gmail.com' and password '12345678'", () => {
    test("Then it should respond with status code '200' and its json method with a token ", async () => {
      const expectedStatusCode = 200;
      const mockedPasswordCompareResult = true;

      const request = {} as Request;

      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const expectedToken = {
        token: "$2a$10$PcbsEWhaed3zCLPfHwyln.MeWdAcMNOiLtVQrOX71soaIRASRjbQ6",
      };

      request.body = {
        email: mockedUser.email,
        password: mockedUser.password,
      };

      const next = jest.fn();

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockReturnValue({
          ...request.body,
          _id: new mongoose.Types.ObjectId(),
        }),
      }));

      bcrypt.compare = jest.fn().mockResolvedValue(mockedPasswordCompareResult);
      jwt.sign = jest.fn().mockReturnValue(expectedToken.token);

      await loginUser(
        request as Request<
          Record<string, unknown>,
          Record<string, unknown>,
          UserStructure
        >,
        response as unknown as Response,
        next
      );

      expect(response.status).toHaveBeenCalledWith(expectedStatusCode);
      expect(response.json).toHaveBeenCalledWith(expectedToken);
    });
  });
});
