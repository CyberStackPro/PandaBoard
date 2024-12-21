import { Project } from "@/types/project";
import { StateCreator } from "zustand";

interface WorkSpaceActions {
  workspaces: Project[];
  addProject: (parentId?: string | null) => void;
  addFile: (parentId?: string | null) => void;
  deleteProject: (projectId: string) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
}
export type WorkSpaceSlice = Partial<Project> & WorkSpaceActions;

const initialState: Project = {
  id: "",
  name: "",
  icon: "",
  children: [],
  documents: [],
  parent_id: "",
  owner_id: "",
  description: "",
  status: "archived",
  visibility: "private",
  metadata: {},
  cover_image: null,
  created_at: "",
  updated_at: "",
};

export const createWorkspaceSlice: StateCreator<
  Project,
  [["zustand/immer", never]],
  [],
  WorkSpaceSlice
> = (set, get) => ({
  ...initialState,
  workspaces: [],
  addProject: () => {},
  addFile: () => {},
  deleteProject: () => {},
  updateProject: () => {},
});
