import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import connectDatabase from "../../../database/connectDatabase.js";
import request from "supertest";
import app from "../..";

let mongodbServer: MongoMemoryServer;

beforeAll(async () => {
  mongodbServer = await MongoMemoryServer.create();
  const mongoServerUrl = mongodbServer.getUri();

  await connectDatabase(mongoServerUrl);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongodbServer.stop();
});

describe("Given a GET '/jobs' endpoint", () => {
  describe("When it receives a request with the GET method", () => {
    test("Then it should call its 'status' method with code '200' and its json method with a list of jobs", async () => {
      const expectedStatus = 200;
      const endpoint = "/jobs";

      await request(app).get(endpoint).expect(expectedStatus);
    });
  });
});
