// components/editor/Editor.tsx
import { EditorState, LexicalNode } from "lexical";
import { useEffect, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import "./editor.css";
// Import custom nodes
// import MentionNode from "./nodes/MentionNode";

// Additional node imports you might need
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableNode, TableCellNode, TableRowNode } from "@lexical/table";
import { ListNode, ListItemNode } from "@lexical/list";
import { CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { MentionNode } from "@/components/editor/nodes/MentionNode";
import ToolbarPlugin from "@/components/editor/plugins/ToolBar/ToolBarPlugin";
import FloatingTextFormatToolbarPlugin from "@/components/editor/plugins/FloatingTextFormatToolbarPlugin";
import ComponentPickerMenuPlugin from "@/components/editor/plugins/ComponentPickerPlugin";
import DraggableBlockPlugin from "@/components/editor/plugins/DraggableBlock";
import TableActionMenuPlugin from "@/components/editor/plugins/TableActionMenuPlugin";
import { MentionPlugin } from "@/components/editor/plugins/MentionPlugin/MentionPlugin";
import { CharacterCountPlugin } from "@/components/editor/plugins/CharacterCountPlugin/CharacterCountPlugin";
import { LayoutContainerNode } from "@/components/editor/nodes/LayoutContainerNode";
import { EmojiNode } from "@/components/editor/nodes/EmojiNode";
import { PageBreakNode } from "@/components/editor/nodes/PageBreakNode";
import { LayoutItemNode } from "@/components/editor/nodes/LayoutItemNode";
import PageBreakPlugin from "@/components/editor/plugins/PageBreakPlugin";
import { CollapsibleContentNode } from "@/components/editor/plugins/CollapsiblePlugin/CollapsibleContentNode";
import CollapsiblePlugin from "@/components/editor/plugins/CollapsiblePlugin";
import { CollapsibleTitleNode } from "@/components/editor/plugins/CollapsiblePlugin/CollapsibleTitleNode";
import { useSettings } from "@/context/SettingsContext";
import { PollNode } from "@/components/editor/nodes/PollNode";
import PollPlugin from "@/components/editor/plugins/PollPlugin";
import { LayoutPlugin } from "@/components/editor/plugins/LayoutPlugin/LayoutPlugin";
import { CAN_USE_DOM } from "@/lib/utils/lexical/can-use-DOM";
import TableHoverActionsPlugin from "@/components/editor/plugins/TableHoverActionsPlugin";
import DragDropPaste from "@/components/editor/plugins/DragDropPastePlugin";

const theme = {
  ltr: "text-left",
  rtl: "text-right",
  paragraph: "relative mb-2 [&_*]:relative",
  quote: "border-l-4  border-muted pl-4 my-4",
  heading: {
    h1: "relative text-4xl font-bold mb-4",
    h2: "relative text-3xl font-bold mb-3",
    h3: "relative text-2xl font-bold mb-2",
    h4: "relative text-xl font-bold mb-2",
    h5: "relative text-lg font-bold mb-2",
    h6: "relative text-base font-bold mb-2",
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
  hashtag:
    "text-primary underline bg-muted p-4 rounded-lg font-mono text-sm my-4",
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
  tableWrapper: "w-full overflow-x-auto",
  codeHighlight: {
    language: "language-",
    theme: "theme-",
  },
  table: "w-full border-collapse",
  tableCell: "border border-muted p-2",
  tableRow: "border-b border-muted",
  horizontalRule: "my-4 border-t border-muted",
};

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

  const initialConfig = {
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
    // editorState: initialContent,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative">
        <ToolbarPlugin />

        <div className="editor-container relative">
          <RichTextPlugin
            contentEditable={
              <div className="editor-scroller">
                <div className="editor relative" ref={onRef}>
                  <ContentEditable className="outline-none min-h-[calc(100vh-300px)] prose dark:prose-invert max-w-none px-8 py-4" />
                </div>
              </div>
            }
            placeholder={
              <div className="absolute top-[12px] left-[12px] text-muted-foreground/60 pointer-events-none">
                Type '/' for commands...
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
          <PollPlugin />
          <MentionPlugin />
          <LayoutPlugin />
          <PageBreakPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
}
