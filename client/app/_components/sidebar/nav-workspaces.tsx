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
import { Project } from "@/types/workspace";
import { File, Folder, Plus } from "lucide-react";
import { ProjectItem } from "./project-item";

interface NavWorkspacesProps {
  isCollapsed: boolean;
  workspaces: Project[];
  onAddProject: (parentId: string | null, type: "folder" | "file") => void;
  handleRename: (projectId: string, newName: string) => Promise<void>;
  handleDelete: (projectId: string) => Promise<void>;
  handleDuplicate: (projectId: string, withContent: boolean) => Promise<void>;
}

export function NavWorkspaces({
  isCollapsed,
  workspaces,
  onAddProject,
  handleRename,
  handleDelete,
  handleDuplicate,
}: NavWorkspacesProps) {
  const topLevelProjects = workspaces.filter((project) => !project.parent_id);
  return (
    <SidebarGroup>
      <SidebarGroupLabel className={cn(isCollapsed && "sr-only")}>
        Projects
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {topLevelProjects.map((project) => (
            <ProjectItem
              key={`project-${project.id}`}
              project={project}
              isCollapsed={isCollapsed}
              level={0}
              onAddProject={onAddProject}
              onRename={handleRename}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
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
