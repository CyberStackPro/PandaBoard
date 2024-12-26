"use client";

import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";

const DashboardPage = () => {
  const router = useRouter();
  const isAuthenticated = true; // Replace with your auth check

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      redirect("/auth/signin");
    }
  }, [isAuthenticated, router]);
  return <h1>hello</h1>;
};

export default DashboardPage;
