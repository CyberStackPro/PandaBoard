"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import FloatingTextFormatToolbarPlugin from "../../_components/lexical/plugins/FloatingTextFormatToolbarPlugin";
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
  EditorState,
} from "lexical";
import { $createListItemNode, $createListNode } from "@lexical/list";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $createLinkNode } from "@lexical/link";
import { useStore } from "@/stores/store";
import { Code } from "lucide-react";
import { useProjectActions } from "@/hooks/project/use-project-actions";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { usePathname } from "next/navigation";

function MyOnChangePlugin({ onChange }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      onChange(editorState);
    });
  }, [editor, onChange]);
  return null;
}

function onError(error: unknown) {
  console.error(error);
}
const Page = ({ params }: { params: { id: string } }) => {
  const userId = "06321aa5-78d2-450c-9892-fd5277775fae";
  const activeProject = useStore((state) => state.activeProject);
  const { handleRename } = useProjectActions(userId);
  const updateActiveProject = useStore((state) => state.updateActiveProject);
  const paths = usePathname();
  const pathNames = paths.split("/");
  console.log(paths);
  console.log(pathNames);

  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(activeProject?.name || "");
  const headingRef = useRef<HTMLDivElement>(null);

  const [editorState, setEditorState] = useState();
  const [isLinkEditMode, setIsLinkEditMode] = useState(false);

  const handleRenameSubmit = useCallback(
    async (newName: string) => {
      if (
        activeProject &&
        newName.trim() &&
        newName !== activeProject.name &&
        activeProject?.children?.length === 0
      ) {
        await handleRename(activeProject.id, newName);

        // if (activeProject.id === activeProject?.id) {
        updateActiveProject({ name: newName.trim() });
        // }
      }
      setIsEditing(false);
    },
    [activeProject, handleRename, updateActiveProject]
  );
  const handleInput = useCallback(() => {
    if (headingRef.current) {
      const newName = headingRef.current.textContent || "";
      setTempName(newName);
      handleRenameSubmit(newName);
    }
  }, [handleRenameSubmit]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRenameSubmit(tempName);
    } else if (e.key === "Escape") {
      setTempName(activeProject?.name || "");
      setIsEditing(false);
    }
  };
  useEffect(() => {
    if (headingRef.current && activeProject) {
      headingRef.current.textContent = activeProject.name || "";
    }
  }, [activeProject]);

  function onChange(editorState: EditorState) {
    editorState.read(() => {
      // Read the contents of the EditorState here.
      const root = $getRoot();
      const selection = $getSelection();

      console.log(root, selection);
    });
  }

  const initialConfig = {
    namespace: "MyEditor",
    theme: notionTheme,
    // editable: false,
    // theme,
    onError,
  };
  const handleBlur = useCallback(() => {
    if (headingRef.current) {
      const newName = headingRef.current.textContent?.trim() || "";
      if (newName && newName !== activeProject?.name) {
        handleRename(activeProject?.id || "", newName); // Sync to database
        updateActiveProject({ name: newName }); // Update state
      }
    }
  }, [
    handleRename,
    updateActiveProject,
    activeProject?.name,
    activeProject?.id,
  ]);
  const placeholder = "Untitled Project";
  return (
    <>
      <div className="mx-auto max-w-2xl  ">
        <div className="flex items-start pb-48">
          <button
            className="flex items-center justify-center w-9 h-9 rounded-md cursor-pointer relative z-[1] m-1 transition-colors hover:bg-neutral-700 focus:outline-none"
            aria-label="Change page icon"
          >
            <div className="w-9 h-9 flex items-center justify-center">
              {activeProject?.icon ? (
                <div
                  className="relative w-9 h-9"
                  style={{
                    fontSize: "36px",
                    lineHeight: "1",
                  }}
                >
                  <Image
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    alt={activeProject.icon}
                    src={activeProject.icon}
                  />
                </div>
              ) : (
                <span className="text-2xl">🔖</span> // Default icon
              )}
            </div>
          </button>

          {/* Editable Heading Section */}
          <h1
            className="scroll-m-2 text-4xl font-extrabold tracking-tight lg:text-5xl outline-none w-full h-10 py-2"
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            // onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            ref={headingRef}
          >
            {(activeProject?.children?.length === 0 &&
              activeProject?.children[0].name) ||
              "Untitled Project"}
          </h1>
        </div>
        <LexicalComposer initialConfig={initialConfig}>
          <FloatingTextFormatToolbarPlugin
            setIsLinkEditMode={setIsLinkEditMode}
          />
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="outline-none h-0 prose min-h-[calc(100vh-300px)] prose prose-slate dark:prose-invert max-w-none" />
            }
            // placeholder={
            //   <div className="absolute top-[1.525rem] left-[1rem] text-muted-foreground pointer-events-none">
            //     {`Type '/ ' for commands...`}
            //   </div>
            // }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <MyOnChangePlugin onChange={onChange} />

          {/* Add new plugins here */}
          {/* <ListPlugin />
      <CheckListPlugin />
      <LinkPlugin /> */}
          {/* Add more plugins as needed */}
        </LexicalComposer>
      </div>
    </>
  );
};

export default Page;

export const notionTheme = {
  ltr: "text-left",
  rtl: "text-right",
  paragraph: "mb-2",
  quote: "border-l-4 border-muted pl-4 my-4",
  heading: {
    h1: "text-4xl font-bold mb-4",
    h2: "text-3xl font-bold mb-3",
    h3: "text-2xl font-bold mb-2",
    h4: "text-xl font-bold mb-2",
    h5: "text-lg font-bold mb-2",
    h6: "text-base font-bold mb-2",
  },
  list: {
    nested: {
      listitem: "ml-4",
    },
    ol: "list-decimal ml-4 my-2",
    ul: "list-disc ml-4 my-2",
    listitem: "ml-4",
    listitemChecked: "ml-4 line-through",
    listitemUnchecked: "ml-4",
  },
  link: "text-primary underline",
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
    underlineStrikethrough: "underline line-through",
    code: "bg-muted rounded px-1 py-0.5 font-mono text-sm",
  },
  code: "bg-muted p-4 rounded-lg font-mono text-sm my-4",
};
