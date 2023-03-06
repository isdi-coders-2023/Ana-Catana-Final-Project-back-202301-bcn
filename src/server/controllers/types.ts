export interface UserStructure {
  name: string;
  email: string;
  password: string;
}

export type UserLoginCredentials = Pick<UserStructure, "email" | "password">;
