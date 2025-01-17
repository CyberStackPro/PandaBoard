"use client";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  // SidebarRail,s
} from "@/components/ui/sidebar";
import { DATA } from "@/constants/side-bar-data";
import { NameDialog } from "../dialogs/add-project-dialog";
import { NavSecondary } from "./nav-secondary";
import { NavWorkspaces } from "./nav-workspaces";
import { TeamSwitcher } from "./team-switch";
// import { useProjects } from "@/hooks/use-projects";
import { NavFavorites } from "./nav-favorites";
import { useWorkspaceDialog } from "@/hooks/workspace/use-workspace-dialog";
import { useWorkspaceActions } from "@/hooks/workspace/use-workspace-actions";
import { useWorkspaceSocket } from "@/hooks/workspace/use-workspace-socket";
import { useStore } from "@/stores/store";
import { useAuthStore } from "@/stores/auth/auth-store";

export function AppSidebar({
  // className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const [data] = React.useState(DATA);
  // const user.id || '' = "3a4ca7ae-cc8c-4ce7-8a7a-8daeb6929334";
  const { user } = useAuthStore();
  const userId = user?.id;

  const {
    dialogOpen,
    setDialogOpen,
    dialogType,
    handleCreateWorkspace,
    handleDialogSubmit,
  } = useWorkspaceDialog(userId || "");

  const { handleRename, handleDelete, handleDuplicate } = useWorkspaceActions(
    userId || ""
  );
  useWorkspaceSocket(userId || "");

  const workspaces = useStore((state) => state.workspaces);

  return (
    // <div className="relative  group-data-[variant=floating]:border-0">
    // {/* <div className="absolute inset-y-0 right-0 w-3 bg-white filter blur-md opacity-100"></div> */}
    <Sidebar
      className="border-r-0 backdrop-blur-sm bg-background/50"
      collapsible="offcanvas"
      {...props}
    >
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavFavorites favorites={data.favorites} />
        <NavWorkspaces
          isCollapsed={false}
          onAddProject={handleCreateWorkspace}
          workspaces={workspaces}
          handleRename={handleRename}
          handleDelete={handleDelete}
          handleDuplicate={handleDuplicate}
        />
        <NavSecondary items={data.navSecondary} />
      </SidebarContent>
      {/* <SidebarRail /> */}
      <NameDialog
        type={dialogType}
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleDialogSubmit}
      />
    </Sidebar>
    // </div>
  );
}
