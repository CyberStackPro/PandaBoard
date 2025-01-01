// types/project-actions.ts
export enum ProjectActionType {
  RENAME = "rename",
  DELETE = "delete",
  DUPLICATE = "duplicate",
  MOVE = "move",
  FAVORITE = "favorite",
  COPY_LINK = "copyLink",
}

export type ProjectActionPayload = {
  [ProjectActionType.RENAME]: { projectId: string; newName: string };
  [ProjectActionType.DELETE]: { projectId: string };
  [ProjectActionType.DUPLICATE]: { projectId: string; withContent: boolean };
  [ProjectActionType.MOVE]: { projectId: string; newParentId: string | null };
  [ProjectActionType.FAVORITE]: { projectId: string };
  [ProjectActionType.COPY_LINK]: { projectId: string };
};

export type ProjectAction<T extends ProjectActionType> = {
  type: T;
  payload: ProjectActionPayload[T];
};
