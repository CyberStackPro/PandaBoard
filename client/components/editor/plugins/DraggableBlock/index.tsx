import { DraggableBlockPlugin_EXPERIMENTAL } from "@lexical/react/LexicalDraggableBlockPlugin";
import { useRef } from "react";
import { GripVertical } from "lucide-react";

const DRAGGABLE_BLOCK_MENU_CLASSNAME = "draggable-block-menu";

function isOnMenu(element: HTMLElement): boolean {
  return !!element.closest(`.${DRAGGABLE_BLOCK_MENU_CLASSNAME}`);
}

export default function DraggableBlockPlugin({
  anchorElem,
}: {
  anchorElem: HTMLElement;
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
          className={`${DRAGGABLE_BLOCK_MENU_CLASSNAME} opacity-0 group-hover:opacity-100 absolute -left-6 top-1/2 -translate-y-1/2 flex items-center justify-center p-1 cursor-grab active:cursor-grabbing hover:bg-accent/50 rounded-md z-[100]`}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
        </div>
      }
      targetLineComponent={
        <div
          ref={targetLineRef}
          className="draggable-block-target-line bg-primary"
          style={{ height: "3px" }}
        />
      }
      isOnMenu={isOnMenu}
    />
  );
}
