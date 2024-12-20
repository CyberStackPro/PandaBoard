import { ChevronRight, MoreHorizontal, Plus } from "lucide-react";
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
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface NavWorkspacesProps {
  workspaces: {
    name: string;
    icon: React.ReactNode;
    pages: {
      name: string;
      icon: React.ReactNode;
    }[];
  }[];
  isCollapsed?: boolean;
}

export function NavWorkspaces({ workspaces, isCollapsed }: NavWorkspacesProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className={cn(isCollapsed && "sr-only")}>
        Workspaces
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {workspaces.map((workspace) => (
            <Collapsible key={workspace.name}>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="#" className="flex items-center gap-2">
                    <span className="flex-shrink-0">{workspace.icon}</span>
                    {!isCollapsed && <span>{workspace.name}</span>}
                  </Link>
                </SidebarMenuButton>
                {!isCollapsed && (
                  <div className="group flex-shrink-0">
                    <CollapsibleTrigger asChild>
                      <SidebarMenuAction
                        className="left-2 bg-sidebar-accent  text-sidebar-accent-foreground 
                          data-[state=open]:rotate-90"
                        showOnHover
                      >
                        <ChevronRight className="h-4 w-4" />
                      </SidebarMenuAction>
                    </CollapsibleTrigger>
                    <SidebarMenuAction showOnHover>
                      <Plus className="h-4 w-4" />
                    </SidebarMenuAction>
                  </div>
                )}
                {!isCollapsed && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {workspace.pages.map((page) => (
                        <SidebarMenuSubItem key={page.name}>
                          <SidebarMenuSubButton asChild>
                            <Link href="#" className="flex items-center gap-2">
                              <span className="flex-shrink-0">{page.icon}</span>
                              <span>{page.name}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          ))}
          {/* <SidebarMenuItem>
            <SidebarMenuButton
              className={cn(
                "text-sidebar-foreground/70",
                isCollapsed && "justify-center"
              )}
            >
              <MoreHorizontal className="h-4 w-4" />
              {!isCollapsed && <span>More</span>}
            </SidebarMenuButton>
          </SidebarMenuItem> */}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
