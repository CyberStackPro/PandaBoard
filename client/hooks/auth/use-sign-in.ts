import { useState } from "react";
import { useToast } from "../use-toast";
import APIClient from "@/services/api-client";
import { SignInRequest, SignInResponse } from "@/types/auth";
import { APIError } from "@/types/api";
import { User } from "@/types/user";
import { useAuthStore } from "@/stores/auth/auth-store";
import { redirect } from "next/navigation";

const apiClient = new APIClient<SignInRequest, SignInResponse>("/auth/signin");

export const useSignIn = () => {
  const [data, setData] = useState<SignInRequest>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const { toast } = useToast();

  const signin = async (
    data: Pick<User & SignInRequest, "email" | "password">
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.post(data);

      setAuth(response.user, response.tokens.access_token);
      console.log("Users=======", response.user);
      console.log("Tokens=======", response.tokens.access_token);

      toast({
        title: "Success",
        description: "Operation successful",
        variant: "default",
        type: "foreground",
      });
      return response;
      redirect("/dashboard");
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
