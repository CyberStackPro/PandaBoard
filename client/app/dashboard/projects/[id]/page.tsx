"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useProjectActions } from "@/hooks/project/use-project-actions";
import { cn } from "@/lib/utils";
import { useStore } from "@/stores/store";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { $getRoot, $getSelection, EditorState } from "lexical";
import { ImageIcon, MessageSquare, Plus } from "lucide-react";
import Image from "next/image";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import FloatingTextFormatToolbarPlugin from "../../_components/lexical/plugins/FloatingTextFormatToolbarPlugin";
import debounce from "lodash.debounce";

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
interface PageProps {
  params: {
    id: string;
  };
}

const Page = () => {
  const userId = "06321aa5-78d2-450c-9892-fd5277775fae";

  const [isEditing, setIsEditing] = useState(false);
  const activeProject = useStore((state) => state.activeProject);
  const updateActiveProject = useStore((state) => state.updateActiveProject);
  const [tempName, setTempName] = useState(activeProject?.name || "");
  const headingRef = useRef<HTMLDivElement>(null);
  const [editorState, setEditorState] = useState();
  const [isLinkEditMode, setIsLinkEditMode] = useState(false);
  const { handleRename } = useProjectActions(userId);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverPosition, setCoverPosition] = useState(0);
  const [isDraggingCover, setIsDraggingCover] = useState(false);
  // const [showControls, setShowControls] = useState(false);

  const debouncedRename = useMemo(
    () =>
      debounce(async (id: string, newName: string) => {
        try {
          await handleRename(id, newName);
          updateActiveProject({ name: newName });
        } catch (error) {
          // Revert to last known good state
          setTempName(activeProject?.name || "");
        }
      }, 300),
    [handleRename, updateActiveProject, activeProject?.name]
  );

  const handleCoverDragStart = (e: React.DragEvent) => {
    setIsDraggingCover(true);
  };
  const handleCoverDrag = (e: React.DragEvent) => {
    if (!isDraggingCover) return;

    const container = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - container.top;
    const percentage = Math.max(0, Math.min(100, (y / container.height) * 100));
    setCoverPosition(percentage);
  };

  const handleCoverDragEnd = () => {
    setIsDraggingCover(false);
  };

  const handleAddCover = () => {
    const newCover = prompt("Enter cover image URL:");
    if (newCover) setCoverImage(newCover);
  };

  const handleInput = useCallback(() => {
    if (headingRef.current) {
      const newName = headingRef.current.textContent || "";
      setTempName(newName);
      if (activeProject?.id) {
        debouncedRename(activeProject.id, newName);
      }
    }
  }, [activeProject?.id, debouncedRename]);
  const handleBlur = useCallback(() => {
    const newName = tempName.trim();
    if (newName && newName !== activeProject?.name && activeProject?.id) {
      handleRename(activeProject.id, newName);
      updateActiveProject({ name: newName });
    }
  }, [tempName, activeProject, handleRename, updateActiveProject]);

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

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLHeadingElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        e.currentTarget.blur();
      } else if (e.key === "Escape") {
        e.preventDefault();
        setTempName(activeProject?.name || "");
        e.currentTarget.blur();
      }
    },
    [activeProject?.name]
  );
  // Cleanup

  useEffect(() => {
    if (headingRef.current && activeProject) {
      headingRef.current.textContent = activeProject.name || "";
      setTempName(activeProject?.name || "");
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

  const handleAddIconClick = useCallback(() => {
    setIsLinkEditMode(true);
    console.log("icon");
  }, []);
  const handleAddCommentClick = useCallback(() => {
    console.log("comment");
  }, []);

  const placeholder = "Untitled Project";

  return (
    <div className="pb-[30vh] h-screen overflow-y-auto">
      <div className="layout-full relative" style={{ isolation: "isolate" }}>
        {/* Cover Image Section */}
        <div
          className={cn(
            "relative w-full max-h-[280px] group",
            coverImage && "h-[25vh] "
          )}
          onMouseEnter={() => setIsDraggingCover(true)}
          onMouseLeave={() => setIsDraggingCover(false)}
        >
          {coverImage ? (
            <div
              className={cn("w-full h-full  relative overflow-hidden", {
                "cursor-grabbing": isDraggingCover,
              })}
              draggable={!!coverImage}
              onDragStart={handleCoverDragStart}
              onDrag={handleCoverDrag}
              onDragEnd={handleCoverDragEnd}
            >
              {coverImage ? (
                <div className="grid w-full h-full">
                  <Image
                    src={coverImage}
                    alt="Cover"
                    layout="fill"
                    className="object-cover transition-all duration-300 ease-in-out"
                    style={{ objectPosition: `center ${coverPosition}%` }}
                  />
                </div>
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-primary/10 to-primary/5 flex items-center justify-center">
                  <span className="text-muted-foreground">No Cover Image</span>
                </div>
              )}
            </div>
          ) : null}

          {/* Drag Indicator */}
          {/* <div
            className={cn(
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
              "bg-black/40 text-white px-6 py-1.5 rounded-md text-sm",
              "transition-opacity duration-200",
              isDraggingCover ? "opacity-1" : "opacity-100"
            )}
          >
            {isDraggingCover ? "Drag to change cover" : ""}
          </div> */}

          {/* Cover Controls in the cover image */}
          <div
            className={cn(
              "absolute bottom-4 right-4 flex gap-1",
              "bg-background/90 backdrop-blur-sm rounded-lg shadow-sm",
              "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            )}
          >
            {coverImage && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddCover}
                className="text-sm hover:bg-background/90"
              >
                {coverImage ? "Change Cover" : "Add Cover"}
              </Button>
            )}

            {coverImage && (
              <>
                <Separator
                  orientation="vertical"
                  className="h-[20px] my-auto"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm hover:bg-background/90"
                  onClick={() => setIsDraggingCover(true)}
                >
                  Reposition
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Main Content Section */}
        <div className="max-w-[765px] container mx-auto px-4 mt-16">
          {/* Page controls */}

          <div className="flex flex-col gap-2 items-start">
            <Button
              variant={"ghost"}
              size={"sm"}
              className="relative flex items-center justify-center size-16 rounded-md cursor-pointer transition-colors hover:bg-muted focus:outline-none"
              aria-label="Change page icon"
            >
              {/* <div className="size-10 absolute  flex items-center justify-center"> */}
              {activeProject?.icon ? (
                <Image
                  className="absolute top-0 left-0 rounded-full object-cover"
                  alt={activeProject.icon}
                  src={"Project Icon"}
                  width={32}
                  height={32}
                />
              ) : (
                <span className="text-2xl">🎉</span> // Default icon
              )}
              {/* </div> */}
            </Button>

            <div className="flex items-center   opacity-0 hover:opacity-50 transition-opacity duration-300 ease-in-out">
              {!activeProject?.icon && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add icon
                </Button>
              )}
              {!coverImage && (
                <Button
                  onClick={handleAddCover}
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Add Cover
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddCommentClick}
                className="text-muted-foreground"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Add comment
              </Button>
            </div>

            {/* Editable Heading Section */}
            <h1
              ref={headingRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              data-placeholder="Untitled Project"
              className={cn(
                "outline-none w-full px-1 whitespace-pre-wrap break-words",
                "text-4xl font-bold",
                "empty:before:content-[attr(data-placeholder)]",
                "empty:before:text-muted-foreground/60",
                "focus:ring-1 focus:ring-primary/20 rounded-sm"
              )}
            >
              {tempName}
            </h1>
          </div>
          <LexicalComposer initialConfig={initialConfig}>
            <FloatingTextFormatToolbarPlugin
              setIsLinkEditMode={setIsLinkEditMode}
            />
            <RichTextPlugin
              contentEditable={
                <ContentEditable className="outline-none  min-h-[calc(100vh-300px)] prose  dark:prose-invert max-w-none relative" />
              }
              placeholder={
                <div className="absolute top-[24px] left-[12px] text-muted-foreground/60 pointer-events-none select-none">
                  Type '/' for commands...
                </div>
              }
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
      </div>
    </div>
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
