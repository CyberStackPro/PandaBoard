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
import { useProjects } from "@/hooks/use-projects";
import { NavFavorites } from "./nav-favorites";

export function AppSidebar({
  // className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const [data] = React.useState(DATA);
  // const workspaces = useStore((state) => state.workspaces);
  // const addProject = useStore((state) => state.addProject);
  // const [dialogOpen, setDialogOpen] = React.useState(false);
  // const [dialogType, setDialogType] = React.useState<"folder" | "file">(
  //   "folder"
  // );
  const {
    workspaces,
    dialogOpen,
    dialogType,
    setDialogOpen,
    handleCreateProject,
    handleDialogSubmit,
  } = useProjects();
  console.log(workspaces);

  // const handleAddProject = async (
  //   parentId: string | null,
  //   type: "folder" | "file"
  // ) => {
  //   setDialogType(type);
  //   setParentId(parentId);
  //   setDialogOpen(true);
  // };

  // const handleDialogSubmit = async (name: string) => {
  //   await addProject({
  //     name,
  //     parent_id: parentId,
  //     type: dialogType,
  //   });
  // };

  return (
    // <div className="relative  group-data-[variant=floating]:border-0">
    // {/* <div className="absolute inset-y-0 right-0 w-3 bg-white filter blur-md opacity-100"></div> */}
    <Sidebar
      className="border-r-0 backdrop-blur-sm bg-background/50"
      collapsible="icon"
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
          workspaces={workspaces || []}
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

// export function AppSidebar({
//   className,
//   ...props
// }: React.HTMLAttributes<HTMLDivElement>) {
//   const { state } = useSidebar();
//   return (
//     <div
//       className={cn(
//         "flex h-full flex-col bg-sidebar-accent overflow-hidden",
//         className
//       )}
//       {...props}
//     >
//       <Sidebar className="border-r-0" collapsible="icon" {...props}>

//       </Sidebar>
//       <div className="flex-shrink-0 transition-all p-4">
//         <TeamSwitcher teams={data.teams} />
//       </div>
//       <div className="flex-1  overflow-auto">
//         {/* <NavMain items={data.navMain} />
//         <NavFavorites favorites={data.favorites} /> */}
//         <NavWorkspaces workspaces={data.workspaces} />
//       </div>
//       <div className="flex-shrink-0 p-4">
//         <NavSecondary items={data.navSecondary} />
//       </div>
//     </div>
//   );
// }
