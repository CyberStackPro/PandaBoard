import { cn } from "@/lib/utils";

// components/sidebar/resize-handle.tsx
interface ResizeHandleProps {
  isResizing: boolean;
  onResizeStart: () => void;
}

export const ResizeHandle = ({
  isResizing,
  onResizeStart,
}: ResizeHandleProps) => {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      onMouseDown={onResizeStart}
      className={cn(
        "absolute right-0 top-0 h-full w-1 cursor-ew-resize bg-primary/10 opacity-0 transition",
        "group-hover/sidebar:opacity-100",
        isResizing && "opacity-100"
      )}
    />
  );
};
