// hooks/use-editor-content.ts
import { EditorState } from "lexical";
import { useCallback, useMemo, useRef } from "react";
import { Block, documentsService } from "@/services/document.service";
// import { convertEditorStateToBlocks } from '@/utils/lexical';
import { debounce } from "lodash-es";
import { convertEditorStateToBlocks } from "@/lib/utils/convert-to-json";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useEditorContent(documentId: string) {
  const documents = {
    // data: {
    //   blocks: []
    // }
  };
  const { mutateAsync: saveBlocks } = useMutation({
    mutationFn: (blocks: Block[]) =>
      axios.post(`http://localhost:4000/api/v1/blocks/create`, { blocks }),
  });

  const debouncedSave = useMemo(
    () =>
      debounce(
        async (editorState: EditorState) => {
          try {
            const blocks = convertEditorStateToBlocks(editorState, documentId);
            if (blocks.length > 0) {
              await saveBlocks(blocks);
            }
          } catch (error) {
            console.error("Auto-save failed:", error);
            // Consider adding error reporting here
          }
        },
        1000,
        { leading: false, trailing: true }
      ),
    [documentId, saveBlocks]
  );

  const handleEditorChange = useCallback(
    (editorState: EditorState) => {
      debouncedSave(editorState);
    },
    [debouncedSave]
  );
  return { handleEditorChange };
}

// export function fetchEditorContent(documentId: string) {
//   const {} = useQuery({
//     queryKey: ["editor-content", documentId],
//     queryFn: async () => {
//       const blocks = await axios.get(
//         "http://localhost:4000/api/v1/documents/create"
//       );
//       return blocks;
//     }} )
// }
