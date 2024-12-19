import { useState } from "react";
import APIClient from "@/services/api-client";
import {
  SignUpRequest,
  SignUpResponse,
  SignInRequest,
  SignInResponse,
} from "@/types/auth";
import { useToast } from "../use-toast";
import { APIError } from "@/types/api";

type AuthFunction<T, R> = (data: T) => Promise<R | undefined>;

const createAuthHook = <TRequest, TResponse>(endpoint: string) => {
  const apiClient = new APIClient<TRequest, TResponse>(endpoint);

  return () => {
    const [data, setData] = useState<TRequest>({} as TRequest);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const authenticate: AuthFunction<TRequest, TResponse> = async (data) => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiClient.post(data);

        toast({
          title: "Success",
          description: "Operation successful",
          variant: "default",
        });
        return response;
      } catch (err: unknown) {
        const error = err as { response: { data: APIError } };
        const errorMessage =
          error.response?.data?.message || "An error occurred";
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    return { data, setData, error, loading, authenticate };
  };
};

// Create specific hooks
export const useSignUp = createAuthHook<SignUpRequest, SignUpResponse>(
  "/auth/signup"
);
export const useSignIn = createAuthHook<SignInRequest, SignInResponse>(
  "/auth/signin"
);
