"use client";
import React from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";

// function onChange(editorState) {
//   editorState.read(() => {
//     // Handle editor state changes
//     const content = editorState.toJSON();
//     console.log(content);
//   });
// }
const theme = {
  // Define your editor theme here
};
function onError(error: unknown) {
  console.error(error);
}
const page = ({ params }: { params: { id: string } }) => {
  const initialConfig = {
    namespace: "MyEditor",
    // theme,
    onError,
  };
  return (
    <>
      <div>page {params.id}</div>
      <LexicalComposer initialConfig={initialConfig}>
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="bg-card text-foreground p-4 w-full h-screen rounded-md border-0 ring-0 focus:outline-none shadow-md" />
          }
          placeholder={
            <div className="text-muted">Enter some text... or type /</div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
      </LexicalComposer>
    </>
  );
};

export default page;
