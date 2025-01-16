import { useStore } from "@/stores/store";
import { Workspace } from "@/types/workspace";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export const useWorkspaceSocket = (userId: string) => {
  const socketRef = useRef<Socket | null>(null);
  const addWorkspace = useStore((state) => state.addWorkspace);
  const updateWorkspace = useStore((state) => state.updateWorkspace);
  const deleteWorkspace = useStore((state) => state.deleteWorkspace);
  const setActiveWorkspace = useStore((state) => state.setActiveWorkspace);

  useEffect(() => {
    socketRef.current = io("http://localhost:4000/workspaces", {
      withCredentials: true,
      query: { userId },
    });

    const onWorkspaceCreated = (workspace: Workspace) => {
      addWorkspace(workspace);
    };

    const onWorkspaceUpdated = (workspace: Workspace) => {
      updateWorkspace(workspace.id, workspace);
      // Update active Workspace if needed
      setActiveWorkspace(workspace);
    };

    const onWorkspaceDeleted = ({ id }: { id: string }) => {
      deleteWorkspace(id);
      setActiveWorkspace(null);
    };

    socketRef.current.on("onWorkspaceCreated", onWorkspaceCreated);
    socketRef.current.on("onWorkspaceUpdated", onWorkspaceUpdated);
    socketRef.current.on("onWorkspaceDeleted", onWorkspaceDeleted);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [
    userId,
    addWorkspace,
    updateWorkspace,
    deleteWorkspace,
    setActiveWorkspace,
  ]);

  return socketRef;
};
