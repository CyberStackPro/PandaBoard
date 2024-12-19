import axios, { AxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000",
});

class APIClient<T> {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  get = async (config?: AxiosRequestConfig) => {
    const response = await axiosInstance.get<T>(this.endpoint, config);
    return response.data;
  };
  signup = async (config?: AxiosRequestConfig) => {
    const response = await axiosInstance.post<T>(this.endpoint, config);
    return response.data;
  };
}

export default APIClient;
