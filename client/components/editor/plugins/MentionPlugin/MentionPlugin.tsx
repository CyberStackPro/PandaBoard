import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState } from "react";
import { TextNode } from "lexical";
import { $createMentionNode } from "@/components/editor/nodes/MentionNode";

export function MentionPlugin() {
  const [editor] = useLexicalComposerContext();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mentionPosition, setMentionPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    return editor.registerTextContentListener((text) => {
      // Check if the last character typed is '@'
      if (text.endsWith("@")) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          setMentionPosition({
            x: rect.left,
            y: rect.bottom,
          });
          setShowSuggestions(true);
        }
      } else {
        setShowSuggestions(false);
      }
    });
  }, [editor]);

  const insertMention = (username: string) => {
    editor.update(() => {
      const mention = $createMentionNode(username);
      const textNode = mention.getPreviousSibling();
      if (textNode instanceof TextNode) {
        // Remove the '@' character
        textNode.splitText(textNode.getTextContentSize() - 1);
        textNode.remove();
      }
      mention.select();
      setShowSuggestions(false);
    });
  };

  if (!showSuggestions) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: mentionPosition.x,
        top: mentionPosition.y,
      }}
      className="mention-suggestions"
    >
      <div onClick={() => insertMention("john")}>John Doe</div>
      <div onClick={() => insertMention("jane")}>Jane Smith</div>
    </div>
  );
}

// components/editor/nodes/MentionNode.tsx
