import APIClient from "@/services/api-client";
import { useStore } from "@/stores/store";
import { Project } from "@/types/project";
import { useCallback, useEffect, useState } from "react";

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
              const duplicateData = createDuplicateData(
                projectToDuplicate,
                projectToDuplicate.parent_id
              );

              // Optimistic update with temporary ID
              const tempId = Date.now().toString();
              const optimisticProject = {
                ...duplicateData,
                id: tempId,
                children: [],
              };
              duplicateProject(optimisticProject);

              try {
                // Create the parent project first
                const newProject = await projectsAPI.post(duplicateData);

                // If original project had children, duplicate them
                if (projectToDuplicate.children?.length) {
                  for (const child of projectToDuplicate.children) {
                    const childDuplicateData = createDuplicateData(
                      child,
                      newProject.id
                    );
                    await projectsAPI.post(childDuplicateData);
                  }
                }

                // Fetch the updated project tree to get all new children
                await fetchWorkspaces();
              } catch (error) {
                console.error("Failed to duplicate project:", error);
                // Rollback optimistic update
                deleteProject(tempId);
                throw error;
              }
            }
            break;
          case "duplicateWithContents":
          case "duplicateStructure": {
            const withContent = action === "duplicateWithContents";
            const findProject = (projects: Project[]): Project | null => {
              if (!projectId) {
                console.error("Parent ID is missing for the project.");
              }

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

            const tempId = Date.now().toString();
            const projectToDuplicate = findProject(workspaces);
            if (projectToDuplicate) {
              try {
                // Find the project to duplicate
                const projectToDuplicate = findProject(workspaces);
                if (!projectToDuplicate) throw new Error("Project not found");
                // Create the duplicate data

                const duplicateData = {
                  name: `${projectToDuplicate.name} (Copy)`,
                  type: projectToDuplicate.type,
                  parent_id: projectToDuplicate.parent_id,
                  owner_id: "8ac84726-7c67-4c1b-a18f-aa8bd52710dc", // Make sure this matches your user ID
                  status: projectToDuplicate.status,
                  visibility: projectToDuplicate.visibility,
                  metadata: projectToDuplicate.metadata,
                  icon: projectToDuplicate.icon || "",
                  cover_image: projectToDuplicate.cover_image,
                };

                // Optimistic update
                const tempId = Date.now().toString();
                const optimisticProject = {
                  ...duplicateData,
                  id: tempId,
                  children: withContent
                    ? projectToDuplicate.children || []
                    : [],
                };
                console.log("Owner ID:", duplicateData.owner_id);

                // Add to UI immediately
                duplicateProject(optimisticProject);
                console.log("Optimistic update:", optimisticProject);

                // Call backend
                await projectsAPI.post(`/${projectId}/duplicate`, {
                  withContent,
                  name: duplicateData.name,
                  owner_id: "8ac84726-7c67-4c1b-a18f-aa8bd52710dc",
                  type: duplicateData.type,
                  parent_id: duplicateData.parent_id,
                  status: duplicateData.status,
                  visibility: duplicateData.visibility,
                  metadata: duplicateData.metadata,
                  icon: duplicateData.icon,
                  cover_image: duplicateData.cover_image,
                });

                // Refresh to get actual data
                await fetchWorkspaces();
              } catch (error) {
                console.error("Failed to duplicate project:", error);
                // Rollback optimistic update
                deleteProject(tempId);
                throw error;
              }
            }
            break;
          }
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
