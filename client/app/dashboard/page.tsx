"use client";

import { useAuthStore } from "@/stores/auth/auth-store";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";

const DashboardPage = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  useEffect(() => {
    if (!isAuthenticated) {
      redirect("/dashboard");
    }
  }, [isAuthenticated]);
  return <h1>hello</h1>;
};

export default DashboardPage;
