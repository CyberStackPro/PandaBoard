export const PROJECT_ACTIONS = {
  RENAME: "rename",
  DELETE: "delete",
  DUPLICATE: "duplicate",
  FAVORITE: "favorite",
  COPY_LINK: "copyLink",
} as const;

export type ProjectAction = keyof typeof PROJECT_ACTIONS;
