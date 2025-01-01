import { StateCreator } from "zustand";
// import { Folder, File } from "lucide-react";
import { Store } from "@/types/store";
import { Draft } from "immer";
import { WorkspaceSlice, WorkspaceState } from "@/types/workspace";
import { Project } from "@/types/project";
import APIClient from "@/services/api-client";

const initialState: WorkspaceState = {
  workspaces: [],
  isLoading: false,
  error: null,
};

const apiClient = new APIClient("/projects");

export const createWorkspaceSlice: StateCreator<
  Store,
  [["zustand/immer", never]],
  [],
  WorkspaceSlice
> = (set) => ({
  ...initialState,

  fetchWorkspaces: async (ownerId: string) => {
    try {
      const response = (await apiClient.get(`/owner/${ownerId}`)) as Project[];
      set({ workspaces: response });
    } catch (error) {
      console.error("Failed to fetch workspaces:", error);
    }
  },

  addProject: async (project: Project) => {
    set((state) => {
      // Create a new draft-compatible object
      const draftProject = { ...project };

      if (!draftProject.parent_id) {
        state.workspaces.push(draftProject);
        return;
      }
      const addToTree = (
        workspace: Draft<Project>[],
        newProject: Draft<Project>
      ): Draft<Project>[] => {
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
      if (!project.parent_id) {
        return {
          ...state,
          workspaces: [...state.workspaces, project],
        };
      }
      return {
        ...state,
        workspaces: addToTree(state.workspaces, project),
      };
    });
  },

  deleteProject: async (projectId: string) => {
    set((state) => {
      const recursiveDelete = (
        projects: Draft<Project>[],
        id: string
      ): Draft<Project>[] => {
        return projects.filter((project) => {
          if (project.id === id) return false;
          if (project.children) {
            project.children = recursiveDelete(project.children, id);
          }
          return true;
        });
      };

      // Mutate the draft state directly
      state.workspaces = recursiveDelete(state.workspaces, projectId);
    });
  },

  updateProject: async (
    projectId: string,
    updates: Partial<Project>
  ): Promise<void> => {
    set((state) => ({
      workspaces: findAndUpdateProject(
        state.workspaces as Project[],
        projectId,
        updates
      ),
    }));
  },

  duplicateProject: async (project: Project) => {
    set((state) => {
      const addToTree = (
        workspace: Draft<Project>[],
        newProject: Draft<Project>
      ): Draft<Project>[] => {
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
        workspaces: addToTree(state.workspaces, project),
      };
    });
  },
});

const addToTree = (workspace: Project[], newProject: Project): Project[] => {
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
const findAndUpdateProject = (
  projects: Project[],
  projectId: string,
  updates: Partial<Project>
): Project[] => {
  return projects.map((project) => {
    if (project.id === projectId) {
      return { ...project, ...updates };
    }
    if (project.children) {
      return {
        ...project,
        children: findAndUpdateProject(project.children, projectId, updates),
      };
    }
    return project;
  });
};
const updateWorkspaceTree = (
  workspaces: Project[],
  projectId: string,
  updateFn: (project: Project) => Project
): Project[] => {
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
