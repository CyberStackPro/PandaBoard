import { Project, ProjectVisibility } from "./project";

export interface WorkspaceState {
  workspaces: Project[];
  isLoading: boolean;
  error: string | null;
}

export interface WorkspaceActions {
  addProject: (params: CreateProjectParams) => Promise<void>;
  //   deleteProject: (projectId: string) => Promise<void>;
  //   updateProject: (
  //     projectId: string,
  //     updates: Partial<Project>
  //   ) => Promise<void>;
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

export type WorkspaceSlice = WorkspaceState & WorkspaceActions;
