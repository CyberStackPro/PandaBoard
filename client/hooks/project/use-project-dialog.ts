import APIClient from "@/services/api-client";
import { useStore } from "@/stores/store";
import { Project } from "@/types/workspace";
import { useCallback, useState } from "react";

const projectsAPI = new APIClient<Project>("/workspaces");
export const useProjectDialog = (userId: string) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"folder" | "file">("folder");
  const [parentId, setParentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fetchWorkspaces = useStore((state) => state.fetchWorkspaces);

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

        await projectsAPI.post(projectData);
        await fetchWorkspaces(userId);
        setDialogOpen(false);
      } catch (err) {
        console.error("Error creating project:", err);
        alert("Failed to create project. Please try again.");
        await fetchWorkspaces(userId);
      } finally {
        setIsLoading(false);
        setDialogOpen(false);
        setParentId(null);
      }
    },
    [dialogType, parentId, userId, fetchWorkspaces]
  );

  return {
    dialogOpen,
    setDialogOpen,
    dialogType,
    parentId,
    handleCreateProject,
    handleDialogSubmit,
    isLoading,
  };
};
