"use client";
// import { useEffect } from "react";
import { ModeToggle } from "./_components/theme-toggler";
import Link from "next/link";
// import { redirect } from "next/navigation";
// import { useAuthStore } from "@/stores/auth/auth-store";

const page = () => {
  // const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     redirect("/dashboard");
  //   }
  // }, [isAuthenticated]);

  return (
    <div className="flex justify-center items-center h-[100vh]">
      <nav>
        <ModeToggle />
        <ul>
          <li>
            <Link href="/auth/signin">Sign In</Link>
          </li>
          <li>
            <Link href="/auth/signup">Sign Up</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default page;
