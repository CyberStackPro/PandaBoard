import { User } from "./user";

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  user: User;
  accessToken: string;
}

export interface SignUpResponse {
  user: User;
  accessToken: string;
}
