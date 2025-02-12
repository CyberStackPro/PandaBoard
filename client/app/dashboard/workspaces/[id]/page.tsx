"use client";
import { ProjectHeader } from "@/app/_components/editor/project-header";
import { useWorkspaceActions } from "@/hooks/workspace/use-workspace-actions";
import { useStore } from "@/stores/store";
import { $getRoot, $getSelection, EditorState } from "lexical";
import React, { useEffect, useState } from "react";
import { Editor } from "../../_components/lexical/Editor";
import { useEditorContent } from "@/hooks/editor/use-editor-content";
import { blocksService } from "@/services/document.service";

interface PageProps {
  params: {
    id: string;
  };
}

const Page = ({ params }: PageProps) => {
  // const userId = "06321aa5-78d2-450c-9892-fd5277775fae";
  const { user } = useStore();
  const userId = user?.id;

  const activeWorkspace = useStore((state) => state.activeWorkspace);
  const updateActiveWorkspace = useStore(
    (state) => state.updateActiveWorkspace
  );
  const { handleRename } = useWorkspaceActions(userId);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [initialContent, setInitialContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { handleEditorChange } = useEditorContent(params.id);

  function onChange(editorState: EditorState) {
    editorState.read(() => {
      // Read the contents of the EditorState here.
      const root = $getRoot();
      const selection = $getSelection();
      // Convert the editor state to JSON and store it in localStorage
      const editorStateJson = JSON.stringify(editorState.toJSON());
      localStorage.setItem("editor-content", editorStateJson);
      console.log("ROOTED", editorStateJson);
    });

    handleEditorChange(editorState);
  }

  useEffect(() => {
    let isMounted = true;

    const loadContent = () => {
      try {
        setIsLoading(true);
        const storedContent = localStorage.getItem("editor-content");

        if (storedContent) {
          // Validate that it's proper JSON
          const parsed = JSON.parse(storedContent);
          setInitialContent(storedContent);
        } else {
          const emptyContent = {
            root: {
              children: [
                {
                  children: [],
                  direction: null,
                  format: "",
                  indent: 0,
                  type: "paragraph",
                  version: 1,
                },
              ],
              direction: null,
              format: "",
              indent: 0,
              type: "root",
              version: 1,
            },
          };
          setInitialContent(JSON.stringify(emptyContent));
        }
      } catch (err) {
        console.error("Error loading content:", err);
        setError("Failed to load content");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadContent();

    return () => {
      isMounted = false;
    };
  }, []);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!initialContent) return <div>No content available</div>;
  // if (isLoading) return <div>Loading...</div>;
  console.log("INITIAL_CONTENT", initialContent);

  return (
    <div className="pb-[30vh] h-screen ">
      <div className="layout-full relative" style={{ isolation: "isolate" }}>
        <ProjectHeader
          activeWorkspace={activeWorkspace}
          coverImage={coverImage}
          onCoverImageChange={setCoverImage}
          onRename={handleRename}
          //  setActiveWorkspace={setActiveWorkspace}
          updateActiveWorkspace={updateActiveWorkspace}
        />
        <div className="max-w-[765px] mx-auto px-4">
          {/* Page controls */}

          {/* Content Editorial */}
          <div className="max-w-[765px] mx-auto px-">
            <Editor onChange={onChange} initialContent={initialContent || ""} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
