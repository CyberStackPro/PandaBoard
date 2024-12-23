"use client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { cn } from "@/lib/utils";
import { useStore } from "@/stores/store";
import { Project } from "@/types/project";
import {
  ChevronRight,
  Copy,
  Edit,
  File,
  Folder,
  Link2,
  Pencil,
  Plus,
  Star,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

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
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(project.name || "");
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
      // if (isFolder) {
      onAddProject(project.id, "file");
      // }
    }
  };
  const handleSaveName = () => {
    if (tempName.trim()) {
      onAction?.("rename", project.id);
      setIsEditing(false);
    } else {
      alert("Project name cannot be empty.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveName();
    } else if (e.key === "Escape") {
      setTempName(project.name || "");
      setIsEditing(false);
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
                {!isCollapsed && (
                  <span className="text-muted-foreground">
                    {isEditing ? (
                      <RenameDropdown
                        project={project}
                        onRename={(projectId, newName) => {
                          onAction?.("rename", projectId);
                          setIsEditing(false);
                        }}
                      />
                    ) : (
                      <>{project.name}</>
                    )}
                  </span>
                )}
              </Link>
            </SidebarMenuButton>

            {!isCollapsed && (
              <>
                {isFolder && (
                  <>
                    <CollapsibleTrigger asChild>
                      <div className="">
                        <SidebarMenuAction
                          className="left-2 bg-sidebar-accent text-sidebar-accent-foreground data-[state=open]:rotate-90"
                          showOnHover
                        >
                          <ChevronRight className="h-4 w-4" />
                          {/* <SidebarGroupContent>
                            {project.children.length === 0 ? (
                              <p>there is no project</p>
                            ) : null}
                          </SidebarGroupContent> */}
                        </SidebarMenuAction>
                      </div>
                    </CollapsibleTrigger>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction showOnHover>
                          <Plus
                            onClick={() => onAddProject?.(project.id!, "file")}
                            className="h-4 w-4"
                          />
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
            onClick={() => {
              onAction!(item.action, project.id);
            }}
          >
            {item.icon}
            <span
              className="ml-2"
              onClick={() => {
                if (item.action === "rename") setIsEditing(true);
              }}
            >
              {item.name}
            </span>
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
  const deleteProject = useStore((state) => state.deleteProject);
  const handleAction = (action: string, projectId: string) => {
    switch (action) {
      case "rename":
        // projectActions.handleRename(projectId);
        console.log(action, projectId);

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

function RenameDropdown({
  project,
  onRename,
}: {
  project: Project;
  onRename: (projectId: string, newName: string) => void;
}) {
  const [tempName, setTempName] = useState(project.name);

  const handleRename = () => {
    if (tempName.trim() && tempName !== project.name) {
      onRename(project.id, tempName.trim());
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="p-2 hover:bg-muted cursor-pointer">{project.name}</div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2 w-64">
        <div className="flex justify-between">
          <span className="text-muted-foreground size-10">{project.icon}</span>

          <Input
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleRename();
                e.preventDefault();
              }
            }}
            autoFocus
            className="w-full"
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
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
