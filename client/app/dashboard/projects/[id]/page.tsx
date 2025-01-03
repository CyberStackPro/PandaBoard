"use client";
import { ProjectHeader } from "@/app/_components/editor/project-header";
import { useProjectActions } from "@/hooks/project/use-project-actions";
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
  const userId = "06321aa5-78d2-450c-9892-fd5277775fae";

  const activeProject = useStore((state) => state.activeProject);
  const updateActiveProject = useStore((state) => state.updateActiveProject);
  const { handleRename } = useProjectActions(userId);
  const [coverImage, setCoverImage] = useState<string | null>(null);

  function onChange(editorState: EditorState) {
    editorState.read(() => {
      // Read the contents of the EditorState here.
      const root = $getRoot();
      const selection = $getSelection();

      console.log(root, selection);
    });
  }

  return (
    <div className="pb-[30vh] h-screen overflow-y-clip">
      <div className="layout-full relative" style={{ isolation: "isolate" }}>
        <ProjectHeader
          activeProject={activeProject}
          coverImage={coverImage}
          onCoverImageChange={setCoverImage}
          onRename={handleRename}
          updateActiveProject={updateActiveProject}
        />
        <div className="max-w-[765px]mx-auto px-4 mt-16">
          {/* Page controls */}

          {/* Content Editorial */}
          <div className="max-w-[765px] mx-auto px-4">
            <Editor onChange={onChange} initialContent={""} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
