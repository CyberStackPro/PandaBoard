// hooks/use-projects.ts
import { create } from "zustand";
import { Project } from "@/types/project";
import { mockProjects } from "@/lib/mock-data";

interface ProjectsStore {
  projects: Project[];
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
}

export const useProjects = create<ProjectsStore>((set, get) => ({
  projects: mockProjects,
  loading: false,
  error: null,
  fetchProjects: async () => {
    set({ loading: true });
    try {
      // Replace with actual API call
      set({ projects: mockProjects, loading: false });
    } catch (error) {
      if (error instanceof Error)
        set({ error: "Failed to fetch projects", loading: false });
    }
  },
  addProject: (project) => {
    set((state) => ({
      projects: [...state.projects, project],
    }));
  },
  updateProject: (id, updates) => {
    set((state) => ({
      projects: updateProjectInTree(state.projects, id, updates),
    }));
  },
  deleteProject: (id) => {
    set((state) => ({
      projects: deleteProjectFromTree(state.projects, id),
    }));
  },
}));

// Helper functions for updating nested project tree
const updateProjectInTree = (
  projects: Project[],
  id: string,
  updates: Partial<Project>
): Project[] => {
  return projects.map((project) => {
    if (project.id === id) {
      return { ...project, ...updates };
    }
    if (project.children?.length) {
      return {
        ...project,
        children: updateProjectInTree(project.children, id, updates),
      };
    }
    return project;
  });
};

const deleteProjectFromTree = (projects: Project[], id: string): Project[] => {
  return projects.filter((project) => {
    if (project.id === id) {
      return false;
    }
    if (project.children?.length) {
      project.children = deleteProjectFromTree(project.children, id);
    }
    return true;
  });
};
