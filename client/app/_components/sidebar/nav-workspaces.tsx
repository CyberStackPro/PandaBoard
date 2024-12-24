import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

import { useStore } from "@/stores/store";
import { Project } from "@/types/project";
import { File, Folder, Plus } from "lucide-react";
import { ProjectItem } from "./project-item";

interface NavWorkspacesProps {
  isCollapsed: boolean;
  projects: Project[];
  onAddProject: (parentId: string | null, type: "folder" | "file") => void;
}

export function NavWorkspaces({
  isCollapsed,
  projects,
  onAddProject,
}: NavWorkspacesProps) {
  const deleteProject = useStore((state) => state.deleteProject);
  const updateProject = useStore((state) => state.updateProject);
  const handleAction = (
    action: string,
    projectId: string,
    newName?: string
  ) => {
    switch (action) {
      case "duplicate":
      case "rename":
        if (newName) {
          updateProject(projectId, { name: newName });
        }

        break;
      case "delete":
        deleteProject(projectId);

        break;
      // ... other cases
    }
  };
  return (
    <SidebarGroup>
      <SidebarGroupLabel className={cn(isCollapsed && "sr-only")}>
        Projects
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {projects.map((project) => (
            <ProjectItem
              key={project.id}
              project={project}
              isCollapsed={isCollapsed}
              level={0}
              onAddProject={onAddProject}
              onAction={handleAction}
            />
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuItem>
                <SidebarMenuButton
                  className={cn(
                    "text-sidebar-foreground/70",
                    isCollapsed && "justify-center"
                  )}
                >
                  <Plus className="h-4 w-4" />
                  {!isCollapsed && <span>New</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onAddProject(null, "folder")}>
                <Folder className="mr-2 h-4 w-4" />
                New Folder
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAddProject(null, "file")}>
                <File className="mr-2 h-4 w-4" />
                New File
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

// Helper functions
// function findProject(projects: Project[], id: string): Project | null {
//   for (const project of projects) {
//     if (project.id === id) return project;
//     if (project.children) {
//       const found = findProject(project.children, id);
//       if (found) return found;
//     }
//   }
//   return null;
// }

// function deleteProject(projects: Project[], id: string): boolean {
//   for (let i = 0; i < projects.length; i++) {
//     if (projects[i].id === id) {
//       projects.splice(i, 1);
//       return true;
//     }
//     if (projects[i].children) {
//       if (deleteProject(projects[i].children!, id)) return true;
//     }
//   }
//   return false;
// }
