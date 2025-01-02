"use client";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { DATA } from "@/constants/side-bar-data";
import { NameDialog } from "../dialogs/add-project-dialog";
import { NavSecondary } from "./nav-secondary";
import { NavWorkspaces } from "./nav-workspaces";
import { TeamSwitcher } from "./team-switch";
// import { useProjects } from "@/hooks/use-projects";
import { NavFavorites } from "./nav-favorites";
import { useProjectDialog } from "@/hooks/project/use-project-dialog";
import { useProjectActions } from "@/hooks/project/use-project-actions";
import { useProjectSocket } from "@/hooks/project/use-project-socket";
import { useStore } from "@/stores/store";

export function AppSidebar({
  // className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const [data] = React.useState(DATA);
  const userId = "06321aa5-78d2-450c-9892-fd5277775fae";

  const {
    dialogOpen,
    setDialogOpen,
    dialogType,
    handleCreateProject,
    handleDialogSubmit,
  } = useProjectDialog(userId);

  const { handleRename, handleDelete, handleDuplicate } =
    useProjectActions(userId);
  useProjectSocket(userId);

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
          onAddProject={handleCreateProject}
          workspaces={workspaces}
          handleRename={handleRename}
          handleDelete={handleDelete}
          handleDuplicate={handleDuplicate}
        />
        <NavSecondary items={data.navSecondary} />
      </SidebarContent>
      <SidebarRail />
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
