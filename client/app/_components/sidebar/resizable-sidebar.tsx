"use client";
import * as React from "react";
import { Project } from "@/types/workspace";
import {
  ChevronDown,
  ChevronRight,
  File,
  Folder,
  Edit,
  Trash,
  Copy,
} from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Input } from "@/components/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { cn } from "@/lib/utils";
import { useProjects } from "@/hooks/use-projects";

interface ProjectItemProps {
  project: Project;
  level: number;
  onRename: (id: string, newName: string) => void;
}

const ProjectItem = ({ project, level, onRename }: ProjectItemProps) => {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [isEditing, setIsEditing] = React.useState(false);
  const [newName, setNewName] = React.useState(project.name);
  const { deleteProject } = useProjects();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onRename(project.id, newName);
      setIsEditing(false);
    }
    if (e.key === "Escape") {
      setIsEditing(false);
      setNewName(project.name);
    }
  };

  return (
    <div className="w-full">
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className={cn(
              "flex items-center px-2 py-1 hover:bg-accent hover:text-accent-foreground",
              "text-sm cursor-pointer rounded-sm",
              "transition-colors duration-200"
            )}
            style={{ paddingLeft: `${level * 12}px` }}
            // onClick={() => setActiveProject(project.id)}
          >
            <div className="flex items-center flex-1">
              {project.children?.length ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                  }}
                  className="w-4 h-4 mr-1 hover:bg-accent rounded"
                >
                  {isExpanded ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </button>
              ) : (
                <span className="w-4 h-4 mr-1" />
              )}

              {project.icon ? (
                <span className="mr-2">{project.icon}</span>
              ) : (
                <span className="mr-2">
                  {project.children?.length ? (
                    <Folder size={14} />
                  ) : (
                    <File size={14} />
                  )}
                </span>
              )}

              {isEditing ? (
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  className="h-6 px-1"
                />
              ) : (
                <span>{project.name}</span>
              )}
            </div>
          </div>
        </ContextMenuTrigger>

        <ContextMenuContent>
          <ContextMenuItem onClick={() => setIsEditing(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Rename
          </ContextMenuItem>
          <ContextMenuItem>
            <Copy className="w-4 h-4 mr-2" />
            Duplicate
          </ContextMenuItem>
          <ContextMenuItem
            className="text-destructive"
            onClick={() => deleteProject(project.id)}
          >
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {isExpanded && project.children && (
        <div className="ml-2">
          {project.children.map((child) => (
            <ProjectItem
              key={child.id}
              project={child}
              level={level + 1}
              onRename={onRename}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export function ResizableSidebar() {
  const { projects, updateProject } = useProjects();

  const handleRename = (id: string, newName: string) => {
    updateProject(id, { name: newName });
  };

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel
        defaultSize={20}
        minSize={15}
        maxSize={40}
        className="min-w-[200px] border-r"
      >
        <div className="h-full p-2 overflow-y-auto">
          {projects.map((project) => (
            <ProjectItem
              key={project.id}
              project={project}
              level={0}
              onRename={handleRename}
            />
          ))}
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
    </ResizablePanelGroup>
  );
}
