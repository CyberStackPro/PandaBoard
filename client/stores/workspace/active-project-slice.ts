import { Workspace } from "@/types/workspace";
import { Store } from "@/types/store";
import { StateCreator } from "zustand";

export interface ActiveWorkspaceState {
  activeWorkspace: Workspace | null;
  setActiveWorkspace: (workspace: Workspace | null) => void;
  updateActiveWorkspace: (updates: Partial<Workspace>) => void;
}

export const createActiveWorkspaceSlice: StateCreator<
  Store,
  [["zustand/immer", never]],
  [],
  ActiveWorkspaceState
> = (set) => ({
  activeWorkspace: null,
  setActiveWorkspace: (project) =>
    set((state: ActiveWorkspaceState) => {
      state.activeWorkspace = project ? { ...project } : null;
    }),
  updateActiveWorkspace: (updates) =>
    set((state: ActiveWorkspaceState) => {
      if (state.activeWorkspace) {
        Object.assign(state.activeWorkspace, updates);
      }
    }),
});
