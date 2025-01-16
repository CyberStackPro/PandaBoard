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
export interface Tokens {
  access_token: string;
  refresh_token: string;
}

export interface SignInResponse {
  user: User;
  tokens: Tokens;
}

export interface SignUpResponse {
  user: User;
  tokens: Tokens;
}
