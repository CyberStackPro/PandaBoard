// hooks/useWebSocket.ts
import { useEffect } from "react";
import io, { Socket } from "socket.io-client";
import { useStore } from "@/stores/store";

let socket: Socket | null = null;

export const useWebSocket = () => {
  const { addProject, updateProject, deleteProject, fetchWorkspaces } =
    useStore();

  useEffect(() => {
    if (!socket) {
      socket = io("http://localhost:4000", {
        withCredentials: true,
      });
    }

    socket.on("projectCreated", (project) => {
      addProject(project);
    });

    socket.on("projectUpdated", (project) => {
      updateProject(project.id, project);
    });

    socket.on("projectDeleted", ({ id }) => {
      deleteProject(id);
    });

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.off("projectCreated");
        socket.off("projectUpdated");
        socket.off("projectDeleted");
      }
    };
  }, [addProject, updateProject, deleteProject]);

  return socket;
};
