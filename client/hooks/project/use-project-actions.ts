import APIClient from "@/services/api-client";
import { useStore } from "@/stores/store";
import { Project } from "@/types/project";

const projectsAPI = new APIClient<Project>("/projects");
export const useProjectActions = (userId: string) => {
  const workspaces = useStore((state) => state.workspaces);
  const duplicateProject = useStore((state) => state.duplicateProject);
  const fetchWorkspaces = useStore((state) => state.fetchWorkspaces);
  //   const setActiveProject = useStore((state) => state.setActiveProject);

  const handleRename = async (projectId: string, newName: string) => {
    try {
      await projectsAPI.patch(`/${projectId}`, { name: newName });
    } catch (error) {
      console.error("Failed to rename project:", error);
      await fetchWorkspaces(userId);
      throw error;
    }
  };

  const handleDelete = async (projectId: string) => {
    try {
      await projectsAPI.delete(`/${projectId}`);
    } catch (error) {
      console.error("Failed to delete project:", error);
      await fetchWorkspaces(userId);
      throw error;
    }
  };

  const handleDuplicate = async (projectId: string, withContent: boolean) => {
    const projectToDuplicate = findProjectInTree(workspaces, projectId);
    if (!projectToDuplicate) return;

    const duplicateData = createDuplicateData(
      projectToDuplicate,
      withContent,
      userId
    );
    const tempId = Date.now().toString();

    try {
      duplicateProject({ ...duplicateData, id: tempId });
      await projectsAPI.post(`/projects/${projectId}/duplicate`, duplicateData);
      await fetchWorkspaces(userId);
    } catch (error) {
      console.error("Failed to duplicate project:", error);
      throw error;
    }
  };

  return {
    handleRename,
    handleDelete,
    handleDuplicate,
  };
};

const findProjectInTree = (projects: Project[], id: string): Project | null => {
  for (const project of projects) {
    if (project.id === id) return project;
    if (project.children?.length) {
      const found = findProjectInTree(project.children, id);
      if (found) return found;
    }
  }
  return null;
};

const createDuplicateData = (
  project: Project,
  withContent: boolean,
  userId: string
) => ({
  withContent,
  name: `${project.name} (Copy)`,
  type: project.type || "folder",
  parent_id: project.parent_id || null,
  owner_id: userId,
  status: project.status || "active",
  visibility: project.visibility || "private",
  metadata: project.metadata || {},
  icon: project.icon || "",
  cover_image: project.cover_image,
  description: project.description || "",
});
