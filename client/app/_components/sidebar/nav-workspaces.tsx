"use client";
import {
  ChevronRight,
  Copy,
  Edit,
  File,
  Folder,
  Link2,
  MoreHorizontal,
  Plus,
  Star,
  Trash,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useCallback, useMemo } from "react";
import { useStore } from "@/stores/store";
import { Project } from "@/types/project";

const RIGHT_CLICK_MENU_ITEMS = [
  {
    name: "Duplicate",
    icon: <Copy className="h-4 w-4" />,
    shortcut: "⌘D",
    action: "duplicate",
  },
  {
    name: "Rename",
    icon: <Edit className="h-4 w-4" />,
    shortcut: "⌘R",
    action: "rename",
  },
  {
    name: "Move to Trash",
    icon: <Trash className="h-4 w-4" />,
    shortcut: "⌘T",
    action: "delete",
  },
  {
    name: "Add to Favorites",
    icon: <Star className="h-4 w-4" />,
    shortcut: "⌘F",
    action: "favorite",
  },
  {
    name: "Copy Link",
    icon: <Link2 className="h-4 w-4" />,
    shortcut: "⌘L",
    action: "copyLink",
  },
];

interface ProjectItemProps {
  project: Project;
  isCollapsed: boolean;
  level: number;
  onAction?: (action: string, projectId: string) => void;
  onAddProject?: (parentId: string | null, type: "folder" | "file") => void;
}
interface NavWorkspacesProps {
  isCollapsed: boolean;
  projects: Project[];
  onAddProject: (parentId: string | null, type: "folder" | "file") => void;
}
const ProjectItem = ({
  project,
  isCollapsed,
  level,
  onAction,
  onAddProject,
}: ProjectItemProps) => {
  // const isFolder = project.children && project.children.length > 0;
  const isFolder = project.type === "folder";

  const icon = useMemo(
    () =>
      project.icon ? (
        project.icon
      ) : isFolder ? (
        <Folder className="h-4 w-4" />
      ) : (
        <File className="h-4 w-4" />
      ),
    [project.icon, isFolder]
  );

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddProject) {
      if (isFolder) {
        onAddProject(project.id, "file");
      }
    }
  };
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Collapsible>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href={`/dashboard/projects/${project.id}`}
                className="flex items-center gap-2"
              >
                <span className="flex-shrink-0">{icon}</span>
                {!isCollapsed && <span>{project.name}</span>}
              </Link>
            </SidebarMenuButton>

            {!isCollapsed && (
              <>
                {isFolder && (
                  <>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction
                        className="left-2 bg-sidebar-accent text-sidebar-accent-foreground data-[state=open]:rotate-90"
                        showOnHover
                      >
                        <ChevronRight className="h-4 w-4" />
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction showOnHover>
                          <Plus className="h-4 w-4" />
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => onAddProject?.(project.id, "folder")}
                        >
                          <Folder className="mr-2 h-4 w-4" />
                          New Folder
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onAddProject?.(project.id, "file")}
                        >
                          <File className="mr-2 h-4 w-4" />
                          New File
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
              </>
            )}

            {!isCollapsed && isFolder && (
              <CollapsibleContent>
                <SidebarMenuSub>
                  {project.children?.map((child) => (
                    <ProjectItem
                      key={child.id}
                      project={child}
                      isCollapsed={isCollapsed}
                      level={level + 1}
                      onAction={onAction}
                    />
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            )}
          </SidebarMenuItem>
        </Collapsible>
      </ContextMenuTrigger>

      <ContextMenuContent className="w-64 backdrop-blur-sm !bg-background/50">
        {RIGHT_CLICK_MENU_ITEMS.map((item) => (
          <ContextMenuItem
            key={item.name}
            // onClick={() => onAction(item.action, project.id)}
          >
            {item.icon}
            <span className="ml-2">{item.name}</span>
            <ContextMenuShortcut>{item.shortcut}</ContextMenuShortcut>
          </ContextMenuItem>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  );
};
export function NavWorkspaces({
  isCollapsed,
  projects,
  onAddProject,
}: NavWorkspacesProps) {
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
              // onAction={handleAction}
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
function findProject(projects: Project[], id: string): Project | null {
  for (const project of projects) {
    if (project.id === id) return project;
    if (project.children) {
      const found = findProject(project.children, id);
      if (found) return found;
    }
  }
  return null;
}

function deleteProject(projects: Project[], id: string): boolean {
  for (let i = 0; i < projects.length; i++) {
    if (projects[i].id === id) {
      projects.splice(i, 1);
      return true;
    }
    if (projects[i].children) {
      if (deleteProject(projects[i].children!, id)) return true;
    }
  }
  return false;
}
