import { axiosInstance } from "@/lib/axios";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

class APIClient<T, R = T> {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async get(path = "", config?: AxiosRequestConfig): Promise<R> {
    try {
      const response: AxiosResponse<R> = await axiosInstance.get<R>(
        `${this.endpoint}${path}`,
        config
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async post(data: T, config?: AxiosRequestConfig): Promise<R> {
    try {
      const response: AxiosResponse<R> = await axiosInstance.post<R>(
        this.endpoint,
        data,
        config
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async patch(
    path: string,
    data: Partial<T>,
    config?: AxiosRequestConfig
  ): Promise<R> {
    try {
      const response: AxiosResponse<R> = await axiosInstance.patch<R>(
        `${this.endpoint}${path}`,
        data,
        config
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete(path: string, config?: AxiosRequestConfig): Promise<R> {
    try {
      const response: AxiosResponse<R> = await axiosInstance.delete<R>(
        `${this.endpoint}${path}`,
        config
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        message: error.response?.data?.message || "An error occurred",
        status: error.response?.status,
        data: error.response?.data,
      };
    }
    return error;
  }
}

export default APIClient;
