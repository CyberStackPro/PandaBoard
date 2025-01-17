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
import { Workspace } from "@/types/workspace";
import { ChevronRight, File, Folder, Plus } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface WorkspaceItemProps {
  workspace: Workspace;
  isCollapsed: boolean;
  level: number;
  onAddWorkspace?: (parentId: string | null, type: "folder" | "file") => void;
  onRename: (WorkspaceId: string, newName: string) => Promise<void>;
  onDelete: (WorkspaceId: string) => Promise<void>;
  onDuplicate: (WorkspaceId: string, withContent: boolean) => Promise<void>;
}

export const WorkspaceItem = ({
  workspace,
  isCollapsed,
  level,
  onAddWorkspace,
  onRename,
  onDelete,
  onDuplicate,
}: WorkspaceItemProps) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [tempName, setTempName] = useState(workspace.name || "");
  const isFolder = workspace.type === "folder";
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const updateActiveWorkspace = useStore(
    (state) => state.updateActiveWorkspace
  );
  const activeWorkspace = useStore((state) => state.activeWorkspace);

  const isSelected = activeWorkspace?.id === workspace.id; // Check if current Workspace is selected

  const handleSelectWorkspace = () => {
    updateActiveWorkspace?.(workspace); // Update the active Workspace state
  };

  const handleAction = useCallback(
    async (action: string, workspaceId: string, data?: string) => {
      try {
        switch (action) {
          case "rename":
            await onRename(workspaceId, data || "");
            break;
          case "delete":
            await onDelete(workspaceId);
            break;
          case "duplicate":
            await onDuplicate(workspaceId, true);
            break;
          case "duplicate-structure":
            await onDuplicate(workspaceId, false);
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
      workspace.icon ? (
        workspace.icon
      ) : isFolder ? (
        <Folder className="h-4 w-4" />
      ) : (
        <File className="h-4 w-4" />
      ),
    [workspace.icon, isFolder]
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

                  handleAction?.(subItem.action, workspace.id as string);
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
            handleAction?.(item.action, workspace.id as string);
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
      if (newName.trim() && newName !== workspace.name) {
        setIsLoading(true);
        await onRename(workspace.id as string, newName.trim());
        setIsLoading(false);
        // If this is the active Workspace, update the active Workspace state
        if (activeWorkspace?.id === workspace.id) {
          updateActiveWorkspace({ name: newName.trim() });
        }
      }
      setTempName(workspace.name || "");
      setIsRenaming(false);
    },
    [
      workspace.id,
      workspace.name,
      onRename,
      activeWorkspace,
      updateActiveWorkspace,
    ]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleRenameSubmit(tempName);
      } else if (e.key === "Escape") {
        setTempName(workspace.name || "");
        setIsRenaming(false);
      }
    },
    [handleRenameSubmit, tempName, workspace.name]
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
                href={`/dashboard/workspaces/${workspace.id}`}
                className={cn(
                  "flex text-muted-foreground transition-all duration-500 relative items-center gap-2 px-2 py-1 rounded-md",
                  {
                    "font-semibold text-primary/80": isSelected, // Bold and primary color for selected
                    "hover:bg-muted": !isSelected, // Regular hover effect for unselected
                  }
                )}
                onClick={(e) => {
                  if (isRenaming) e.preventDefault();
                  else handleSelectWorkspace(); // Update selection
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
                        {workspace.name}
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
                        const parentId = workspace.id || null;
                        onAddWorkspace?.(parentId, "folder");
                      }}
                    >
                      <Folder className="mr-2 h-4 w-4" />
                      New Folder
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        const parentId = workspace.id || null;
                        onAddWorkspace?.(parentId, "file");
                      }}
                    >
                      <File className="mr-2 h-4 w-4" />
                      New File
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
            {workspace.children && workspace.children.length > 0 ? (
              <CollapsibleContent>
                {isLoading ? (
                  <div className="mt-2 space-y-2">
                    {/* <div className="h-4 bg-muted-foreground/20 rounded-md animate-pulse"></div> */}
                    <div className="h-4 bg-muted-foreground/20 rounded-md animate-pulse"></div>
                  </div>
                ) : (
                  <SidebarMenuSub>
                    {workspace.children.map((child, index) => (
                      <WorkspaceItem
                        key={`child-${child.id}-${index}`}
                        workspace={child}
                        isCollapsed={isCollapsed}
                        level={level + 1}
                        onDelete={onDelete}
                        onDuplicate={onDuplicate}
                        onRename={onRename}
                        onAddWorkspace={onAddWorkspace}
                      />
                    ))}
                  </SidebarMenuSub>
                )}
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
          </SidebarMenuItem>
        </Collapsible>
      </ContextMenuTrigger>

      <ContextMenuContent className="w-64 ">
        {RIGHT_CLICK_MENU_ITEMS.map(renderContextMenuItem)}
      </ContextMenuContent>
    </ContextMenu>
  );
};
