import { Project } from "@/types/project";
import { Store } from "@/types/store";
import { StateCreator } from "zustand";

export interface ActiveProjectState {
  activeProject: Project | null;
  setActiveProject: (project: Project | null) => void;
  updateActiveProject: (updates: Partial<Project>) => void;
}

export const createActiveProjectSlice: StateCreator<
  Store,
  [["zustand/immer", never]],
  [],
  ActiveProjectState
> = (set) => ({
  activeProject: null,
  setActiveProject: (project) => set({ activeProject: project }),
  updateActiveProject: (updates) =>
    set((state: ActiveProjectState) => {
      if (state.activeProject) {
        state.activeProject = { ...state.activeProject, ...updates };
      }
    }),
});
