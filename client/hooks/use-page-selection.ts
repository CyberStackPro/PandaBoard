// import { useState, useRef, useCallback, RefObject } from "react";

// interface SelectionRect {
//   left: number;
//   top: number;
//   width: number;
//   height: number;
// }

// export function usePageSelection(containerRef: RefObject<HTMLDivElement>) {
//   const [isSelecting, setIsSelecting] = useState(false);
//   const [selectionRect, setSelectionRect] = useState<SelectionRect | null>(
//     null
//   );
//   const startPos = useRef({ x: 0, y: 0 });

//   const handleMouseDown = useCallback((e: React.MouseEvent) => {
//     if (e.button !== 0) return; // Only handle left mouse button

//     // Check if the click is inside a contentEditable element
//     // const target = e.target as HTMLElement;
//     // if (
//     //   target.getAttribute("contenteditable") === "true" ||
//     //   target.closest('[contenteditable="true"]')
//     // ) {
//     //   return; // Don't initiate selection if clicking inside contentEditable
//     // }
//     const target = e.target as HTMLElement;
//     const isEditable =
//       target.hasAttribute("contenteditable") ||
//       target.closest('[contenteditable="true"]') ||
//       target.closest(".ContentEditable__root");

//     if (!isEditable) {
//       e.preventDefault();
//     }

//     setIsSelecting(true);
//     startPos.current = { x: e.clientX, y: e.clientY };
//     setSelectionRect(null);
//   }, []);

//   const handleMouseMove = useCallback(
//     (e: React.MouseEvent) => {
//       if (!isSelecting) return;

//       const currentPos = { x: e.clientX, y: e.clientY };
//       const containerRect = containerRef.current?.getBoundingClientRect();

//       if (containerRect) {
//         const left =
//           Math.min(startPos.current.x, currentPos.x) - containerRect.left;
//         const top =
//           Math.min(startPos.current.y, currentPos.y) - containerRect.top;
//         const width = Math.abs(currentPos.x - startPos.current.x);
//         const height = Math.abs(currentPos.y - startPos.current.y);

//         setSelectionRect({ left, top, width, height });
//       }
//     },
//     [isSelecting, containerRef]
//   );

//   const handleMouseUp = useCallback(() => {
//     setIsSelecting(false);
//   }, []);

//   return {
//     isSelecting,
//     selectionRect,
//     handleMouseDown,
//     handleMouseMove,
//     handleMouseUp,
//   };
// }
