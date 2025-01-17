import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createWorkspaceSlice } from "./workspace/workspace-slice";
import { Store } from "@/types/store";
import { createActiveWorkspaceSlice } from "./workspace/active-project-slice";

export const useStore = create<Store>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((...a) => ({
          ...createWorkspaceSlice(...a),
          ...createActiveWorkspaceSlice(...a),
        }))
      ),
      { name: "notion-store" }
    )
  )
);
