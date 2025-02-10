"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "../_components/sidebar/app-sidebar";

import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { NavActions } from "../_components/sidebar/nav-actions";
import { useStore } from "@/stores/store";
import { Input } from "@/components/ui/input";
import { ProjectIcon } from "@/components/sidebar/project-icon";
import { useWorkspaceActions } from "@/hooks/workspace/use-workspace-actions";
import { useAuthStore } from "@/stores/auth/auth-store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <div className="relative !bg-[#111110] flex min-h-screen w-full">
          <AppSidebar />
          <div className="flex flex-1 !bg-[#111110] flex-col min-w-0">
            <Header />
            {/* <SidebarInset> */}
            <main className="relative flex-1  mx-auto w-full">{children}</main>
            {/* </SidebarInset> */}
          </div>
        </div>
      </SidebarProvider>
    </QueryClientProvider>
  );
};

export function Header() {
  const { user } = useAuthStore();
  const userId = user?.id || "";

  const { handleRename } = useWorkspaceActions(userId);
  const activeWorkspace = useStore((state) => state.activeWorkspace);
  const updateActiveWorkspace = useStore(
    (state) => state.updateActiveWorkspace
  );
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(activeWorkspace?.name || "");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(
    async (newName: string) => {
      if (
        activeWorkspace &&
        newName.trim() &&
        newName !== activeWorkspace.name
      ) {
        await handleRename(activeWorkspace.id, newName);

        // if (activeWorkspace.id === activeWorkspace?.id) {
        updateActiveWorkspace({ name: newName.trim() });
        // }
      }
      setIsEditing(false);
    },
    [activeWorkspace, handleRename, updateActiveWorkspace]
  );
  // const handleSubmit = async (newName: string) => {
  //   if (activeWorkspace && newName.trim() && newName !== activeWorkspace.name) {
  //     await handleRename(activeWorkspace.id, newName);

  //     // if (activeWorkspace.id === activeWorkspace?.id) {
  //     updateActiveWorkspace({ name: newName.trim() });
  //     // }
  //   }
  //   setIsEditing(false);
  // };
  const handleBlur = useCallback(() => {
    const newName = tempName.trim();
    if (newName && activeWorkspace?.id) {
      handleRename(activeWorkspace.id, newName);
      handleSubmit(tempName);

      updateActiveWorkspace({ name: newName });
    }
  }, [
    tempName,
    activeWorkspace,
    handleRename,
    updateActiveWorkspace,
    handleSubmit,
  ]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(tempName);
    } else if (e.key === "Escape") {
      setTempName(activeWorkspace?.name || "");
      setIsEditing(false);
    }
  };

  useEffect(() => {
    setTempName(activeWorkspace?.name || "");
  }, [activeWorkspace?.name]);
  return (
    <header className="sticky top-0 z-10 flex h-14 w-full items-center  shadow-sm bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-4 pt-3">
        {/* Breadcrumb Section */}
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                {activeWorkspace?.icon && (
                  <ProjectIcon icon={activeWorkspace.icon} />
                )}
                {isEditing ? (
                  <Input
                    ref={inputRef}
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    className="h-7 w-[200px]"
                    autoFocus
                  />
                ) : (
                  <BreadcrumbPage
                    className="line-clamp-1 cursor-pointer  hover:bg-muted p-1 rounded-md "
                    onClick={() => setIsEditing(true)}
                  >
                    <span className="truncate">
                      {activeWorkspace?.name || "Untitled"}
                    </span>
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      <div className="ml-auto px-4">
        <NavActions />
      </div>
    </header>
  );
}

export default DashboardLayout;

// const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
//   // const [isCollapsed, setIsCollapsed] = useState(false);
//   return (
//     <SidebarProvider>
//       <div className="overflow-y-hidden w-full overflow-hidden">
//         <ResizablePanelGroup direction="horizontal">
//           <ResizablePanel
//             defaultSize={0}
//             // minSize={15}
//             maxSize={30}
//             className="border-r"
//           >
//             <AppSidebar />
//           </ResizablePanel>
//           <ResizableHandle withHandle />
//           <ResizablePanel defaultSize={80}>
//             <div className="flex h-full flex-col">
//               <Header />
//               <main className="flex-1 overflow-auto p-6">{children}</main>
//             </div>
//           </ResizablePanel>
//         </ResizablePanelGroup>
//         <SidebarTrigger />
//       </div>
//     </SidebarProvider>
//   );
// };
