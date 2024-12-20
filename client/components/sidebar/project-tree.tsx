// components/sidebar/project-tree.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Project } from "@/types/project";
import { cn } from "@/lib/utils";
import { ProjectIcon } from "./project-icon";

interface ProjectTreeProps {
  projects: Project[];
  level?: number;
}

export const ProjectTree = ({ projects, level = 0 }: ProjectTreeProps) => {
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleProjectClick = (project: Project) => {
    router.push(`/dashboard/project/${project.id}`);
  };

  const handleContextMenu = async (
    e: React.MouseEvent,
    project: Project,
    action: "rename" | "duplicate" | "delete"
  ) => {
    e.preventDefault();
    e.stopPropagation();

    switch (action) {
      case "rename":
        // Implement rename logic
        break;
      case "duplicate":
        // Implement duplicate logic
        break;
      case "delete":
        // Implement delete logic
        break;
    }
  };

  return (
    <div className="px-2">
      {projects.map((project) => (
        <div key={project.id} style={{ paddingLeft: level * 12 }}>
          <ContextMenu>
            <ContextMenuTrigger>
              <div
                className={cn(
                  "flex items-center gap-x-2 py-1 px-2 rounded-sm hover:bg-accent group",
                  "cursor-pointer"
                )}
                onClick={() => handleProjectClick(project)}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(project.id);
                  }}
                >
                  {project.children?.length > 0 &&
                    (expanded[project.id] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    ))}
                </Button>
                <ProjectIcon icon={project.icon} />
                <span className="truncate">{project.name}</span>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem
                onClick={(e) => handleContextMenu(e, project, "rename")}
              >
                Rename
              </ContextMenuItem>
              <ContextMenuItem
                onClick={(e) => handleContextMenu(e, project, "duplicate")}
              >
                Duplicate
              </ContextMenuItem>
              <ContextMenuItem
                onClick={(e) => handleContextMenu(e, project, "delete")}
                className="text-red-600"
              >
                Delete
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>

          {expanded[project.id] && project.children?.length > 0 && (
            <ProjectTree projects={project.children} level={level + 1} />
          )}
        </div>
      ))}
    </div>
  );
};
