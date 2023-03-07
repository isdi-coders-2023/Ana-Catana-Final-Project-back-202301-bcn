import type { JwtPayload } from "jsonwebtoken";
export interface UserStructure {
  name: string;
  email: string;
  password: string;
}
export interface CustomJwtPayload extends JwtPayload {
  email: string;
  sub: string;
}

export type UserLoginCredentials = Pick<UserStructure, "email" | "password">;
