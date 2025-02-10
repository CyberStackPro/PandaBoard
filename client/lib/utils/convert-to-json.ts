// src/lib/utils/convert-to-json.ts
import { EditorState } from "lexical";
// import { any } from "@/blocks/dto/block.dto"; // Adjust path if needed
import { $getRoot } from "lexical";

export function convertEditorStateToBlocks(
  editorState: EditorState,
  documentId: string
): any[] {
  const blocks: any[] = [];
  let sortOrder = 0;

  // function onChange(editorState: EditorState) {
  //   editorState.read(() => {
  //     // Read the contents of the EditorState here.
  //     const root = $getRoot();
  //     const selection = $getSelection();
  //     // Convert the editor state to JSON and store it in localStorage
  //     const editorStateJson = JSON.stringify(editorState.toJSON());
  //     localStorage.setItem("editor-content", editorStateJson);
  //     console.log("ROOTED", editorStateJson);
  //   });

  editorState.read(() => {
    const rootNode = $getRoot();
    rootNode.getChildren().forEach((lexicalNode) => {
      const lexicalNodeJSON = lexicalNode.exportJSON(); // Get Lexical's JSON for the node
      const blockType = getBlockTypeFromLexicalNode(lexicalNodeJSON.type); // Determine block type

      if (blockType) {
        const block: any = {
          document_id: documentId,
          type: blockType,
          content: lexicalNodeJSON, // Directly use Lexical's JSON as 'content'
          sort_order: sortOrder++,
        };
        blocks.push(block);
      }
    });
  });

  return blocks;
}

// Helper function to map Lexical node types to your blockTypeEnum
function getBlockTypeFromLexicalNode(lexicalType: string): any["type"] | null {
  switch (lexicalType) {
    case "paragraph":
    case "text": // Treat 'text' nodes as 'text' blocks as well for simplicity
      return "text";
    case "heading":
      return "heading";
    case "list":
      return "list";
    case "quote":
      return "quote";
    case "code":
      return "code";
    case "image":
      return "image";
    default:
      return "text"; // Default to 'text' for unknown types, or handle differently
  }
}
