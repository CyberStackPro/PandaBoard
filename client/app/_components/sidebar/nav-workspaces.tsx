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

interface Project {
  id: string;
  name: string;
  icon?: string | null;
  children?: Project[];
}

// Mock data
const mockProjects: Project[] = [
  {
    id: "1",
    name: "Project 1",
    children: [
      {
        id: "1-1",
        name: "Sub Project 1",
      },
    ],
  },
  {
    id: "2",
    name: "Project 2",
  },
];
const rightClickMenuItems = [
  {
    name: "Duplicate",
    icon: <Copy className="h-4 w-4" />,
    shortcut: "⌘D",
    separator: true,
  },
  {
    name: "Rename",
    icon: <Edit className="h-4 w-4" />,
    shortcut: "⌘R",
    separator: true,
  },
  {
    name: "Move to Trash",
    icon: <Trash className="h-4 w-4" />,
    shortcut: "⌘T",
  },
  {
    name: "Add to Favorites",
    icon: <Star className="h-4 w-4" />,
    shortcut: "⌘F",
  },
  { name: "Copy Link", icon: <Link2 className="h-4 w-4" />, shortcut: "⌘L" },
];

interface NavWorkspacesProps {
  isCollapsed: boolean;
}

export function NavWorkspaces({ isCollapsed }: NavWorkspacesProps) {
  const handleCreateProject = (parentId?: string) => {
    const projectName = prompt("Enter project name:");
    if (projectName) {
      const newProject: Project = {
        id: `${Date.now()}`,
        name: projectName,
        children: [],
      };

      if (parentId) {
        // Add as child to existing project
        const parent = findProject(mockProjects, parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(newProject);
        }
      } else {
        // Add as root project
        mockProjects.push(newProject);
      }
      // In a real app, you'd want to trigger a re-render and save to backend
    }
  };

  const handleDuplicateProject = (projectId: string) => {
    const project = findProject(mockProjects, projectId);
    if (project) {
      const duplicatedProject: Project = {
        ...project,
        id: `${Date.now()}`,
        name: `${project.name} (Copy)`,
      };
      mockProjects.push(duplicatedProject);
    }
  };

  const handleRenameProject = (projectId: string) => {
    const project = findProject(mockProjects, projectId);
    if (project) {
      const newName = prompt("Enter new name:", project.name);
      <Input id="name" value={project.name} />;
      if (newName) {
        project.name = newName;
      }
    }
  };

  const handleDeleteProject = (projectId: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this project?"
    );
    if (confirmDelete) {
      deleteProject(mockProjects, projectId);
    }
  };

  const renderProjectTree = (
    isCollapsed: boolean,
    project: Project,
    level: number = 0
  ) => {
    const isFolder = project.children && project.children.length > 0;

    return (
      <ContextMenu>
        <ContextMenuTrigger>
          <Collapsible key={project.id}>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  href={`/projects/${project.id}`}
                  className="flex items-center gap-2"
                >
                  <span className="flex-shrink-0">
                    {isFolder ? (
                      <Folder className="h-4 w-4" />
                    ) : (
                      <File className="h-4 w-4" />
                    )}
                  </span>
                  {!isCollapsed && <span>{project.name}</span>}
                </Link>
              </SidebarMenuButton>

              {!isCollapsed && (
                <div className="group flex-shrink-0">
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

                  {/* Dropdown for "..." menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontal className="h-4 w-4" />
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {rightClickMenuItems.map((item) => (
                        <DropdownMenuItem key={item.name}>
                          {item.icon}
                          {item.name}
                          <ContextMenuShortcut>
                            {item.shortcut}
                          </ContextMenuShortcut>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              {!isCollapsed && isFolder && (
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {project.children?.map((child) =>
                      renderProjectTree(isCollapsed, child, level + 1)
                    )}
                  </SidebarMenuSub>
                </CollapsibleContent>
              )}
            </SidebarMenuItem>
          </Collapsible>
        </ContextMenuTrigger>

        {/* Right-click context menu for projects */}
        <ContextMenuContent className="w-64">
          {rightClickMenuItems.map((item) => (
            <ContextMenuItem
              key={item.name}
              onSelect={() => console.log(item.name)}
            >
              {item.icon}
              {item.name}
            </ContextMenuItem>
          ))}
        </ContextMenuContent>
      </ContextMenu>
    );
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel className={cn(isCollapsed && "sr-only")}>
        Projects
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {mockProjects.map((project) => (
            <div key={project.id}>
              {renderProjectTree(isCollapsed, project)}
            </div>
          ))}

          {/* Dropdown menu for the plus icon */}
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
              <DropdownMenuItem onClick={() => console.log("Add Member")}>
                <Plus className="mr-2 h-4 w-4" />
                Add Member
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => console.log("Teamspace Settings")}
              >
                <Edit className="mr-2 h-4 w-4" />
                Teamspace Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  //   return (
  //     <SidebarGroup>
  //       <SidebarGroupLabel className={cn(isCollapsed && "sr-only")}>
  //         Projects
  //       </SidebarGroupLabel>
  //       <SidebarGroupContent>
  //         <SidebarMenu>
  //           {mockProjects.map((project) => (
  //             <div key={project.id}>
  //               {renderProjectTree(isCollapsed, project)}
  //             </div>
  //           ))}
  //           <SidebarMenuItem>
  //             <SidebarMenuButton
  //               onClick={() => handleCreateProject()}
  //               className={cn(
  //                 "text-sidebar-foreground/70",
  //                 isCollapsed && "justify-center"
  //               )}
  //             >
  //               <Plus className="h-4 w-4" />
  //               {!isCollapsed && <span>New Project</span>}
  //             </SidebarMenuButton>
  //           </SidebarMenuItem>
  //         </SidebarMenu>
  //       </SidebarGroupContent>
  //     </SidebarGroup>
  //   );
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
