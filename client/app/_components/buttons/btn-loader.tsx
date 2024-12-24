// Dependencies: pnpm install lucide-react

import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";

interface ButtonLoaderProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isLoading?: boolean;
}

export default function ButtonLoader({
  children,
  isLoading,
}: ButtonLoaderProps) {
  return (
    <Button disabled={isLoading}>
      {isLoading && (
        <LoaderCircle
          className="-ms-1 me-2 animate-spin"
          size={16}
          strokeWidth={2}
          aria-hidden="true"
        />
      )}
      {children}
    </Button>
  );
}
