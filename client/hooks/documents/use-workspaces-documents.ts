import APIClient from "@/services/api-client";
import { useStore } from "@/stores/store";
import { Workspace } from "@/types/workspace";
import { useToast } from "../use-toast";

const documentsAPI = new APIClient<Workspace>("/documents");
export const useWorkspaceActions = (userId: string) => {

  const { toast } = useToast();
  //   const setActiveWorkspace = useStore((state) => state.setActiveWorkspace);

  const handleRename = async (workspaceId: string, newName: string) => {
    try {
      await documentsAPI.patch(`/${workspaceId}`, { name: newName });
      updateWorkspace(workspaceId, { name: newName });
    } catch (error) {
      console.error("Failed to rename Workspace:", error.message);
      // toast({
      //   title: "Failed to rename Workspace",
      //   message: error.message,
      //   type: "foreground",
      // });

      await fetchWorkspaces(userId);
      throw error;
    }
  };
}