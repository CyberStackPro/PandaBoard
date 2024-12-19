import { useState } from "react";
import { useToast } from "./use-toast";
import APIClient from "@/services/api-client";
import { APIError, SignUpRequest, SignUpResponse } from "@/types/api";

interface User {
  name: string;
  email: string;
  password: string;
}

const apiClient = new APIClient<SignUpRequest, SignUpResponse>("/auth/signin");

export const useSignUp = () => {
  const [data, setData] = useState<SignUpRequest>({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const signin = async (data: User) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.post(data);

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

  return { data, setData, error, loading, signin };
};
