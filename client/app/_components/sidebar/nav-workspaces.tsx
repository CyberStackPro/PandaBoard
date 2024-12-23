"use client";
import { Button } from "@/components/ui/button";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { useEffect, useMemo, useRef, useState } from "react";

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
  onAction?: (action: string, projectId: string, newName?: string) => void;
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
  const [isRenaming, setIsRenaming] = useState(false);
  const [tempName, setTempName] = useState(project.name || "");
  const isFolder = project.type === "folder";
  const inputRef = useRef<HTMLInputElement>(null);

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

  // const renderContextMenuItem = (item: (typeof RIGHT_CLICK_MENU_ITEMS)[0]) => (
  //   <ContextMenuItem
  //     key={item.name}
  //     onClick={(e) => {
  //       e.preventDefault();
  //       if (item.action === "rename") {
  //         setIsRenaming(true);
  //       } else {
  //         onAction!(item.action, project.id);
  //       }
  //     }}
  //   >
  //     {item.icon}
  //     <span className="ml-2">{item.name}</span>
  //     <ContextMenuShortcut>{item.shortcut}</ContextMenuShortcut>
  //   </ContextMenuItem>
  // );

  // const handleAddClick = (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   if (onAddProject) {
  //     // if (isFolder) {
  //     onAddProject(project.id, "file");
  //     // }
  //   }
  // };
  const handleSaveName = () => {
    if (tempName.trim() && tempName !== project.name) {
      onAction?.("rename", project.id, tempName.trim());
      setIsRenaming(false);
    } else if (!tempName.trim()) {
      alert("Project name cannot be empty.");
    } else {
      setIsRenaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveName();
    } else if (e.key === "Escape") {
      setTempName(project.name || "");
      setIsRenaming(false);
    }
  };
  const handleRename = (newName: string) => {
    if (newName.trim() && newName !== project.name) {
      onAction?.("rename", project.id, newName.trim());
    } else {
      setTempName(project.name || "");
    }
    setIsRenaming(false);
  };
  useEffect(() => {
    if (isRenaming) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isRenaming]);

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Collapsible>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href={`/dashboard/projects/${project.id}`}
                className="flex relative items-center gap-2"
                onClick={(e) => {
                  if (isRenaming) e.preventDefault();
                }}
              >
                <span className="flex-shrink-0">{isRenaming ? "" : icon}</span>
                {!isCollapsed && (
                  <span className="text-muted-foreground z-50 min-w-[12px]">
                    {isRenaming ? (
                      <div className="flex absolute top-0 z-50 scale-110  items-center gap-2 px-2 py-1 w-[50%]">
                        <span className="flex-shrink-0 text-muted-foreground">
                          {icon}
                        </span>
                        <div className="flex-1 min-w-[120px]">
                          <Input
                            ref={inputRef}
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            onKeyDown={(e) => {
                              e.stopPropagation();
                              if (e.key === "Enter") {
                                handleRename(tempName);
                              } else if (e.key === "Escape") {
                                setTempName(project.name || "");
                                setIsRenaming(false);
                              }
                            }}
                            onBlur={() => handleRename(tempName)}
                            className="h-6 px-1 py-0 w-full bg-transparent border-none focus:ring-1 focus:ring-ring focus:ring-offset-0"
                            onClick={(e) => e.preventDefault()}
                            autoFocus
                          />
                        </div>
                      </div>
                    ) : (
                      <span
                        className="px-1 py-0.5 rounded-sm hover:bg-accent/50 cursor-text"
                        onClick={() => setIsRenaming(true)}
                      >
                        {project.name}
                      </span>
                    )}
                  </span>
                )}
              </Link>
            </SidebarMenuButton>

            {!isCollapsed && isFolder && (
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
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddProject?.(project.id, "folder");
                      }}
                    >
                      <Folder className="mr-2 h-4 w-4" />
                      New Folder
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddProject?.(project.id, "file");
                      }}
                    >
                      <File className="mr-2 h-4 w-4" />
                      New File
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                      onAddProject={onAddProject}
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
                if (item.action === "rename") {
                  setIsRenaming(true);
                } else {
                  onAction!(item.action, project.id);
                }
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
  const updateProject = useStore((state) => state.updateProject);
  const handleAction = (
    action: string,
    projectId: string,
    newName?: string
  ) => {
    switch (action) {
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

function RenameDropdown({
  project,
  onRename,
}: {
  project: Project;
  onRename: (projectId: string, newName: string) => void;
}) {
  const [tempName, setTempName] = useState(project.name);
  const [open, setOpen] = useState(false);

  const handleRename = () => {
    if (tempName.trim()) {
      onRename(project.id, tempName.trim());
      setOpen(false); // Close the popup after renaming
    }
  };

  const handleCancel = () => {
    setTempName(project.name); // Reset the name
    setOpen(false); // Close the popup
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm">
          Rename
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64 p-4">
        <div className="flex flex-col gap-2">
          <Input
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleRename();
                e.preventDefault();
              } else if (e.key === "Escape") {
                handleCancel();
              }
            }}
            autoFocus
            placeholder="Enter new name"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="ghost" size="sm" onClick={handleRename}>
              Save
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
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
