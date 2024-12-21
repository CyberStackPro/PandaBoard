import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createWorkspaceSlice } from "./workspace/workspace-slice";
import { Store } from "@/types/store";

export const useStore = create<Store>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((...a) => ({
          ...createWorkspaceSlice(...a),
        }))
      )
    )
  )
);
