import APIClient from "@/services/api-client";
import { useAuthStore } from "@/stores/auth/auth-store";
import { useStore } from "@/stores/store";
import { Project } from "@/types/project";
import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const projectsAPI = new APIClient<Project>("/projects");
// const socket = io("http://localhost:4000/projects", {
//   withCredentials: true,
// });

export const useProjects = () => {
  const addProject = useStore((state) => state.addProject);
  const deleteProject = useStore((state) => state.deleteProject);
  const updateProject = useStore((state) => state.updateProject);
  const workspaces = useStore((state) => state.workspaces);
  const fetchWorkspaces = useStore((state) => state.fetchWorkspaces);
  const duplicateProject = useStore((state) => state.duplicateProject);
  const { user } = useAuthStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"folder" | "file">("folder");
  const [parentId, setParentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Use useRef for socket to maintain connection
  const socketRef = useRef<Socket | null>(null);
  const isProcessingServerUpdate = useRef(false);
  const userId = "06321aa5-78d2-450c-9892-fd5277775fae";

  useEffect(() => {
    if (userId) {
      fetchWorkspaces(userId);
    }
  }, [userId, fetchWorkspaces]);

  useEffect(() => {
    socketRef.current = io("http://localhost:4000/projects", {
      withCredentials: true,
      query: { userId },
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userId]);
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
      try {
        const projectData = {
          name,
          parent_id: parentId,
          type: dialogType,
          owner_id: userId,
        };

        // Create the project
        isProcessingServerUpdate.current = true;
        await projectsAPI.post(projectData);

        // Instead of manually adding, refresh the workspaces
        // await fetchWorkspaces(userId);

        setDialogOpen(false);
      } catch (err) {
        console.error("Error creating project:", err);
        alert("Failed to create project. Please try again.");
        await fetchWorkspaces(userId);
      } finally {
        setIsLoading(false);
        setDialogOpen(false);
        setParentId(null);
        isProcessingServerUpdate.current = false;
      }
    },
    [dialogType, parentId, userId, fetchWorkspaces]
  );
  // WebSocket event listeners
  useEffect(() => {
    if (!socketRef.current) return;

    // Initial data fetch

    const onProjectCreated = (project: Project) => {
      console.log("Project created:", project);
      if (!isProcessingServerUpdate.current) {
        addProject(project);
      }
      // addProject(project);
    };

    const onProjectUpdated = (project: Project) => {
      console.log("Project updated:", project);
      updateProject(project.id, project);
    };

    const onProjectDeleted = ({ id }: { id: string }) => {
      console.log("Project deleted:", id);
      deleteProject(id);
    };

    socketRef.current.on("onProjectCreated", onProjectCreated);
    socketRef.current.on("onProjectUpdated", onProjectUpdated);
    socketRef.current.on("onProjectDeleted", onProjectDeleted);

    return () => {
      if (socketRef.current) {
        socketRef.current.off("onProjectCreated", onProjectCreated);
        socketRef.current.off("onProjectUpdated", onProjectUpdated);
        socketRef.current.off("onProjectDeleted", onProjectDeleted);
      }
    };
  }, [addProject, updateProject, deleteProject, fetchWorkspaces]);

  const handleProjectAction = useCallback(
    async (action: string, projectId: string, newName?: string) => {
      try {
        switch (action) {
          case "rename":
            if (newName) {
              // updateProject(projectId, { name: newName });
              await projectsAPI.patch(`/${projectId}`, {
                name: newName,
              });
              // await fetchWorkspaces(userId);
            }
            break;

          case "delete":
            // Optimistic delete
            // deleteProject(projectId);
            await projectsAPI.delete(`/${projectId}`);
            // await fetchWorkspaces(userId);
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
                console.error(`Failed to ${action} project:`, error);
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
              // if (!projectId) {
              //   console.error("Parent ID is missing for the project.");
              // }

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

            // const tempId = Date.now().toString();
            const projectToDuplicate = findProject(workspaces);
            if (projectToDuplicate) {
              const tempId = Date.now().toString();
              try {
                // Find the project to duplicate
                const duplicateData = {
                  name: `${projectToDuplicate.name} (Copy)`,
                  type: projectToDuplicate.type,
                  parent_id: projectToDuplicate.parent_id,
                  owner_id: "8ac84726-7c67-4c1b-a18f-aa8bd52710dc",
                  status: projectToDuplicate.status,
                  visibility: projectToDuplicate.visibility,
                  metadata: projectToDuplicate.metadata,
                  icon: projectToDuplicate.icon || "",
                  cover_image: projectToDuplicate.cover_image,
                };

                // Optimistic update
                const optimisticProject = {
                  ...duplicateData,
                  id: tempId,
                  children: withContent
                    ? projectToDuplicate.children || []
                    : [],
                };

                console.log("Owner ID:", duplicateData.owner_id);

                // Add to UI immediately
                // Add to UI immediately
                duplicateProject(optimisticProject);

                // Call backend using the dedicated duplicate endpoint
                await projectsAPI.post(`/projects/${projectId}/duplicate`, {
                  withContent,
                  ...duplicateData,
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
        await fetchWorkspaces(userId);
        throw error;
      } finally {
        isProcessingServerUpdate.current = false;
      }
    },
    [workspaces, duplicateProject, deleteProject, fetchWorkspaces, userId]
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
