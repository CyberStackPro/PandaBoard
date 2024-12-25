import axios from "axios";
import { AxiosRequestConfig, AxiosResponse } from "axios";

// export interface FetchResponse<T> {
//   data: T;
// }
const axiosInstance = axios.create({
  baseURL: "http://localhost:4000/api/v1",
  withCredentials: true,
});

class APIClient<T, R = T> {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  get = async (config?: AxiosRequestConfig): Promise<R> => {
    const response: AxiosResponse<R> = await axiosInstance.get<R>(
      this.endpoint,
      config
    );
    return response.data;
  };
  post = async (data: T, config?: AxiosRequestConfig): Promise<R> => {
    const response: AxiosResponse<R> = await axiosInstance.post<R>(
      this.endpoint,
      data,
      config
    );
    return response.data;
  };
  patch = async (data: Partial<T>, config?: AxiosRequestConfig): Promise<R> => {
    const response: AxiosResponse<R> = await axiosInstance.patch<R>(
      this.endpoint,
      data,
      config
    );
    return response.data;
  };
  delete = async (config?: AxiosRequestConfig): Promise<R> => {
    const response: AxiosResponse<R> = await axiosInstance.delete<R>(
      this.endpoint,
      config
    );
    return response.data;
  };
}

export default APIClient;
