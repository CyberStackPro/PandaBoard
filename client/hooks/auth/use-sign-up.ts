import { useState } from "react";
import { useToast } from "../use-toast";
import APIClient from "@/services/api-client";
import { SignUpRequest, SignUpResponse } from "@/types/auth";
import { APIError } from "@/types/api";
import { useAuthStore } from "@/stores/auth/auth-store";

interface User {
  name: string;
  email: string;
  password: string;
}

const apiClient = new APIClient<SignUpRequest, SignUpResponse>("/auth/signup");

export const useSignUp = () => {
  const [data, setData] = useState<SignUpRequest>({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const { toast } = useToast();

  const signup = async (data: User) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.post(data);

      setAuth(
        response.user,
        response.tokens.access_token,
        response.tokens.refresh_token
      );

      console.log(response);

      toast({
        title: "Success",
        description: "Account created successfully",
        variant: "default",
      });
      return response;
    } catch (err: unknown) {
      const error = err as { response: { data: APIError } };
      const errorMessage = error.response?.data?.message || "An error occurred";
      setLoading(false);
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

  return { data, setData, error, loading, signup };
};
