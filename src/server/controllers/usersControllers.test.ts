import mongoose from "mongoose";
import { type Response, type Request, type NextFunction } from "express";
import { MongoMemoryServer } from "mongodb-memory-server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/User";
import { type UserLoginCredentials } from "./types.js";
import { loginUser } from "./userControllers";
import CustomError from "../../CustomError/CustomError";
import connectDatabase from "../../database/connectDatabase";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDatabase(server.getUri());
});

afterAll(async () => {
  await server.stop();
  await mongoose.connection.close();
});

const mockedUserCredentials: UserLoginCredentials = {
  email: "alina@gmail.com",
  password: "12345678",
};

const request = {} as Request<
  Record<string, unknown>,
  Record<string, unknown>,
  UserLoginCredentials
>;

request.body = mockedUserCredentials;

const response = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
} as Partial<Response>;

const next = jest.fn() as NextFunction;

describe("Given a POST 'users/login' endpoint", () => {
  describe("When it receives a login request with email 'alina@gmail.com' and password '12345678'", () => {
    test("Then it should respond with status code '200' and its json method with a token ", async () => {
      const expectedStatusCode = 200;
      const mockedPasswordCompareResult = true;

      const expectedToken = {
        token: "$2a$10$PcbsEWhaed3zCLPfHwyln.MeWdAcMNOiLtVQrOX71soaIRASRjbQ6",
      };

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockReturnValue({
          ...request.body,
          _id: new mongoose.Types.ObjectId(),
        }),
      }));

      bcrypt.compare = jest.fn().mockResolvedValue(mockedPasswordCompareResult);
      jwt.sign = jest.fn().mockReturnValue(expectedToken.token);

      await loginUser(request, response as Response, next);

      expect(response.status).toHaveBeenCalledWith(expectedStatusCode);
      expect(response.json).toHaveBeenCalledWith(expectedToken);
    });
  });

  describe("When it receives a request with a email that doesn't match any dialogue or transaction in the database", () => {
    test("Then it should call its next method with a status code 481 and a message of 'User not found'", async () => {
      const expectedError = new CustomError(
        "User not found",
        401,
        "User not found"
      );

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue(undefined),
      }));

      await loginUser(request, response as Response, next);

      expect(next).toBeCalledWith(expectedError);
    });
  });
});
