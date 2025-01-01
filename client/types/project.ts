export type ProjectStatus = "active" | "archived" | "deleted" | "template";
export type ProjectVisibility = "private" | "team" | "public";

export interface Project {
  id: string;
  name: string;
  owner_id: string;
  parent_id: string | null;
  description?: string | null;
  status?: ProjectStatus;
  type: "folder" | "file";
  visibility?: ProjectVisibility;
  metadata?: Record<string, unknown>;
  icon?: string | null;
  cover_image?: string | null;
  children?: Project[];
  documents?: unknown;
  // created_at: string;
  // updated_at: string;
}

export interface WorkspaceContextProps {
  projects: Project[];
  selectedProject?: Project;
  onCreateProject: (parentId?: string) => void;
  onDeleteProject: (projectId: string) => void;
  onDuplicateProject: (projectId: string) => void;
  onRenameProject: (projectId: string, newName: string) => void;
}
