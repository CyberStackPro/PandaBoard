import { DraggableBlockPlugin_EXPERIMENTAL } from "@lexical/react/LexicalDraggableBlockPlugin";
import { useRef } from "react";
import { GripVertical, Plus } from "lucide-react";
import "./index.css";
import { Button } from "@/components/ui/button";

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
          className={`${DRAGGABLE_BLOCK_MENU_CLASSNAME}  opacity-0 group-hover:opacity-100 absolute left-0 top-0 transition-transform flex items-center justify-center p-1 cursor-grab active:cursor-grabbing hover:bg-accent rounded-md z-[100]`}
        >
          {/* <Button
            variant="ghost"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            onClick={() => console.log("Add new block")}
          >
            <Plus className="h-4 w-4" />
          </Button> */}

          <GripVertical className="size-4  text-muted-foreground group-hover:text-foreground" />
        </div>
      }
      targetLineComponent={
        <div
          ref={targetLineRef}
          className="draggable-block-target-line "
          style={{ height: "3px" }}
        />
      }
      isOnMenu={isOnMenu}
    />
  );
}
