import { Workspace, WorkspaceVisibility } from "./workspace";

export interface WorkspaceState {
  workspaces: Workspace[];
  isLoading: boolean;
  error: Error | null;
}
export interface WorkspaceAction {
  type:
    | "add"
    | "rename"
    | "update"
    | "delete"
    | "duplicate"
    | "favorite"
    | "copyLink"
    | "move";
  handler: WorkspaceActions;
}
// const Workspace_ACTIONS: Record<string, WorkspaceAction> = {
//   rename: {
//     type: 'rename',
//     handler: {renameWorkspace()}
//   },
//   delete: {
//     type: 'delete',
//     handler: {deleteWorkspace()}
//   },
//   // ... other actions
// };
export interface WorkspaceActions {
  fetchWorkspaces: (userId: string) => Promise<void>;
  addWorkspace: (Workspace: Workspace) => Promise<void>;
  updateWorkspace: (
    WorkspaceId: string,
    updates: Partial<Workspace>
  ) => Promise<void>;
  deleteWorkspace: (WorkspaceId: string) => Promise<void>;
  duplicateWorkspace: (Workspace: Workspace) => Promise<void>;
  //   fetchWorkspaces: () => Promise<void>;
}

export interface CreateWorkspaceParams {
  name?: string;
  parent_id?: string | null;
  description?: string | null;
  type: "folder" | "file";
  visibility?: WorkspaceVisibility;
  icon?: string | null;
}

export interface WorkspaceSlice extends WorkspaceState {
  fetchWorkspaces: (userId: string) => Promise<void>;
  addWorkspace: (Workspace: Workspace) => Promise<void>;
  updateWorkspace: (
    WorkspaceId: string,
    updates: Partial<Workspace>
  ) => Promise<void>;
  deleteWorkspace: (WorkspaceId: string) => Promise<void>;
  duplicateWorkspace: (Workspace: Workspace) => Promise<void>;
}
