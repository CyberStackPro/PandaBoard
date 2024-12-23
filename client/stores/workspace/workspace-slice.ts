import { StateCreator } from "zustand";
// import { Folder, File } from "lucide-react";
import { Store } from "@/types/store";
import {
  CreateProjectParams,
  WorkspaceSlice,
  WorkspaceState,
} from "@/types/workspace";
import { Project } from "@/types/project";

interface WorkSpaceActions {
  workspaces: Project[];
  addProject: (parentId?: string | null) => void;
  addFile: (parentId?: string | null) => void;
  deleteProject: (projectId: string) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
}

const initialState: WorkspaceState = {
  workspaces: [],
  isLoading: false,
  error: null,
};

export const createWorkspaceSlice: StateCreator<
  Store,
  [["zustand/immer", never]],
  [],
  WorkspaceSlice
> = (set) => ({
  ...initialState,
  addProject: async (params: CreateProjectParams) => {
    const newProject: Partial<Project> = {
      id: crypto.randomUUID(), // Generate unique ID
      name: params.name || "Untitled",
      parent_id: params.parent_id || null,
      type: params.type || "folder",
      description: params.description,
      visibility: params.visibility || "private",
      icon: params.icon || null,
      status: "active",
      children: params.type === "folder" ? [] : undefined,
      documents: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    set((state: WorkSpaceActions) => {
      if (!params.parent_id) {
        return {
          ...state,
          workspaces: [...state.workspaces, newProject as Project],
        };
      }
      // const updatedWorkspaces = state.workspaces.map((workspace) => {
      //   if (workspace.id === params.parent_id) {
      //     return {
      //       ...workspace,
      //       children: [...(workspace.children || []), newProject],
      //     };
      //   }
      //   return workspace;
      // });
      return {
        ...state,
        workspaces: updateWorkspaceTree(
          state.workspaces,
          params.parent_id,
          (parent) => ({
            ...parent,
            children: [...(parent.children || []), newProject as Project],
          })
        ),
      };
      // return updateWorkspaceTree(
      //   state.workspaces,
      //   params.parent_id,
      //   (parent) => ({
      //     ...parent,
      //     children: [...(parent.children || []), newProject as Project],
      //   })
      // );
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
});

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

// const findAndDeleteProject = (projects: Project[], projectId: string): Project[] => {
//     return projects.filter(project => {
//       if (project.id === projectId) return false;
//       if (project.children) {
//         project.children = findAndDeleteProject(project.children, projectId);
//       }
//       return true;
//     });
// };
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
