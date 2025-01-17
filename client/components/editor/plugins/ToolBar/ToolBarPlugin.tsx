import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  $isListNode,
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import {
  AlignCenter,
  AlignJustify,
  AlignLeftIcon,
  AlignRight,
  Bold,
  CheckSquare,
  CheckSquareIcon,
  Italic,
  List,
  ListOrdered,
  Redo,
  Strikethrough,
  Underline,
  Undo,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { formatParagraph } from "../ToolbarPlugin/utils";
import { $isHeadingNode } from "@lexical/rich-text";
import { SHORTCUTS } from "../ShortcutsPlugin/shortcuts";
import "./style.css";
const LowPriority = 1;

function Divider() {
  return <div className="divider" />;
}

type BlockTypes = "bullet" | "number" | "check" | "paragraph";

const blockTypeToBlockName: Record<BlockTypes, string> = {
  bullet: "Bulleted List",
  number: "Numbered List",
  check: "Check List",
  paragraph: "Normal",
} as const;

interface FormatListParams {
  editor: LexicalEditor;
  blockType: BlockTypes;
  commandType:
    | typeof INSERT_ORDERED_LIST_COMMAND
    | typeof INSERT_UNORDERED_LIST_COMMAND
    | typeof INSERT_CHECK_LIST_COMMAND;
  targetType: BlockTypes;
}

const formatList = ({
  editor,
  blockType,
  commandType,
  targetType,
}: FormatListParams) => {
  if (blockType !== targetType) {
    editor.dispatchCommand(commandType, undefined);
  }
};

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [blockType, setBlockType] =
    useState<keyof typeof blockTypeToBlockName>("paragraph");

  // function formatCheckList(editor: LexicalEditor, blockType: string) {
  //   if (blockType !== "check") {
  //     editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
  //   } else {
  //     formatParagraph(editor);
  //   }
  // }
  const handleFormatBulletList = useCallback(() => {
    formatList({
      editor,
      blockType,
      commandType: INSERT_UNORDERED_LIST_COMMAND,
      targetType: "bullet",
    });
  }, [editor, blockType]);

  const handleFormatNumberedList = useCallback(() => {
    formatList({
      editor,
      blockType,
      commandType: INSERT_ORDERED_LIST_COMMAND,
      targetType: "number",
    });
  }, [editor, blockType]);

  const handleFormatCheckList = useCallback(() => {
    formatList({
      editor,
      blockType,
      commandType: INSERT_CHECK_LIST_COMMAND,
      targetType: "check",
    });
  }, [editor, blockType]);
  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));

      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      if ($isListNode(element)) {
        const parentList = $getNearestNodeOfType(anchorNode, ListNode);
        const type = parentList ? parentList.getTag() : element.getTag();
        setBlockType(type);
      } else {
        const type = $isHeadingNode(element)
          ? element.getTag()
          : element.getType();
        setBlockType(type);
      }
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar();
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority
      )
    );
  }, [editor, $updateToolbar]);
  function dropDownActiveClass(active: boolean) {
    return active ? "bg-blue-50" : "";
  }

  return (
    <div className="flex items-center space-x-1 rounded-t-lg bg-background p-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <List className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={handleFormatBulletList}
            className={`flex items-center gap-2 ${
              blockType === "bullet" ? "bg-muted" : ""
            }`}
          >
            <List className="h-4 w-4" />
            <span>Bullet List</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleFormatNumberedList}
            className={`flex items-center gap-2 ${
              blockType === "number" ? "bg-muted" : ""
            }`}
          >
            <ListOrdered className="h-4 w-4" />
            <span>Numbered List</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleFormatCheckList}
            className={`flex items-center gap-2 cursor-pointer ${
              blockType === "check" ? "bg-muted" : ""
            }`}
          >
            <CheckSquareIcon className="h-4 w-4" />
            <span>Check List</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* <DropDownItem
        className={"item wide " + dropDownActiveClass(blockType === "check")}
        onClick={() => formatCheckList(editor, blockType)}
      >
        <div className="icon-text-container">
          <i className="icon check-list" />
          <span className="text">Check List</span>
        </div>
        <span className="shortcut">{SHORTCUTS.CHECK_LIST}</span>
      </DropDownItem> */}

      <Button
        variant="ghost"
        size="icon"
        disabled={!canUndo}
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        aria-label="Undo"
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        disabled={!canRedo}
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        aria-label="Redo"
      >
        <Redo className="h-4 w-4" />
      </Button>
      <Separator orientation="vertical" className="h-6" />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        className={isBold ? "bg-muted" : ""}
        aria-label="Format Bold"
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        className={isItalic ? "bg-muted" : ""}
        aria-label="Format Italics"
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
        className={isUnderline ? "bg-muted" : ""}
        aria-label="Format Underline"
      >
        <Underline className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() =>
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
        }
        className={isStrikethrough ? "bg-muted" : ""}
        aria-label="Format Strikethrough"
      >
        <Strikethrough className="h-4 w-4" />
      </Button>
      <Separator orientation="vertical" className="h-6" />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}
        aria-label="Left Align"
      >
        <AlignLeftIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")}
        aria-label="Center Align"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")}
        aria-label="Right Align"
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() =>
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")
        }
        aria-label="Justify Align"
      >
        <AlignJustify className="h-4 w-4" />
      </Button>
    </div>
  );
}
