// components/editor/Editor.tsx
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { EditorState } from "lexical";
import { useEffect, useMemo, useState } from "react";
import "./editor.css";
// Import custom nodes
// import MentionNode from "./nodes/MentionNode";

// Additional node imports you might need
import { MentionNode } from "@/components/editor/nodes/MentionNode";
import { CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
// import ToolbarPlugin from "@/components/editor/plugins/ToolBar/ToolBarPlugin";
import { EmojiNode } from "@/components/editor/nodes/EmojiNode";
import { LayoutContainerNode } from "@/components/editor/nodes/LayoutContainerNode";
import { LayoutItemNode } from "@/components/editor/nodes/LayoutItemNode";
import { PageBreakNode } from "@/components/editor/nodes/PageBreakNode";
import { PollNode } from "@/components/editor/nodes/PollNode";
import { CharacterCountPlugin } from "@/components/editor/plugins/CharacterCountPlugin/CharacterCountPlugin";
import { CollapsibleContentNode } from "@/components/editor/plugins/CollapsiblePlugin/CollapsibleContentNode";
import { CollapsibleTitleNode } from "@/components/editor/plugins/CollapsiblePlugin/CollapsibleTitleNode";
import ComponentPickerMenuPlugin from "@/components/editor/plugins/ComponentPickerPlugin";
import DragDropPaste from "@/components/editor/plugins/DragDropPastePlugin";
import DraggableBlockPlugin from "@/components/editor/plugins/DraggableBlock";
import FloatingTextFormatToolbarPlugin from "@/components/editor/plugins/FloatingTextFormatToolbarPlugin";
import { LayoutPlugin } from "@/components/editor/plugins/LayoutPlugin/LayoutPlugin";
import { MentionPlugin } from "@/components/editor/plugins/MentionPlugin/MentionPlugin";
import PageBreakPlugin from "@/components/editor/plugins/PageBreakPlugin";
import PollPlugin from "@/components/editor/plugins/PollPlugin";
import TableActionMenuPlugin from "@/components/editor/plugins/TableActionMenuPlugin";
import { CAN_USE_DOM } from "@/lib/utils/lexical/can-use-DOM";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import ToolbarPlugin from "@/components/editor/plugins/ToolBar/ToolBarPlugin";
import { theme } from "./theme";

// function AutoFocusPlugin() {
//   const [editor] = useLexicalComposerContext();
//   useEffect(() => {
//     editor.focus();
//   }, [editor]);
//   return null;
// }

interface EditorProps {
  initialContent?: string;
  onChange?: (editorState: EditorState) => void;
}

export function Editor({ initialContent, onChange }: EditorProps) {
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);
  const [isSmallWidthViewport, setIsSmallWidthViewport] =
    useState<boolean>(false);
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateViewPortWidth = () => {
      const isNextSmallWidthViewport =
        CAN_USE_DOM && window.matchMedia("(max-width: 1025px)").matches;

      if (isNextSmallWidthViewport !== isSmallWidthViewport) {
        setIsSmallWidthViewport(isNextSmallWidthViewport);
      }
    };
    updateViewPortWidth();
    window.addEventListener("resize", updateViewPortWidth);

    return () => {
      window.removeEventListener("resize", updateViewPortWidth);
    };
  }, [isSmallWidthViewport]);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  const initialConfig = useMemo(() => {
    let parsedContent = undefined;

    if (initialContent) {
      try {
        // Parse the JSON string into an object
        parsedContent = JSON.parse(initialContent);
      } catch (error) {
        console.error("Failed to parse initial content:", error);
      }
    }

    return {
      namespace: "MyEditor",
      theme,
      onError: (error: Error) => {
        console.error(error);
      },
      nodes: [
        HeadingNode,
        QuoteNode,
        ListNode,
        ListItemNode,
        CodeNode,
        TableNode,
        TableCellNode,
        TableRowNode,
        AutoLinkNode,
        PollNode,
        LinkNode,
        MentionNode,
        EmojiNode,
        PageBreakNode,
        CollapsibleContentNode,
        CollapsibleTitleNode,
        LayoutContainerNode,
        LayoutItemNode,
      ],
      editorState: parsedContent ? JSON.stringify(parsedContent) : undefined,
    };
  }, [initialContent]);

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative pt-2 ">
        {/* <ToolbarPlugin /> */}

        <div className="editor-container  relative">
          <RichTextPlugin
            contentEditable={
              <div className="editor-scroller  ">
                <div className="editor relative" ref={onRef}>
                  <ContentEditable className="outline-none min-h-[calc(100vh-300px)] prose dark:prose-invert max-w-none px-8 py-4" />
                </div>
              </div>
            }
            placeholder={
              <div className="absolute top-4 left-10 text-muted-foreground/60 pointer-events-none">
                {"Type '/' for commands..."}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />

          <HistoryPlugin />
          <DragDropPaste />

          <AutoFocusPlugin />
          <ComponentPickerMenuPlugin />
          {onChange && <OnChangePlugin onChange={onChange} />}
          {floatingAnchorElem && (
            <>
              <TableActionMenuPlugin anchorElem={floatingAnchorElem} />
            </>
          )}
          <CharacterCountPlugin />
          {floatingAnchorElem && !isSmallWidthViewport && (
            <>
              <DraggableBlockPlugin anchorElem={floatingAnchorElem} />

              {/* <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
                <FloatingLinkEditorPlugin
                  anchorElem={floatingAnchorElem}
                  isLinkEditMode={isLinkEditMode}
                  setIsLinkEditMode={setIsLinkEditMode}
                /> */}
              {/* <TableCellActionMenuPlugin
                  anchorElem={floatingAnchorElem}
                  cellMerge={true}
                /> */}
              {/* <TableHoverActionsPlugin anchorElem={floatingAnchorElem} /> */}
              <FloatingTextFormatToolbarPlugin
                anchorElem={floatingAnchorElem}
                setIsLinkEditMode={setIsLinkEditMode}
              />
            </>
          )}
          <ListPlugin />
          <CheckListPlugin />
          <PollPlugin />
          <MentionPlugin />
          <LayoutPlugin />
          <PageBreakPlugin />
          {/* <MarkdownShortcutPlugin /> */}
        </div>
      </div>
    </LexicalComposer>
  );
}
