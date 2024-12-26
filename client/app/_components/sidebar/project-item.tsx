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
import { RIGHT_CLICK_MENU_ITEMS } from "@/lib/utils/nav-workspaces";
import { Project } from "@/types/project";
import { ChevronRight, File, Folder, Plus } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface ProjectItemProps {
  project: Project;
  isCollapsed: boolean;
  level: number;
  onAction?: (action: string, projectId: string, newName?: string) => void;
  onAddProject?: (parentId: string | null, type: "folder" | "file") => void;
}

export const ProjectItem = ({
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

                  onAction?.(subItem.action, project.id as string);
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
            onAction?.(item.action, project.id as string);
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
  const handleRename = useCallback(
    (newName: string) => {
      if (newName.trim() && newName !== project.name) {
        onAction?.("rename", project.id as string, newName.trim());
      }
      setTempName(project.name || "");
      setIsRenaming(false);
    },
    [onAction, project.id, project.name]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleRename(tempName);
      } else if (e.key === "Escape") {
        setTempName(project.name || "");
        setIsRenaming(false);
      }
    },
    [handleRename, tempName, project.name]
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
                            onKeyDown={handleKeyDown}
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

            {!isCollapsed &&
              isFolder &&
              project.children &&
              project.children.length > 0 && (
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {project.children.map((child, index) => (
                      <ProjectItem
                        key={`child-${child.id}-${index}`}
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

      <ContextMenuContent className="w-64 ">
        {RIGHT_CLICK_MENU_ITEMS.map(renderContextMenuItem)}
      </ContextMenuContent>
    </ContextMenu>
  );
};
