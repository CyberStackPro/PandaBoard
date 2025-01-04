import { EditorState } from "lexical";
import { useEffect, useState } from "react";

import { LexicalComposer } from "@lexical/react/LexicalComposer";

import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import FloatingTextFormatToolbarPlugin from "./plugins/FloatingTextFormatToolbarPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import ToolbarPlugin from "./plugins/ToolBar/ToolBarPlugin";
import DraggableBlockPlugin from "./plugins/DraggableBlock";
import { MentionNode } from "./plugins/MentionPlugins/MentionNode";
import MentionPlugin from "./plugins/MentionPlugins/MentionPlugin";
import ComponentPickerMenuPlugin from "./plugins/ComponentPickerPlugin";
import YouTubePlugin from "./plugins/YouTubePlugin";
import TwitterPlugin from "./plugins/TwitterPlugin";
import { TablePlugin } from "./plugins/TablePlugin";
import TableActionMenuPlugin from "./plugins/TableActionMenuPlugin";
import FigmaPlugin from "./plugins/FigmaPlugin";
import ShortcutsPlugin from "./plugins/ShortcutsPlugin";
import useLexicalEditable from "@lexical/react/useLexicalEditable";

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

function MyCustomAutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Focus the editor when the effect fires!
    editor.focus();
  }, [editor]);

  return null;
}

function MyOnChangePlugin({ onChange }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      onChange(editorState);
    });
  }, [editor, onChange]);
  return null;
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: unknown) {
  console.error(error);
}

interface EditorProps {
  initialContent: string;
  onChange: (editorState: EditorState) => void;
}

export function Editor({ initialContent, onChange }: EditorProps) {
  //   const [editor] = useLexicalComposerContext();
  //   const isEditable = useLexicalEditable();
  //   const [activeEditor, setActiveEditor] = useState(editor);
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);
  const initialConfig = {
    namespace: "MyEditor",
    theme: notionTheme,
    // nodes: [MentionNode],
    onError: (error: unknown) => console.error(error),
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative">
        <ToolbarPlugin
        //   editor={editor}
        //   activeEditor={activeEditor}
        //   setActiveEditor={setActiveEditor}
        //   setIsLinkEditMode={setIsLinkEditMode}
        />
        <FloatingTextFormatToolbarPlugin
          setIsLinkEditMode={setIsLinkEditMode}
        />
        {/* <ToolbarPlugin /> */}
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="outline-none min-h-[calc(100vh-300px)] prose dark:prose-invert max-w-none" />
          }
          placeholder={
            <div className="absolute top-0 left-3 text-muted-foreground/60 pointer-events-none">
              {"Type '/' for commands..."}
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <ComponentPickerMenuPlugin />
        <OnChangePlugin onChange={onChange} />
        <DraggableBlockPlugin />
        {/* <YouTubePlugin /> */}
        {/* <TwitterPlugin /> */}
        {/* <TablePlugin /> */}
        <TableActionMenuPlugin />
        <MyCustomAutoFocusPlugin />
        {/* <FigmaPlugin /> */}
        {/* <ShortcutsPlugin
        //   editor={editor}
        //   setIsLinkEditMode={setIsLinkEditMode}
        /> */}
        <MentionPlugin />
      </div>
    </LexicalComposer>
  );
}
