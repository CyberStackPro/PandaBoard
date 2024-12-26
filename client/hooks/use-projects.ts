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
  const duplicateProject = useStore((state) => state.duplicateProject);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"folder" | "file">("folder");
  const [parentId, setParentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(true);
      const tempId = Date.now().toString();
      try {
        const projectData = {
          name,
          parent_id: parentId,
          type: dialogType,
          owner_id: "8ac84726-7c67-4c1b-a18f-aa8bd52710dc",
        };

        // Optimistic update
        const optimisticProject = {
          ...projectData,
          id: tempId,
          children: [],
        };
        addProject(optimisticProject);

        const newProject = await projectsAPI.post(projectData);

        // Update with real data
        addProject({ ...newProject, parent_id: parentId, type: dialogType });
      } catch (err) {
        console.error("Error creating project:", err);
        // Rollback optimistic update if needed
        deleteProject(tempId);
        alert("Failed to create project. Please try again.");
      } finally {
        setIsLoading(false);
        setDialogOpen(false);
        setParentId(null);
      }
    },
    [addProject, dialogType, parentId, deleteProject]
  );

  const handleProjectAction = useCallback(
    async (action: string, projectId: string, newName?: string) => {
      try {
        switch (action) {
          case "rename":
            if (newName) {
              // Optimistic update
              updateProject(projectId, { name: newName });
              const updatedProject = await projectsAPI.patch(`/${projectId}`, {
                name: newName,
              });
              updateProject(projectId, updatedProject);
            }
            break;

          case "delete":
            // Optimistic delete
            deleteProject(projectId);
            await projectsAPI.delete(`/${projectId}`);
            break;
          case "duplicate":
            const findProject = (projects: Project[]): Project | null => {
              for (const project of projects) {
                if (project.id === projectId) {
                  return project;
                }
                if (project.children?.length) {
                  const found = findProject(project.children);
                  if (found) return found;
                }
              }
              return null;
            };

            const createDuplicateData = (
              project: Project,
              parentId: string | null = null
            ): Project => {
              // Create base project data without ID and children
              const baseData = {
                name: `${project.name} (Copy)`,
                type: project.type,
                parent_id: parentId,
                status: project.status,
                visibility: project.visibility,
                metadata: project.metadata,
                icon: project.icon || "",
                cover_image: project.cover_image,
                owner_id: "8ac84726-7c67-4c1b-a18f-aa8bd52710dc",
              };

              return baseData;
            };
            const projectToDuplicate = findProject(workspaces);
            if (projectToDuplicate) {
              try {
                // Create the parent project first
                const parentDuplicateData = createDuplicateData(
                  projectToDuplicate,
                  projectToDuplicate.parent_id
                );
                const newParentProject = await projectsAPI.post(
                  parentDuplicateData
                );

                // If original project had children, duplicate them with the new parent ID
                if (projectToDuplicate.children?.length) {
                  const duplicateChildren = async (
                    children: Project[],
                    newParentId: string
                  ) => {
                    for (const child of children) {
                      const childDuplicateData = createDuplicateData(
                        child,
                        newParentId
                      );
                      const newChild = await projectsAPI.post(
                        childDuplicateData
                      );

                      // Recursively duplicate nested children
                      if (child.children?.length) {
                        await duplicateChildren(child.children, newChild.id);
                      }
                    }
                  };

                  await duplicateChildren(
                    projectToDuplicate.children,
                    newParentProject.id
                  );
                }

                // Fetch the updated project tree after all duplications are complete
                await fetchWorkspaces();
              } catch (error) {
                console.error("Failed to duplicate project:", error);
                await fetchWorkspaces(); // Refresh the tree in case of partial success
                throw error;
              }
            }
            break;
        }
      } catch (error) {
        console.error(`Failed to ${action} project:`, error);
        // Rollback on error
        await fetchWorkspaces();
        throw error;
      }
    },
    [
      updateProject,
      deleteProject,
      duplicateProject,
      workspaces,
      fetchWorkspaces,
    ]
  );

  return {
    handleProjectAction,
    workspaces,
    dialogOpen,
    dialogType,
    setDialogOpen,
    handleCreateProject,
    handleDialogSubmit,
    isLoading,
  };
};
