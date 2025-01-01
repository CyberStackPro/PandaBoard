"use client";
import React, { useEffect, useState } from "react";
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
} from "lexical";
import { $createListItemNode, $createListNode } from "@lexical/list";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $createLinkNode } from "@lexical/link";

function MyOnChangePlugin({ onChange }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      onChange(editorState);
    });
  }, [editor, onChange]);
  return null;
}
function $prepopulatedRichText() {
  const root = $getRoot();
  if (root.getFirstChild() === null) {
    const heading = $createHeadingNode("h1");
    heading.append($createTextNode("Welcome to the playground"));
    root.append(heading);
    const quote = $createQuoteNode();
    quote.append(
      $createTextNode(
        `In case you were wondering what the black box at the bottom is – it's the debug view, showing the current state of the editor. ` +
          `You can disable it by pressing on the settings control in the bottom-left of your screen and toggling the debug view setting.`
      )
    );
    root.append(quote);
    const paragraph = $createParagraphNode();
    paragraph.append(
      $createTextNode("The playground is a demo environment built with "),
      $createTextNode("@lexical/react").toggleFormat("code"),
      $createTextNode("."),
      $createTextNode(" Try typing in "),
      $createTextNode("some text").toggleFormat("bold"),
      $createTextNode(" with "),
      $createTextNode("different").toggleFormat("italic"),
      $createTextNode(" formats.")
    );
    root.append(paragraph);
    const paragraph2 = $createParagraphNode();
    paragraph2.append(
      $createTextNode(
        "Make sure to check out the various plugins in the toolbar. You can also use #hashtags or @-mentions too!"
      )
    );
    root.append(paragraph2);
    const paragraph3 = $createParagraphNode();
    paragraph3.append(
      $createTextNode(`If you'd like to find out more about Lexical, you can:`)
    );
    root.append(paragraph3);
    const list = $createListNode("bullet");
    list.append(
      $createListItemNode().append(
        $createTextNode(`Visit the `),
        $createLinkNode("https://lexical.dev/").append(
          $createTextNode("Lexical website")
        ),
        $createTextNode(` for documentation and more information.`)
      ),
      $createListItemNode().append(
        $createTextNode(`Check out the code on our `),
        $createLinkNode("https://github.com/facebook/lexical").append(
          $createTextNode("GitHub repository")
        ),
        $createTextNode(`.`)
      ),
      $createListItemNode().append(
        $createTextNode(`Playground code can be found `),
        $createLinkNode(
          "https://github.com/facebook/lexical/tree/main/packages/lexical-playground"
        ).append($createTextNode("here")),
        $createTextNode(`.`)
      ),
      $createListItemNode().append(
        $createTextNode(`Join our `),
        $createLinkNode("https://discord.com/invite/KmG4wQnnD9").append(
          $createTextNode("Discord Server")
        ),
        $createTextNode(` and chat with the team.`)
      )
    );
    root.append(list);
    const paragraph4 = $createParagraphNode();
    paragraph4.append(
      $createTextNode(
        `Lastly, we're constantly adding cool new features to this playground. So make sure you check back here when you next get a chance :).`
      )
    );
    root.append(paragraph4);
  }
}

function onError(error: unknown) {
  console.error(error);
}
const Page = ({ params }: { params: { id: string } }) => {
  const [editorState, setEditorState] = useState();
  const [isLinkEditMode, setIsLinkEditMode] = useState(false);

  function onChange(editorState) {
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
  return (
    <div className="mx-auto max-w-4xl  ">
      <LexicalComposer initialConfig={initialConfig}>
        <FloatingTextFormatToolbarPlugin
          setIsLinkEditMode={setIsLinkEditMode}
        />
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="outline-none prose min-h-[calc(100vh-300px)] prose prose-slate dark:prose-invert max-w-none" />
          }
          placeholder={
            <div className="absolute top-[1.525rem] left-[5.125rem] text-muted-foreground">
              {`Type '/ ' for commands...`}
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
