"use client";
import { ProjectHeader } from "@/app/_components/editor/project-header";
import { useWorkspaceActions } from "@/hooks/workspace/use-workspace-actions";
import { useStore } from "@/stores/store";
import { $getRoot, $getSelection, EditorState } from "lexical";
import React, { useState } from "react";
import { Editor } from "../../_components/lexical/Editor";

interface PageProps {
  params: {
    id: string;
  };
}

const Page = () => {
  // const userId = "06321aa5-78d2-450c-9892-fd5277775fae";
  const { user } = useStore();
  const userId = user?.id;

  const activeWorkspace = useStore((state) => state.activeWorkspace);
  const updateActiveWorkspace = useStore(
    (state) => state.updateActiveWorkspace
  );
  const { handleRename } = useWorkspaceActions(userId);
  const [coverImage, setCoverImage] = useState<string | null>(null);

  function onChange(editorState: EditorState) {
    editorState.read(() => {
      // Read the contents of the EditorState here.
      const root = $getRoot();
      const selection = $getSelection();

      console.log("EditorState", editorState.toJSON());

      console.log(root, selection);
    });
  }

  return (
    <div className="pb-[30vh] h-screen ">
      <div className="layout-full relative" style={{ isolation: "isolate" }}>
        <ProjectHeader
          activeWorkspace={activeWorkspace}
          coverImage={coverImage}
          onCoverImageChange={setCoverImage}
          onRename={handleRename}
          updateActiveWorkspace={updateActiveWorkspace}
        />
        <div className="max-w-[765px] mx-auto px-4">
          {/* Page controls */}

          {/* Content Editorial */}
          <div className="max-w-[765px] mx-auto px-">
            <Editor onChange={onChange} initialContent={""} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
