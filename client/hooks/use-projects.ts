import APIClient from "@/services/api-client";
import { useStore } from "@/stores/store";
import { Project } from "@/types/project";
import { useCallback, useEffect, useState } from "react";
// // hooks/use-projects.ts
// import { create } from "zustand";
// import { Project } from "@/types/project";
// import { mockProjects } from "@/lib/mock-data";

// interface ProjectsStore {
//   projects: Project[];
//   loading: boolean;
//   error: string | null;
//   fetchProjects: () => Promise<void>;
//   addProject: (project: Project) => void;
//   updateProject: (id: string, updates: Partial<Project>) => void;
//   deleteProject: (id: string) => void;
// }

// export const useProjects = create<ProjectsStore>((set, get) => ({
//   projects: mockProjects,
//   loading: false,
//   error: null,
//   fetchProjects: async () => {
//     set({ loading: true });
//     try {
//       // Replace with actual API call
//       set({ projects: mockProjects, loading: false });
//     } catch (error) {
//       if (error instanceof Error)
//         set({ error: "Failed to fetch projects", loading: false });
//     }
//   },
//   addProject: (project) => {
//     set((state) => ({
//       projects: [...state.projects, project],
//     }));
//   },
//   updateProject: (id, updates) => {
//     set((state) => ({
//       projects: updateProjectInTree(state.projects, id, updates),
//     }));
//   },
//   deleteProject: (id) => {
//     set((state) => ({
//       projects: deleteProjectFromTree(state.projects, id),
//     }));
//   },
// }));

// // Helper functions for updating nested project tree
// const updateProjectInTree = (
//   projects: Project[],
//   id: string,
//   updates: Partial<Project>
// ): Project[] => {
//   return projects.map((project) => {
//     if (project.id === id) {
//       return { ...project, ...updates };
//     }
//     if (project.children?.length) {
//       return {
//         ...project,
//         children: updateProjectInTree(project.children, id, updates),
//       };
//     }
//     return project;
//   });
// };

// const deleteProjectFromTree = (projects: Project[], id: string): Project[] => {
//   return projects.filter((project) => {
//     if (project.id === id) {
//       return false;
//     }
//     if (project.children?.length) {
//       project.children = deleteProjectFromTree(project.children, id);
//     }
//     return true;
//   });
// };

const projectsAPI = new APIClient<Project>("/projects");

export const useProjects = () => {
  const addProject = useStore((state) => state.addProject);
  const deleteProject = useStore((state) => state.deleteProject);
  const updateProject = useStore((state) => state.updateProject);
  const workspaces = useStore((state) => state.workspaces);
  const fetchWorkspaces = useStore((state) => state.fetchWorkspaces);

  // dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"folder" | "file">("folder");
  const [parentId, setParentId] = useState<string | null>(null);

  // console.log("parentId", workspaces);

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  const handleCreateProject = useCallback(
    (pId: string | null, type: "folder" | "file") => {
      setDialogType(type);
      setParentId(pId);
      setDialogOpen(true);
    },
    []
  );
  const handleDialogSubmit = useCallback(
    async (name: string) => {
      try {
        const projectData = {
          name,
          parent_id: parentId,
          type: dialogType,
          owner_id: "8ac84726-7c67-4c1b-a18f-aa8bd52710dc",
        };
        const newProject = await projectsAPI.post(projectData);
        addProject({ ...newProject, parent_id: parentId, type: dialogType });
      } catch (err) {
        console.error("Error creating project:", err);
        alert("Failed to create project. Please try again.");
      } finally {
        setDialogOpen(false);
        setParentId(null);
      }
    },
    [addProject, dialogType, parentId]
  );

  // const handleAddProject = async (params: Project) => {
  //   try {
  //     // const newProject = await projectsAPI.post(params);

  //     await addProject({
  //       ...params,
  //       id: newProject.id,
  //     });
  //     return newProject;
  //   } catch (error) {
  //     console.error("Error adding project:", error);
  //     throw error;
  //   }
  // };
  const handleProjectAction = async (
    action: string,
    projectId: string,
    newName?: string
  ) => {
    try {
      switch (action) {
        case "rename":
          if (newName) {
            const updatedProject = await projectsAPI.patch(`/${projectId}`, {
              name: newName,
            });
            await updateProject(projectId, updatedProject);
          }
          break;

        case "delete":
          await projectsAPI.delete(`/${projectId}`);
          await deleteProject(projectId);
          break;
      }
    } catch (error) {
      console.error(`Failed to ${action} project:`, error);
      throw error;
    }
  };

  return {
    handleProjectAction,
    workspaces,
    dialogOpen,
    dialogType,
    setDialogOpen,
    handleCreateProject,
    handleDialogSubmit,
  };
};
