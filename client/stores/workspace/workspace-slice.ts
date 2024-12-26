import { StateCreator } from "zustand";
// import { Folder, File } from "lucide-react";
import { Store } from "@/types/store";
import {
  CreateProjectParams,
  WorkspaceSlice,
  WorkspaceState,
} from "@/types/workspace";
import { Project } from "@/types/project";
import APIClient from "@/services/api-client";

interface WorkSpaceActions {
  workspaces: Project[];
  addProject: (parentId?: string | null) => void;
  addFile: (parentId?: string | null) => void;
  deleteProject: (projectId: string) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  duplicateProject: (projectId: string) => void;
  fetchWorkspaces: () => void;
}

const initialState: WorkspaceState = {
  workspaces: [],
  isLoading: false,
  error: null,
};

const apiClient = new APIClient(
  "/projects/owner/8ac84726-7c67-4c1b-a18f-aa8bd52710dc"
);

export const createWorkspaceSlice: StateCreator<
  Store,
  [["zustand/immer", never]],
  [],
  WorkspaceSlice
> = (set) => ({
  ...initialState,
  fetchWorkspaces: async () => {
    try {
      const response = await apiClient.get();

      set({ workspaces: response });
    } catch (error) {
      console.error("Failed to fetch workspaces:", error);
    }
  },

  addProject: async (project: Project) => {
    set((state: WorkSpaceActions) => {
      const addToTree = (
        workspace: Project[],
        newProject: Project
      ): Project[] => {
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

      // return {
      //   ...state,
      //   workspaces: updateWorkspaceTree(
      //     state.workspaces,
      //     project.parent_id,
      //     (parent) => ({
      //       ...parent,
      //       children: [...(parent.children || []), project],
      //     })
      //   ),
      // };
      return {
        ...state,
        workspaces: addToTree(state.workspaces, project),
      };
    });
  },

  deleteProject: async (projectId: string) => {
    set((state: WorkSpaceActions) => {
      const recursiveDelete = (projects: Project[], id: string): Project[] => {
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

  updateProject: async (projectId: string, updates: Partial<Project>) => {
    set((state: WorkSpaceActions) => ({
      workspaces: findAndUpdateProject(state.workspaces, projectId, updates),
    }));
  },

  duplicateProject: async (project: Project) => {
    set((state: WorkSpaceActions) => {
      const addToTree = (
        workspace: Project[],
        newProject: Project
      ): Project[] => {
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

// const findAndDeleteProject = (
//   projects: Project[],
//   projectId: string
// ): Project[] => {
//   return projects.filter((project) => {
//     if (project.id === projectId) return false;
//     if (project.children) {
//       project.children = findAndDeleteProject(project.children, projectId);
//     }
//     return true;
//   });
// };

// const updatedWorkspaces = state.workspaces.map((workspace) => {
//   if (workspace.id === params.parent_id) {
//     return {
//       ...workspace,
//       children: [...(workspace.children || []), newProject],
//     };
//   }
//   return workspace;
// });
