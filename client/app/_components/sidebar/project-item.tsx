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
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { RIGHT_CLICK_MENU_ITEMS } from "@/lib/utils/nav-workspaces";
import { useStore } from "@/stores/store";
import { Project } from "@/types/project";
import { ChevronRight, File, Folder, Plus } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface ProjectItemProps {
  project: Project;
  isCollapsed: boolean;
  level: number;
  onAddProject?: (parentId: string | null, type: "folder" | "file") => void;
  onRename: (projectId: string, newName: string) => Promise<void>;
  onDelete: (projectId: string) => Promise<void>;
  onDuplicate: (projectId: string, withContent: boolean) => Promise<void>;
}

export const ProjectItem = ({
  project,
  isCollapsed,
  level,
  onAddProject,
  onRename,
  onDelete,
  onDuplicate,
}: ProjectItemProps) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [tempName, setTempName] = useState(project.name || "");
  const isFolder = project.type === "folder";
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const updateActiveProject = useStore((state) => state.updateActiveProject);
  const activeProject = useStore((state) => state.activeProject);

  const isSelected = activeProject?.id === project.id; // Check if current project is selected

  const handleSelectProject = () => {
    updateActiveProject?.(project); // Update the active project state
  };

  const handleAction = useCallback(
    async (action: string, projectId: string, data?: string) => {
      try {
        switch (action) {
          case "rename":
            await onRename(projectId, data || "");
            break;
          case "delete":
            await onDelete(projectId);
            break;
          case "duplicate":
            await onDuplicate(projectId, true);
            break;
          case "duplicate-structure":
            await onDuplicate(projectId, false);
            break;
        }
      } catch (error) {
        console.error(`Failed to perform action ${action}:`, error);
      }
    },
    [onRename, onDelete, onDuplicate]
  );
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

  const renderContextMenuItem = (item: (typeof RIGHT_CLICK_MENU_ITEMS)[0]) => {
    if (item.subItems && item.subItems.length > 0) {
      return (
        <ContextMenuSub key={item.name}>
          <ContextMenuSubTrigger>
            {item.icon}
            <span className="ml-2">{item.name}</span>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            {item.subItems.map((subItem) => (
              <ContextMenuItem
                key={subItem.name}
                onClick={() => {
                  console.log(subItem.action);

                  handleAction?.(subItem.action, project.id as string);
                }}
              >
                {subItem.name}
              </ContextMenuItem>
            ))}
          </ContextMenuSubContent>
        </ContextMenuSub>
      );
    }

    return (
      <ContextMenuItem
        key={item.name}
        onClick={() => {
          if (item.action === "rename") {
            setIsRenaming(true);
          } else {
            handleAction?.(item.action, project.id as string);
          }
        }}
      >
        {item.icon}
        <span className="ml-2">{item.name}</span>
        {item.shortcut && (
          <ContextMenuShortcut>{item.shortcut}</ContextMenuShortcut>
        )}
      </ContextMenuItem>
    );
  };

  const handleRenameSubmit = useCallback(
    async (newName: string) => {
      if (newName.trim() && newName !== project.name) {
        setIsLoading(true);
        await onRename(project.id as string, newName.trim());
        setIsLoading(false);
        // If this is the active project, update the active project state
        if (activeProject?.id === project.id) {
          updateActiveProject({ name: newName.trim() });
        }
      }
      setTempName(project.name || "");
      setIsRenaming(false);
    },
    [project.id, project.name, onRename, activeProject, updateActiveProject]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleRenameSubmit(tempName);
      } else if (e.key === "Escape") {
        setTempName(project.name || "");
        setIsRenaming(false);
      }
    },
    [handleRenameSubmit, tempName, project.name]
  );
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
                className={cn(
                  "flex text-muted-foreground transition-all duration-500 relative items-center gap-2 px-2 py-1 rounded-md",
                  {
                    "font-semibold text-primary/80": isSelected, // Bold and primary color for selected
                    "hover:bg-muted": !isSelected, // Regular hover effect for unselected
                  }
                )}
                onClick={(e) => {
                  if (isRenaming) e.preventDefault();
                  else handleSelectProject(); // Update selection
                }}
              >
                <span className="flex-shrink-0">{isRenaming ? "" : icon}</span>
                {!isCollapsed && (
                  <span className=" truncate z-50 min-w-[12px]">
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
                            onKeyDown={handleKeyDown}
                            onBlur={() => handleRenameSubmit(tempName)}
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
                        const parentId = project.id || null;
                        onAddProject?.(parentId, "folder");
                      }}
                    >
                      <Folder className="mr-2 h-4 w-4" />
                      New Folder
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        const parentId = project.id || null;
                        onAddProject?.(parentId, "file");
                      }}
                    >
                      <File className="mr-2 h-4 w-4" />
                      New File
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
            {project.children && project.children.length > 0 ? (
              <CollapsibleContent>
                <SidebarMenuSub>
                  {project.children.map((child, index) => (
                    <ProjectItem
                      key={`child-${child.id}-${index}`}
                      project={child}
                      isCollapsed={isCollapsed}
                      level={level + 1}
                      onDelete={onDelete}
                      onDuplicate={onDuplicate}
                      onRename={onRename}
                      onAddProject={onAddProject}
                    />
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            ) : (
              <CollapsibleContent>
                <div
                  className="text-muted-foreground text-sm mt-1 ml-6"
                  style={{ paddingLeft: "1.5rem" }}
                >
                  No pages inside
                </div>
              </CollapsibleContent>
            )}

            {isLoading && (
              <div className="mt-2 space-y-2">
                <div className="h-4 bg-muted-foreground/20 rounded-md animate-pulse"></div>
                <div className="h-4 bg-muted-foreground/20 rounded-md animate-pulse"></div>
              </div>
            )}
          </SidebarMenuItem>
        </Collapsible>
      </ContextMenuTrigger>

      <ContextMenuContent className="w-64 ">
        {RIGHT_CLICK_MENU_ITEMS.map(renderContextMenuItem)}
      </ContextMenuContent>
    </ContextMenu>
  );
};
