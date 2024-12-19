"use client";

import { redirect } from "next/navigation";
import { ModeToggle } from "./_components/theme-toggler";

const page = () => {
  const isAuthenticated = false;
  return (
    <div className="flex justify-center items-center h-[100vh]">
      <ModeToggle />
      {isAuthenticated ? redirect("/dashboard") : redirect("/auth/signup")}
    </div>
  );
};

export default page;
