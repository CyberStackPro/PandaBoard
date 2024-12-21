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

interface Project {
  id: string;
  name: string;
  icon?: string | null;
  children?: Project[];
}

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
  onAddProject?: () => void;
}
interface NavWorkspacesProps {
  projects: Project[];
  isCollapsed: boolean;
  // onAction: (action: string, projectId: string) => void;
  onAddProject: () => void;
}
const ProjectItem = ({
  project,
  isCollapsed,
  level,
  onAction,
  onAddProject,
}: ProjectItemProps) => {
  const isFolder = project.children && project.children.length > 0;
  const icon = useMemo(() => {
    if (project.icon) return project.icon;
    return isFolder ? (
      <Folder className="h-4 w-4" />
    ) : (
      <File className="h-4 w-4" />
    );
  }, [project.icon, isFolder]);
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Collapsible>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href={`/projects/${project.id}`}
                className="flex items-center gap-2"
              >
                <span className="flex-shrink-0">{icon}</span>
                {!isCollapsed && <span>{project.name}</span>}
              </Link>
            </SidebarMenuButton>

            {!isCollapsed && (
              <>
                {isFolder && (
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction
                      className="left-2 bg-sidebar-accent text-sidebar-accent-foreground data-[state=open]:rotate-90"
                      showOnHover
                    >
                      <ChevronRight className="h-4 w-4" />
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                )}

                {!isFolder ? (
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal className="h-4 w-4" />
                  </SidebarMenuAction>
                ) : (
                  <SidebarMenuAction showOnHover>
                    <Plus onClick={onAddProject} />
                  </SidebarMenuAction>
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
            onClick={() => onAction(item.action, project.id)}
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
}: {
  isCollapsed: boolean;
  projects: Project[];
  onAddProject: () => void;
}) {
  const addNewProject = useCallback(() => {
    onAddProject();
  }, [onAddProject]);

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
              onAddProject={addNewProject}
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
              <DropdownMenuItem onClick={addNewProject}>
                <Plus className="mr-2 h-4 w-4" />
                Add Member
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Teamspace Settings
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
