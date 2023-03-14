import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import app from "../..";
import { type UserStructure } from "../../controllers/userControllers/types.js";
import User from "../../../database/models/User.js";
import connectDatabase from "../../../database/connectDatabase.js";

const mockedUser: UserStructure = {
  name: "Alina",
  email: "alina@gmail.com",
  password: "12345678",
};

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

afterEach(async () => {
  await User.deleteMany();
});

describe("Given a POST 'user/login' endpoint", () => {
  describe("When it receives a request with name 'Alina', email 'alina@gmail.com' and password '12345678'", () => {
    test("Then it should response with status 200", async () => {
      const expectedStatus = 200;
      const endpoint = "/users/login";

      jwt.sign = jest.fn().mockImplementation(() => ({
        token: "token",
      }));
      const hashedPassword = await bcrypt.hash(mockedUser.password, 10);

      await User.create({
        ...mockedUser,
        password: hashedPassword,
        email: mockedUser.email,
        name: mockedUser.name,
      });

      const response = await request(app)
        .post(endpoint)
        .send(mockedUser)
        .expect(expectedStatus);

      expect(response.body).toHaveProperty("token");
    });
  });
});
