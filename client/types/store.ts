import { ActiveProjectState } from "@/stores/workspace/active-project-slice";
import { WorkspaceSlice } from "./workspace";

export type Store = WorkspaceSlice & ActiveProjectState;
