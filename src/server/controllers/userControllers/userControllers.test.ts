import mongoose from "mongoose";
import { type Response, type Request, type NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../../database/models/User";
import { type CustomRequest } from "../../../types";
import { type UserLoginCredentials } from "./types.js";
import { loginUser } from "./userControllers";
import CustomError from "../../../CustomError/CustomError";

const mockedUserCredentials: UserLoginCredentials = {
  email: "alina@gmail.com",
  password: "12345678",
};

const request: Partial<Request> = {};

request.body = mockedUserCredentials;

const response: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const next: Partial<NextFunction> = jest.fn();

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

      await loginUser(
        request as CustomRequest,
        response as Response,
        next as NextFunction
      );

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

      await loginUser(
        request as CustomRequest,
        response as Response,
        next as NextFunction
      );

      expect(next).toBeCalledWith(expectedError);
    });
  });

  describe("When it receives a request with an email alina@gmail.com and a password that doesn't match", () => {
    test("Then it should call its next method with a status code 401 and a message of 'Wrong user credentials'", async () => {
      const expectedError = new CustomError(
        "Wrong user credentials",
        401,
        "Wrong user credentials"
      );

      User.findOne = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue({ ...mockedUserCredentials }),
      }));

      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await loginUser(
        request as CustomRequest,
        response as Response,
        next as NextFunction
      );

      expect(next).toBeCalledWith(expectedError);
    });
  });
});
