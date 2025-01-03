import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createTextNode, $getSelection, $setSelection } from "lexical";
import React, { useEffect } from "react";
import { MentionNode } from "./MentionNode";

const MentionPlugin = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const insertMention = (id: string, text: string) => {
      editor.update(() => {
        const selection = $getSelection();
        const mentionNode = new MentionNode(id, text);
        selection?.insertNodes([mentionNode, $createTextNode(" ")]);
        $setSelection(null); // Deselect after insertion
      });
    };

    // Simulate mention insertion on `@mention`
    editor.registerCommand(
      "INSERT_MENTION_COMMAND",
      (payload) => {
        insertMention(payload.id, payload.text);
        return true;
      },
      0
    );
  }, [editor]);

  return null;
};

export default MentionPlugin;
