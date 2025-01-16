export type WorkspaceStatus = "active" | "archived" | "deleted" | "template";
export type WorkspaceVisibility = "private" | "team" | "public";

export interface Workspace {
  id: string;
  name: string;
  owner_id: string;
  parent_id: string | null;
  description?: string | null;
  status?: WorkspaceStatus;
  type: "folder" | "file";
  visibility?: WorkspaceVisibility;
  metadata?: Record<string, unknown>;
  icon?: string | null;
  cover_image?: string | null;
  children?: Workspace[];
  documents?: unknown;
  // created_at: string;
  // updated_at: string;
}

export interface WorkspaceContextProps {
  workspaces: Workspace[];
  selectedWorkspace?: Workspace;
  onCreateWorkspace: (parentId?: string) => void;
  onDeleteWorkspace: (workspaceId: string) => void;
  onDuplicateWorkspace: (workspaceId: string) => void;
  onRenameWorkspace: (workspaceId: string, newName: string) => void;
}
