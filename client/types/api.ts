export interface APIError {
  message: string;
  error: string;
  statusCode: number;
}

export interface APIResponse<T> {
  data: T;
  status: number;
}
