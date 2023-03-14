import { type NextFunction, type Request, type Response } from "express";
import CustomError from "../../../CustomError/CustomError";
import Jobs from "../../../database/models/Job";
import { getJobs } from "./jobControllers";
import { type JobsStructure } from "./types";

const mockedJobsList: JobsStructure = [];

describe("Given a 'getJobs' controller", () => {
  const req: Partial<Request> = {};
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next: NextFunction = jest.fn();

  describe("When it receives a request with method GET", () => {
    test("Then it should call its 'status' method with code 200 and its json method with a list of jobs", async () => {
      const expectedStatus = 200;

      Jobs.find = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockReturnValue(mockedJobsList),
      }));

      await getJobs(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
      expect(res.json).toHaveBeenLastCalledWith({ jobs: mockedJobsList });
    });
  });

  describe("When it receives a bad request", () => {
    test("Then it should call it's next method ", async () => {
      const res: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const error = new Error("Bad request");

      req.body = {};

      Jobs.find = jest.fn().mockImplementationOnce(() => {
        throw new Error("Bad request");
      });

      await getJobs(req as Request, res as Response, next);
    });
  });
});
