import { type Request, type Response, type NextFunction } from "express";
import CustomError from "../../CustomError/CustomError";
import { generalError, notFoundError } from "./errorMiddlewares";

const response: Partial<Response> = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};
const request: Partial<Request> = {};
const next: Partial<NextFunction> = jest.fn();

beforeEach(() => jest.clearAllMocks());

describe("Given a notFoundError middleware", () => {
  describe("When it receives a request", () => {
    test("Then it should call its method", () => {
      notFoundError(
        request as Request,
        response as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalled();
    });
  });
});

describe("Given a generalError middleware", () => {
  describe("When it receives an error with status code '500'", () => {
    test("Then it should call its status method with a ststus code '500'", () => {
      const statusCode = 500;
      const error = new CustomError(
        "500 Internal Server Error",
        500,
        "Something went wrong"
      );

      generalError(
        error,
        request as Request,
        response as Response,
        next as NextFunction
      );

      expect(response.status).toHaveBeenCalledWith(statusCode);
    });
  });

  describe("When it receives an error without status code or message", () => {
    test("then it should call its status method with a code '500' and its json method with 'Something went wrong'", () => {
      const error = new CustomError("", 0, "");
      const expectedStatusCode = 500;
      const expectedErrorMessage = { error: "Something went wrong" };

      generalError(
        error,
        request as Request,
        response as Response,
        next as NextFunction
      );

      expect(response.status).toHaveBeenCalledWith(expectedStatusCode);
      expect(response.json).toHaveBeenCalledWith(expectedErrorMessage);
    });
  });
});
