// types.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  accessToken: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

export interface SignUpResponse {
  id: string;
  email: string;
  role: string;
  status: string;
  accessToken: string;
}

export interface APIError {
  message: string;
  error: string;
  statusCode: number;
}
