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
import MarkdownPlugin from "@/components/editor/plugins/MarkdownShortcutPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";

const theme = {
  // Text direction
  ltr: "text-left",
  rtl: "text-right",

  // Block styles
  paragraph: "text-muted-foreground mb-2 min-h-[1.5em] leading-relaxed",
  quote: "border-l-4 border-muted pl-4 my-4 italic text-muted-foreground",

  // Headings with modern spacing and sizing
  heading: {
    h1: "text-4xl font-bold mb-4 mt-8 text-foreground tracking-tight",
    h2: "text-3xl font-bold mb-3 mt-6 text-foreground tracking-tight",
    h3: "text-2xl font-bold mb-2 mt-4 text-foreground tracking-tight",
    h4: "text-xl font-bold mb-2 mt-4 text-foreground",
    h5: "text-lg font-bold mb-2 mt-2 text-foreground",
    h6: "text-base font-bold mb-2 mt-2 text-foreground",
  },

  // List styles with better hierarchy
  list: {
    nested: {
      listitem: "ml-6 relative",
    },
    checklist: "list-none ml-2 my-2",
    ol: "list-decimal ml-6 my-2 relative space-y-1",
    ul: "list-disc ml-6 my-2 relative space-y-1",
    listitem: "ml-2 relative",
    listitemChecked: "ml-2 line-through text-muted-foreground relative",
    listitemUnchecked: "ml-2 relative",
    olDepth: [
      "list-decimal",
      "list-[lower-alpha]",
      "list-[lower-roman]",
      "list-[upper-alpha]",
      "list-[upper-roman]",
    ],
    checkbox: "mr-2 h-4 w-4 rounded border-muted",
  },

  // Enhanced code highlighting
  code: "bg-muted/50 p-4 rounded-lg font-mono text-sm my-4 relative overflow-x-auto border border-border",
  codeHighlight: {
    atrule: "text-purple-500",
    attr: "text-purple-500",
    boolean: "text-blue-500",
    builtin: "text-teal-500",
    cdata: "text-muted-foreground",
    char: "text-green-500",
    class: "text-yellow-500",
    "class-name": "text-yellow-500",
    comment: "italic text-muted-foreground",
    constant: "text-blue-500",
    deleted: "text-red-500",
    doctype: "text-muted-foreground",
    entity: "text-yellow-500",
    function: "text-green-500",
    important: "text-purple-500",
    inserted: "text-green-500",
    keyword: "text-purple-500",
    namespace: "text-yellow-500",
    number: "text-blue-500",
    operator: "text-foreground",
    prolog: "text-muted-foreground",
    property: "text-blue-500",
    punctuation: "text-muted-foreground",
    regex: "text-teal-500",
    selector: "text-green-500",
    string: "text-green-500",
    symbol: "text-blue-500",
    tag: "text-red-500",
    url: "text-blue-500",
    variable: "text-purple-500",
  },

  // Text formatting
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline decoration-[0.5px] underline-offset-[2px]",
    strikethrough: "line-through",
    underlineStrikethrough: "underline line-through",
    subscript: "vertical-align-sub text-[0.8em]",
    superscript: "vertical-align-super text-[0.8em]",
    code: "bg-muted/50 rounded-md px-1.5 py-0.5 font-mono text-sm border border-border",
    capitalize: "capitalize",
    lowercase: "lowercase",
    uppercase: "uppercase",
  },

  // Table styles
  table: "w-full border-collapse my-4 text-sm",
  tableCell: "border border-border p-3 min-w-[100px] relative align-top",
  tableCellHeader: "font-bold bg-muted/50",
  tableHeader: "bg-muted/50 font-bold text-left p-3 border border-border",
  tableRow: "border-b border-border [&:last-child]:border-0",
  tableScrollableWrapper: "w-full overflow-x-auto my-4 relative",
  tableCellResizer:
    "absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-primary/20",
  tableSelected: "ring-2 ring-primary ring-offset-2",
  tableCellSelected: "relative bg-primary/10",

  // Special elements
  horizontalRule: "my-8 border-t border-border",
  image: "max-w-full h-auto my-4 rounded-lg",
  inlineImage: "max-h-[1.2em] align-text-bottom",

  // Layout
  layoutContainer: "flex flex-col md:flex-row gap-4 my-4",
  layoutItem: "flex-1 min-w-0",

  // Additional elements
  embedBlock: {
    base: "my-4 w-full rounded-lg border border-border p-4",
    focus: "ring-2 ring-primary ring-offset-2",
  },

  // Utility styles
  indent: "ml-4",
  hashtag:
    "text-primary underline bg-muted/50 px-1.5 py-0.5 rounded-md font-mono text-sm",
  link: "text-primary underline decoration-[0.5px] hover:text-primary/80 transition-colors cursor-pointer",
  characterLimit: "text-sm text-muted-foreground absolute bottom-2 right-2",
  mark: "bg-yellow-200 dark:bg-yellow-800/50 px-0.5 rounded-sm",
  markOverlap: "bg-purple-200 dark:bg-purple-800/50",
  specialText: "text-primary",

  // Editor specific
  blockCursor: "border-l-2 border-primary",
  tab: "ml-8",
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
      // CheckListNode,
      // CheckListItemNode,
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
      // Special
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
              <div className="editor-scroller ">
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
          {/* <MarkdownShortcutPlugin /> */}
        </div>
      </div>
    </LexicalComposer>
  );
}
