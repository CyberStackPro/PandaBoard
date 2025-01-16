import APIClient from "@/services/api-client";
import { useStore } from "@/stores/store";
import { Workspace } from "@/types/workspace";

const workspacesAPI = new APIClient<Workspace>("/workspaces");
export const useWorkspaceActions = (userId: string) => {
  const workspaces = useStore((state) => state.workspaces);
  const duplicateWorkspace = useStore((state) => state.duplicateWorkspace);
  const fetchWorkspaces = useStore((state) => state.fetchWorkspaces);
  //   const setActiveWorkspace = useStore((state) => state.setActiveWorkspace);

  const handleRename = async (workspaceId: string, newName: string) => {
    try {
      await workspacesAPI.patch(`/${workspaceId}`, { name: newName });
    } catch (error) {
      console.error("Failed to rename Workspace:", error);
      await fetchWorkspaces(userId);
      throw error;
    }
  };

  const handleDelete = async (workspaceId: string) => {
    try {
      await workspacesAPI.delete(`/${workspaceId}`);
    } catch (error) {
      console.error("Failed to delete Workspace:", error);
      await fetchWorkspaces(userId);
      throw error;
    }
  };

  const handleDuplicate = async (workspaceId: string, withContent: boolean) => {
    const workspaceToDuplicate = findWorkspaceInTree(workspaces, workspaceId);
    if (!workspaceToDuplicate) return;

    const duplicateData = createDuplicateData(
      workspaceToDuplicate,
      withContent,
      userId
    );
    const tempId = Date.now().toString();

    try {
      duplicateWorkspace({ ...duplicateData, id: tempId });
      await workspacesAPI.post(
        `/Workspaces/${workspaceId}/duplicate`,
        duplicateData
      );
      await fetchWorkspaces(userId);
    } catch (error) {
      console.error("Failed to duplicate Workspace:", error);
      throw error;
    }
  };

  return {
    handleRename,
    handleDelete,
    handleDuplicate,
  };
};

const findWorkspaceInTree = (
  workspaces: Workspace[],
  id: string
): Workspace | null => {
  for (const workspace of workspaces) {
    if (workspace.id === id) return workspace;
    if (workspace.children?.length) {
      const found = findWorkspaceInTree(workspace.children, id);
      if (found) return found;
    }
  }
  return null;
};

const createDuplicateData = (
  workspace: Workspace,
  withContent: boolean,
  userId: string
) => ({
  withContent,
  name: `${workspace.name} (Copy)`,
  type: workspace.type || "folder",
  parent_id: workspace.parent_id || null,
  owner_id: userId,
  status: workspace.status || "active",
  visibility: workspace.visibility || "private",
  metadata: workspace.metadata || {},
  icon: workspace.icon || "",
  cover_image: workspace.cover_image,
  description: workspace.description || "",
});
