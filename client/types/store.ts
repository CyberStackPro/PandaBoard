import { ActiveProjectState } from "@/stores/workspace/active-project-slice";
import { WorkspaceSlice } from "./workspaces";

export type Store = WorkspaceSlice & ActiveProjectState;
