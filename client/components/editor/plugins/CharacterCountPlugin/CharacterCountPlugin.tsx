// components/editor/plugins/CharacterCountPlugin.tsx
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState } from "react";
import { $getRoot } from "lexical";

export function CharacterCountPlugin() {
  const [editor] = useLexicalComposerContext();
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    // Subscribe to editor changes
    return editor.registerUpdateListener(({ editorState }) => {
      // Read the contents of the EditorState
      editorState.read(() => {
        const root = $getRoot();
        const text = root.getTextContent();
        setCharCount(text.length);
      });
    });
  }, [editor]);

  return <div className="character-counter">Characters: {charCount}</div>;
}

// components/editor/plugins/MentionPlugin.tsx
