import { API_URL } from "@/lib/axios";
import APIClient from "@/services/api-client";
import { useAuthStore } from "@/stores/auth/auth-store";
import { useStore } from "@/stores/store";
import { Project } from "@/types/workspace";
import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const projectsAPI = new APIClient<Project>("/workspaces");
// const socket = io("http://localhost:4000/projects", {
//   withCredentials: true,
// });

export const useProjects = () => {
  const addProject = useStore((state) => state.addProject);
  const deleteProject = useStore((state) => state.deleteProject);
  const updateProject = useStore((state) => state.updateProject);
  const workspaces = useStore<Project[]>((state) => state.workspaces);
  const fetchWorkspaces = useStore((state) => state.fetchWorkspaces);
  const duplicateProject = useStore((state) => state.duplicateProject);
  // const { user } = useAuthStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"folder" | "file">("folder");
  const [parentId, setParentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Use useRef for socket to maintain connection
  const socketRef = useRef<Socket | null>(null);
  const isProcessingServerUpdate = useRef(false);
  const userId = "3a4ca7ae-cc8c-4ce7-8a7a-8daeb6929334";

  useEffect(() => {
    if (userId) {
      fetchWorkspaces(userId);
    }
  }, [userId, fetchWorkspaces]);

  useEffect(() => {
    socketRef.current = io(API_URL, {
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

          case "duplicateWithContents":
          case "duplicateStructure": {
            const withContent = action === "duplicateWithContents";
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

            const projectToDuplicate = findProject(workspaces);
            if (projectToDuplicate) {
              const tempId = Date.now().toString();
              try {
                // Match the schema requirements
                const duplicateData = {
                  withContent,
                  name: projectToDuplicate.name
                    ? `${projectToDuplicate.name} (Copy)`
                    : "Untitled Copy",
                  type: projectToDuplicate.type || "folder",
                  parent_id: projectToDuplicate.parent_id || null,
                  owner_id: userId, // Make sure this is a valid UUID
                  status: projectToDuplicate.status || "active",
                  visibility: projectToDuplicate.visibility || "private",
                  metadata: projectToDuplicate.metadata || {},
                  icon: projectToDuplicate.icon || "",
                  cover_image: projectToDuplicate.cover_image || undefined, // Only include if it's a valid URL
                  description: projectToDuplicate.description || "",
                };

                // Optimistic update
                const optimisticProject = {
                  ...duplicateData,
                  id: tempId,
                  children: withContent
                    ? projectToDuplicate.children || []
                    : [],
                };

                // Add to UI immediately
                duplicateProject(optimisticProject);

                // Call backend
                await projectsAPI.post(
                  `/projects/${projectId}/duplicate`,
                  duplicateData
                );

                // Refresh to get actual data
                await fetchWorkspaces();
              } catch (error) {
                console.error("Failed to duplicate project:", error);
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
