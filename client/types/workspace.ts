import { Project, ProjectVisibility } from "./project";

export interface WorkspaceState {
  workspaces: Project[];
  isLoading: boolean;
  error: Error | null;
}
export interface ProjectAction {
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
// const PROJECT_ACTIONS: Record<string, ProjectAction> = {
//   rename: {
//     type: 'rename',
//     handler: {renameProject()}
//   },
//   delete: {
//     type: 'delete',
//     handler: {deleteProject()}
//   },
//   // ... other actions
// };
export interface WorkspaceActions {
  fetchWorkspaces: (userId: string) => Promise<void>;
  addProject: (project: Project) => Promise<void>;
  updateProject: (
    projectId: string,
    updates: Partial<Project>
  ) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  duplicateProject: (project: Project) => Promise<void>;
  //   fetchProjects: () => Promise<void>;
}

export interface CreateProjectParams {
  name?: string;
  parent_id?: string | null;
  description?: string | null;
  type: "folder" | "file";
  visibility?: ProjectVisibility;
  icon?: string | null;
}

export interface WorkspaceSlice extends WorkspaceState {
  fetchWorkspaces: (userId: string) => Promise<void>;
  addProject: (project: Project) => Promise<void>;
  updateProject: (
    projectId: string,
    updates: Partial<Project>
  ) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  duplicateProject: (project: Project) => Promise<void>;
}
