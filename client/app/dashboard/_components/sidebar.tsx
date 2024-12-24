// components/sidebar.tsx
"use client";

import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { ElementRef, useRef, useState } from "react";
// import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";

export const Sidebar = () => {
  const pathname = usePathname();
  //   const isMobile = useMediaQuery("(max-width: 768px)");
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);

  return (
    <aside
      ref={sidebarRef}
      className={cn(
        "group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]",
        isResetting && "transition-all ease-in-out duration-300"
        // isMobile && "w-0"
      )}
    >
      <div
        ref={navbarRef}
        className={cn(
          "h-[60px] w-full flex items-center justify-between px-4",
          isCollapsed && "justify-center"
        )}
      >
        {!isCollapsed && (
          <Button
            variant="ghost"
            className="p-2 hover:bg-neutral-300 dark:hover:bg-neutral-600"
          >
            <Search className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="mt-4">{/* Add your sidebar navigation items here */}</div>
    </aside>
  );
};
