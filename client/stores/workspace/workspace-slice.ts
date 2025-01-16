import { StateCreator } from "zustand";
// import { Folder, File } from "lucide-react";
import { Store } from "@/types/store";
import { Draft } from "immer";
import { WorkspaceSlice, WorkspaceState } from "@/types/workspaces";
import { Workspace } from "@/types/workspace";
import APIClient from "@/services/api-client";

const initialState: WorkspaceState = {
  workspaces: [],
  isLoading: false,
  error: null,
};

const apiClient = new APIClient("/workspaces");

export const createWorkspaceSlice: StateCreator<
  Store,
  [["zustand/immer", never]],
  [],
  WorkspaceSlice
> = (set) => ({
  ...initialState,

  fetchWorkspaces: async (ownerId: string) => {
    try {
      const response = (await apiClient.get(
        `/owner/${ownerId}`
      )) as Workspace[];
      set({ workspaces: response });
    } catch (error) {
      console.error("Failed to fetch workspaces:", error);
    }
  },

  addWorkspace: async (workspace: Workspace) => {
    set((state) => {
      // Create a new draft-compatible object
      const draftWorkspace = { ...workspace };

      if (!draftWorkspace.parent_id) {
        state.workspaces.push(draftWorkspace);
        return;
      }
      const addToTree = (
        workspace: Draft<Workspace>[],
        newWorkspace: Draft<Workspace>
      ): Draft<Workspace>[] => {
        if (!newWorkspace.parent_id) {
          return [...workspace, newWorkspace];
        }
        return workspace.map((workspace) => {
          if (workspace.id === newWorkspace.parent_id) {
            return {
              ...workspace,
              children: [...(workspace.children || []), newWorkspace],
            };
          }
          if (workspace.children?.length) {
            return {
              ...workspace,
              children: addToTree(workspace.children, newWorkspace),
            };
          }
          return workspace;
        });
      };
      if (!workspace.parent_id) {
        return {
          ...state,
          workspaces: [...state.workspaces, workspace],
        };
      }
      return {
        ...state,
        workspaces: addToTree(state.workspaces, workspace),
      };
    });
  },

  deleteWorkspace: async (projectId: string) => {
    set((state) => {
      const recursiveDelete = (
        projects: Draft<Workspace>[],
        id: string
      ): Draft<Workspace>[] => {
        return projects.filter((workspace) => {
          if (workspace.id === id) return false;
          if (workspace.children) {
            workspace.children = recursiveDelete(workspace.children, id);
          }
          return true;
        });
      };

      // Mutate the draft state directly
      state.workspaces = recursiveDelete(state.workspaces, projectId);
    });
  },

  updateWorkspace: async (
    projectId: string,
    updates: Partial<Workspace>
  ): Promise<void> => {
    set((state) => ({
      workspaces: findAndUpdateProject(
        state.workspaces as Workspace[],
        projectId,
        updates
      ),
    }));
  },

  duplicateWorkspace: async (workspace: Workspace) => {
    set((state) => {
      const addToTree = (
        workspace: Draft<Workspace>[],
        newProject: Draft<Workspace>
      ): Draft<Workspace>[] => {
        if (!newProject.parent_id) {
          return [...workspace, newProject];
        }

        return workspace.map((workspace) => {
          if (workspace.id === newProject.parent_id) {
            return {
              ...workspace,
              children: [...(workspace.children || []), newProject],
            };
          }
          if (workspace.children?.length) {
            return {
              ...workspace,
              children: addToTree(workspace.children, newProject),
            };
          }
          return workspace;
        });
      };

      return {
        ...state,
        workspaces: addToTree(state.workspaces, workspace),
      };
    });
  },
});

const findAndUpdateProject = (
  projects: Workspace[],
  projectId: string,
  updates: Partial<Workspace>
): Workspace[] => {
  return projects.map((workspace) => {
    if (workspace.id === projectId) {
      return { ...workspace, ...updates };
    }
    if (workspace.children) {
      return {
        ...workspace,
        children: findAndUpdateProject(workspace.children, projectId, updates),
      };
    }
    return workspace;
  });
};

const addToTree = (
  workspace: Workspace[],
  newProject: Workspace
): Workspace[] => {
  if (!newProject.parent_id) {
    return [...workspace, newProject];
  }

  return workspace.map((workspace) => {
    if (workspace.id === newProject.parent_id) {
      return {
        ...workspace,
        children: [...(workspace.children || []), newProject],
      };
    }
    if (workspace.children?.length) {
      return {
        ...workspace,
        children: addToTree(workspace.children, newProject),
      };
    }
    return workspace;
  });
};

const updateWorkspaceTree = (
  workspaces: Workspace[],
  projectId: string,
  updateFn: (workspace: Workspace) => Workspace
): Workspace[] => {
  return workspaces.map((workspace) => {
    if (workspace.id === projectId) {
      return updateFn(workspace);
    }
    if (workspace.children && workspace.children.length > 0) {
      return {
        ...workspace,
        children: updateWorkspaceTree(workspace.children, projectId, updateFn),
      };
    }
    return workspace;
  });
};
