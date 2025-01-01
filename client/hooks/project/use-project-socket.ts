import { useStore } from "@/stores/store";
import { Project } from "@/types/project";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export const useProjectSocket = (userId: string) => {
  const socketRef = useRef<Socket | null>(null);
  const addProject = useStore((state) => state.addProject);
  const updateProject = useStore((state) => state.updateProject);
  const deleteProject = useStore((state) => state.deleteProject);
  const setActiveProject = useStore((state) => state.setActiveProject);

  useEffect(() => {
    socketRef.current = io("http://localhost:4000/projects", {
      withCredentials: true,
      query: { userId },
    });

    const onProjectCreated = (project: Project) => {
      addProject(project);
    };

    const onProjectUpdated = (project: Project) => {
      updateProject(project.id, project);
      // Update active project if needed
      setActiveProject(project);
    };

    const onProjectDeleted = ({ id }: { id: string }) => {
      deleteProject(id);
      setActiveProject(null);
    };

    socketRef.current.on("onProjectCreated", onProjectCreated);
    socketRef.current.on("onProjectUpdated", onProjectUpdated);
    socketRef.current.on("onProjectDeleted", onProjectDeleted);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userId, addProject, updateProject, deleteProject, setActiveProject]);

  return socketRef;
};
