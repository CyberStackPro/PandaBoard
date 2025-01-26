import { Workspace } from "@/types/workspace";
import { Store } from "@/types/store";
import { StateCreator } from "zustand";

export interface ActiveWorkspaceState {
  activeWorkspace: Workspace | null;
  coverPosition?: number;
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
  coverPosition: 0,
  setActiveWorkspace: (project) =>
    set((state: ActiveWorkspaceState) => {
      state.activeWorkspace = project ? { ...project } : null;
    }),
  updateActiveWorkspace: (updates: Partial<Workspace>) =>
    set((state: ActiveWorkspaceState) => {
      if (state.activeWorkspace) {
        state.activeWorkspace = { ...state.activeWorkspace, ...updates };
      }
    }),
});
