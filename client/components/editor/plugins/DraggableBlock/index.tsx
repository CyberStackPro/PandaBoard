// components/editor/plugins/DraggableBlock/index.tsx
import { DraggableBlockPlugin_EXPERIMENTAL } from "@lexical/react/LexicalDraggableBlockPlugin";
import { useRef } from "react";
import { GripVertical } from "lucide-react"; // Assuming you're using lucide-react for icons

const DRAGGABLE_BLOCK_MENU_CLASSNAME = "draggable-block-menu";

function isOnMenu(element: HTMLElement): boolean {
  return !!element.closest(`.${DRAGGABLE_BLOCK_MENU_CLASSNAME}`);
}

export default function DraggableBlockPlugin({
  anchorElem = document.body,
}: {
  anchorElem?: HTMLElement;
}): JSX.Element {
  const menuRef = useRef<HTMLDivElement>(null);
  const targetLineRef = useRef<HTMLDivElement>(null);

  return (
    <DraggableBlockPlugin_EXPERIMENTAL
      anchorElem={anchorElem}
      menuRef={menuRef}
      targetLineRef={targetLineRef}
      menuComponent={
        <div
          ref={menuRef}
          className={`${DRAGGABLE_BLOCK_MENU_CLASSNAME} opacity-0 hover:opacity-100 transition-opacity duration-200 absolute -left-6 top-1/2 -translate-y-1/2 flex items-center justify-center p-1 cursor-grab active:cursor-grabbing hover:bg-accent rounded-md group`}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
        </div>
      }
      targetLineComponent={
        <div
          ref={targetLineRef}
          className="pointer-events-none absolute left-0 top-0 h-[3px] w-full bg-primary opacity-0 transition-transform duration-200"
        />
      }
      isOnMenu={isOnMenu}
    />
  );
}
