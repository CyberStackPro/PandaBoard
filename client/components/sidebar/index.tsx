"use client";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ProjectTree } from "./project-tree";
import { ResizeHandle } from "./resize-handle";
import { useProjects } from "@/hooks/use-projects";

const MIN_WIDTH = 240;
const MAX_WIDTH = 480;
export const Sidebar = () => {
  const pathname = usePathname();
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(MIN_WIDTH);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { projects } = useProjects();

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isResizing) return;
      let newWidth = event.clientX;
      if (newWidth < MIN_WIDTH) newWidth = MIN_WIDTH;
      if (newWidth > MAX_WIDTH) newWidth = MAX_WIDTH;
      if (sidebarRef.current) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = "default";
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);
  return (
    <aside
      ref={sidebarRef}
      style={{ width: sidebarWidth }}
      className={cn(
        "group/sidebar relative flex h-full flex-col overflow-y-auto bg-secondary",
        isResizing && "select-none"
      )}
    >
      {/* <UserNav /> */}
      <ProjectTree projects={projects} />
      <ResizeHandle
        isResizing={isResizing}
        onResizeStart={() => {
          setIsResizing(true);
          document.body.style.cursor = "ew-resize";
        }}
      />
    </aside>
  );
};
