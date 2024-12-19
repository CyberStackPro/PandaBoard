import Image from "next/image";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* left side */}
      <div className="hidden lg:flex w-full bg-muted">
        <div className="relative w-full">
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/40" />
          <Image
            src="/image/sign-up-bg.png"
            alt="image"
            width={500}
            height={500}
            className="absolute inset-0   object-cover"
          />
          <div className="absolute  inset-0 flex items-center justify-center">
            <div className="space-y-6 text-center p-8">
              <h1 className="text-4xl font-bold">Welcome to NotionClone</h1>
              <p className="text-lg text-muted-foreground">
                All your notes, organized and accessible.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* right side */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-8">
        <div className="w-full max-w-md space-y-8">{children}</div>
      </div>
    </div>
  );
}
