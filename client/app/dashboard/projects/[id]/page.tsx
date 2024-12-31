"use client";
import React, { useEffect, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND } from "lexical";
import FloatingTextFormatToolbarPlugin from "../../_components/lexical/plugins/FloatingTextFormatToolbarPlugin";

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
  const [editorState, setEditorState] = useState();
  const [isLinkEditMode, setIsLinkEditMode] = useState(false);

  function onChange(editorState) {
    const editorStateJSON = editorState.toJSON();
    setEditorState(JSON.stringify(editorStateJSON));
  }

  const initialConfig = {
    namespace: "MyEditor",
    theme: notionTheme,
    // editable: false,
    // theme,
    onError,
  };
  return (
    <div className="mx-auto max-w-4xl ">
      <LexicalComposer initialConfig={initialConfig}>
        <FloatingTextFormatToolbarPlugin
          setIsLinkEditMode={setIsLinkEditMode}
        />
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="outline-none min-h-[calc(100vh-300px)] prose prose-slate dark:prose-invert max-w-none" />
          }
          placeholder={
            <div className="absolute top-[1.125rem] left-[3.125rem] text-muted-foreground">
              {`Type ' / ' for commands...`}
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <MyOnChangePlugin onChange={onChange} />
      </LexicalComposer>
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
