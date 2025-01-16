import { Project } from "@/types/workspace";
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
  setActiveProject: (project) =>
    set((state) => {
      state.activeProject = project ? { ...project } : null;
    }),
  updateActiveProject: (updates) =>
    set((state) => {
      if (state.activeProject) {
        Object.assign(state.activeProject, updates);
      }
    }),
});
