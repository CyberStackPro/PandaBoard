import { useAuthStore } from "@/stores/auth/auth-store";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

// export const axiosInstance = axios.create({
//   baseURL: API_URL,
//   withCredentials: true,
// });

class HttpClient {
  private static instance: HttpClient;
  private axiosInstance: AxiosInstance;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_URL,
      withCredentials: true,
      timeout: 10000,
    });

    this.setupInterceptors();
  }
  public static getInstance(): HttpClient {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient();
    }
    return HttpClient.instance;
  }

  public setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const accessToken = useAuthStore.getState().accessToken;
        if (!accessToken) {
          console.warn(
            "No access token available. Proceeding without authorization."
          );
        }

        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        // !originalRequest._retry: This ensures that the request has not already been retried. The _retry property is custom and is added to the originalRequest object to track whether a retry has already occurred. Without this check, you could end up in an infinite loop of retries.
        if (error.response?.status === 401 && !originalRequest._retry) {
          //   ?? originalRequest._retry = true: Marks the request as retried. This prevents the interceptor from retrying the same request multiple times.
          originalRequest._retry = true;
          return await this.handleTokenRefresh(originalRequest);
          // return this.axiosInstance(originalRequest);
        }
        if (originalRequest._retryCount && originalRequest._retryCount >= 3) {
          console.error("Max retries exceeded");
          return Promise.reject(error);
        }
        originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
        console.error("Interceptor error:", error.message || error);
        return Promise.reject(error);
      }
    );
  }

  // Update the handleTokenRefresh method in HttpClient class
  private async handleTokenRefresh(failedRequest: AxiosRequestConfig) {
    try {
      const { refreshToken } = useAuthStore.getState();

      if (!refreshToken) {
        useAuthStore.getState().clearAuth();
        throw new Error("No refresh token available");
      }

      const response = await axios.post(`${API_URL}/auth/refresh`, {
        refresh_token: refreshToken, // Match backend expected field name
      });

      const { access_token, refresh_token, user } = response.data;

      useAuthStore.getState().setAuth(user, access_token, refresh_token);

      if (failedRequest.headers) {
        failedRequest.headers.Authorization = `Bearer ${access_token}`;
      }

      return this.axiosInstance(failedRequest);
    } catch (error) {
      useAuthStore.getState().clearAuth();
      window.location.href = "/login";
      throw error;
    }
  }
  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

export const httpClient = HttpClient.getInstance();
export const axiosInstance = httpClient.getAxiosInstance();
