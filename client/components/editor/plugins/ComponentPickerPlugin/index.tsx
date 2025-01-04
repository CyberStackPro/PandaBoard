/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { $createCodeNode } from "@lexical/code";
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { INSERT_EMBED_COMMAND } from "@lexical/react/LexicalAutoEmbedPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { INSERT_TABLE_COMMAND } from "@lexical/table";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  FORMAT_ELEMENT_COMMAND,
  LexicalEditor,
  TextNode,
} from "lexical";
import { useCallback, useMemo, useState } from "react";
import * as React from "react";
import * as ReactDOM from "react-dom";

import useModal from "@/hooks/useModal";
import { InsertTableDialog } from "../TablePlugin";
import InsertLayoutDialog from "../LayoutPlugin/InsertLayoutDialog";
import { INSERT_IMAGE_COMMAND, InsertImageDialog } from "../ImagesPlugin";
import { INSERT_PAGE_BREAK } from "../PageBreakPlugin";
import { InsertPollDialog } from "../PollPlugin";
import { INSERT_COLLAPSIBLE_COMMAND } from "../CollapsiblePlugin";
import { EmbedConfigs } from "../AutoEmbedPlugin";
import {
  Text,
  Heading1,
  Heading2,
  Heading3,
  Table,
  ListOrdered,
  List,
  CheckSquare,
  Quote,
  Code,
  Minus,
  SeparatorHorizontal,
  Vote,
  Image as ImageIcon,
  FileImage,
  ChevronRight,
  Columns,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link,
  FileVideo,
  Type,
} from "lucide-react";
import { Input } from "@/components/ui/input";

class ComponentPickerOption extends MenuOption {
  // What shows up in the editor
  title: string;
  // Icon for display
  icon?: JSX.Element;
  // For extra searching.
  keywords: Array<string>;
  // TBD
  keyboardShortcut?: string;
  // What happens when you select this option?
  onSelect: (queryString: string) => void;

  constructor(
    title: string,
    options: {
      icon?: JSX.Element;
      keywords?: Array<string>;
      keyboardShortcut?: string;
      onSelect: (queryString: string) => void;
    }
  ) {
    super(title);
    this.title = title;
    this.keywords = options.keywords || [];
    this.icon = options.icon;
    this.keyboardShortcut = options.keyboardShortcut;
    this.onSelect = options.onSelect.bind(this);
  }
}

function ComponentPickerMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option,
}: {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: ComponentPickerOption;
}) {
  let className = "item";
  if (isSelected) {
    className += " selected";
  }
  return (
    <li
      key={option.key}
      tabIndex={-1}
      className={`
        flex items-center px-3 py-2 text-sm cursor-pointer
        ${
          isSelected
            ? "bg-primary-foreground text-primary"
            : "text-foreground hover:bg-accent/10"
        }
        transition-colors rounded-md
      `}
      ref={option.setRefElement}
      role="option"
      aria-selected={isSelected}
      id={`typeahead-item-${index}`}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <span className="mr-2">{option.icon}</span>
      <span className="flex-1">{option.title}</span>
      {option.keyboardShortcut && (
        <span className="ml-auto text-xs text-muted-foreground">
          {option.keyboardShortcut}
        </span>
      )}
    </li>
  );
}

function getDynamicOptions(editor: LexicalEditor, queryString: string) {
  const options: Array<ComponentPickerOption> = [];

  if (queryString == null) {
    return options;
  }
  // Match table dimensions pattern (e.g., 2x3)
  const tableMatch = queryString.match(/^([1-9]\d?)(?:x([1-9]\d?)?)?$/);

  if (tableMatch !== null) {
    const rows = tableMatch[1];
    const colOptions = tableMatch[2]
      ? [tableMatch[2]]
      : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(String);

    options.push(
      ...colOptions.map(
        (columns) =>
          new ComponentPickerOption(`${rows}x${columns} Table`, {
            icon: <Table />,
            keywords: ["table"],
            onSelect: () =>
              editor.dispatchCommand(INSERT_TABLE_COMMAND, { columns, rows }),
          })
      )
    );
  }

  return options;
}

type ShowModal = ReturnType<typeof useModal>[1];

function getBaseOptions(editor: LexicalEditor, showModal: ShowModal) {
  return [
    // Text formatting options
    new ComponentPickerOption("Paragraph", {
      icon: (
        <Type className=" border  size-10 p-1 rounded-md text-muted-foreground" />
      ),
      keywords: ["normal", "paragraph", "p", "text"],
      onSelect: () =>
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createParagraphNode());
          }
        }),
    }),

    // Headings
    ...([1, 2, 3] as const).map((n) => {
      const HeadingIcon = n === 1 ? Heading1 : n === 2 ? Heading2 : Heading3;
      return new ComponentPickerOption(`Heading ${n}`, {
        icon: (
          <HeadingIcon className=" border  size-10 p-1 rounded-md text-muted-foreground" />
        ),
        keywords: ["heading", "header", `h${n}`],
        onSelect: () =>
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createHeadingNode(`h${n}`));
            }
          }),
      });
    }),

    // Lists and structure content
    new ComponentPickerOption("Table", {
      icon: (
        <Table className=" border  size-10 p-1 rounded-md text-muted-foreground" />
      ),
      keywords: ["table", "grid", "spreadsheet", "rows", "columns"],
      onSelect: () =>
        showModal("Insert Table", (onClose) => (
          <InsertTableDialog activeEditor={editor} onClose={onClose} />
        )),
    }),

    new ComponentPickerOption("Numbered List", {
      icon: (
        <ListOrdered className=" border  size-10 p-1 rounded-md text-muted-foreground" />
      ),
      keywords: ["numbered list", "ordered list", "ol"],
      onSelect: () =>
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined),
    }),

    new ComponentPickerOption("Bullet List", {
      icon: (
        <List className="border  size-10 p-1 rounded-md text-muted-foreground" />
      ),
      keywords: ["bulleted list", "unordered list", "ul"],
      onSelect: () =>
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined),
    }),

    new ComponentPickerOption("To-do List", {
      icon: (
        <CheckSquare className="border  size-10 p-1 rounded-md text-muted-foreground" />
      ),
      keywords: ["check list", "todo list", "task", "todo"],
      onSelect: () =>
        editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined),
    }),

    // Block elements
    new ComponentPickerOption("Quote Block", {
      icon: (
        <Quote className="border  size-10 p-1 rounded-md text-muted-foreground" />
      ),
      keywords: ["block quote", "quotation", "cite"],
      onSelect: () =>
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createQuoteNode());
          }
        }),
    }),

    new ComponentPickerOption("Code Block", {
      icon: (
        <Code className="border  size-10 p-1 rounded-md text-muted-foreground" />
      ),
      keywords: ["javascript", "python", "js", "codeblock", "programming"],
      onSelect: () =>
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            if (selection.isCollapsed()) {
              $setBlocksType(selection, () => $createCodeNode());
            } else {
              const textContent = selection.getTextContent();
              const codeNode = $createCodeNode();
              selection.insertNodes([codeNode]);
              selection.insertRawText(textContent);
            }
          }
        }),
    }),

    // Dividers and breaks
    new ComponentPickerOption("Divider", {
      icon: (
        <Minus className="border  size-10 p-1 rounded-md text-muted-foreground" />
      ),
      keywords: ["horizontal rule", "divider", "hr", "separator"],
      onSelect: () =>
        editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined),
    }),

    new ComponentPickerOption("Page Break", {
      icon: (
        <SeparatorHorizontal className="border  size-10 p-1 rounded-md text-muted-foreground" />
      ),
      keywords: ["page break", "divider", "hr", "separator"],
      onSelect: () => editor.dispatchCommand(INSERT_PAGE_BREAK, undefined),
    }),
    // new ComponentPickerOption("Excalidraw", {
    //   icon: <i className="icon diagram-2" />,
    //   keywords: ["excalidraw", "diagram", "drawing"],
    //   onSelect: () =>
    //     editor.dispatchCommand(INSERT_EXCALIDRAW_COMMAND, undefined),
    // }),
    new ComponentPickerOption("Poll", {
      icon: <i className="icon poll" />,
      keywords: ["poll", "vote"],
      onSelect: () =>
        showModal("Insert Poll", (onClose) => (
          <InsertPollDialog activeEditor={editor} onClose={onClose} />
        )),
    }),
    ...EmbedConfigs.map(
      (embedConfig) =>
        new ComponentPickerOption(`Embed ${embedConfig.contentName}`, {
          icon: embedConfig.icon,
          keywords: [...embedConfig.keywords, "embed"],
          onSelect: () =>
            editor.dispatchCommand(INSERT_EMBED_COMMAND, embedConfig.type),
        })
    ),
    // new ComponentPickerOption("Equation", {
    //   icon: <i className="icon equation" />,
    //   keywords: ["equation", "latex", "math"],
    //   onSelect: () =>
    //     showModal("Insert Equation", (onClose) => (
    //       <InsertEquationDialog activeEditor={editor} onClose={onClose} />
    //     )),
    // }),

    // Media and embeds
    new ComponentPickerOption("Image", {
      icon: (
        <ImageIcon className="border  size-10 p-1 rounded-md text-muted-foreground" />
      ),
      keywords: ["image", "photo", "picture", "file", "upload"],
      onSelect: () =>
        showModal("Insert Image", (onClose) => (
          <InsertImageDialog activeEditor={editor} onClose={onClose} />
        )),
    }),

    new ComponentPickerOption("GIF", {
      icon: (
        <FileImage className="border  size-10 p-1 rounded-md text-muted-foreground" />
      ),
      keywords: ["gif", "animate", "image", "file"],
      onSelect: () =>
        editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
          altText: "GIF image",
          src: "",
        }),
    }),

    // Layout options
    new ComponentPickerOption("Toggle List", {
      icon: (
        <ChevronRight className="border  size-10 p-1 rounded-md text-muted-foreground" />
      ),
      keywords: ["collapse", "collapsible", "toggle", "dropdown"],
      onSelect: () =>
        editor.dispatchCommand(INSERT_COLLAPSIBLE_COMMAND, undefined),
    }),

    new ComponentPickerOption("Column Layout", {
      icon: (
        <Columns className="border  size-10 p-1 rounded-md text-muted-foreground" />
      ),
      keywords: ["columns", "layout", "grid", "multi-column"],
      onSelect: () =>
        showModal("Insert Columns Layout", (onClose) => (
          <InsertLayoutDialog activeEditor={editor} onClose={onClose} />
        )),
    }),

    // Alignment options
    ...(["left", "center", "right", "justify"] as const).map((alignment) => {
      const AlignIcon =
        alignment === "left"
          ? AlignLeft
          : alignment === "center"
          ? AlignCenter
          : alignment === "right"
          ? AlignRight
          : AlignJustify;

      return new ComponentPickerOption(`Align ${alignment}`, {
        icon: (
          <AlignIcon className="border  size-10 p-1 rounded-md text-muted-foreground" />
        ),
        keywords: ["align", "justify", alignment, "text alignment"],
        onSelect: () =>
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment),
      });
    }),

    // TDOD
    new ComponentPickerOption("Link", {
      icon: (
        <Link className="border  size-10 p-1 rounded-md text-muted-foreground" />
      ),
      keywords: ["link", "url", "href", "website"],
      onSelect: () => {
        // Implement link insertion logic
      },
    }),

    // Embed options
    ...EmbedConfigs.map(
      (embedConfig) =>
        new ComponentPickerOption(`Embed ${embedConfig.contentName}`, {
          icon: (
            <FileVideo className="border  size-10 p-1 rounded-md text-muted-foreground" />
          ),
          keywords: [...embedConfig.keywords, "embed", "media"],
          onSelect: () =>
            editor.dispatchCommand(INSERT_EMBED_COMMAND, embedConfig.type),
        })
    ),
  ];
}

export default function ComponentPickerMenuPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [modal, showModal] = useModal();
  const [queryString, setQueryString] = useState<string | null>(null);

  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch("/", {
    minLength: 0,
  });

  const options = useMemo(() => {
    const baseOptions = getBaseOptions(editor, showModal);

    if (!queryString) {
      return baseOptions;
    }

    const regex = new RegExp(queryString, "i");

    return [
      ...getDynamicOptions(editor, queryString),
      ...baseOptions.filter(
        (option) =>
          regex.test(option.title) ||
          option.keywords.some((keyword) => regex.test(keyword))
      ),
    ];
  }, [editor, queryString, showModal]);

  const onSelectOption = useCallback(
    (
      selectedOption: ComponentPickerOption,
      nodeToRemove: TextNode | null,
      closeMenu: () => void,
      matchingString: string
    ) => {
      editor.update(() => {
        nodeToRemove?.remove();
        selectedOption.onSelect(matchingString);
        closeMenu();
      });
    },
    [editor]
  );

  return (
    <>
      {modal}
      <LexicalTypeaheadMenuPlugin<ComponentPickerOption>
        onQueryChange={setQueryString}
        onSelectOption={onSelectOption}
        triggerFn={checkForTriggerMatch}
        options={options}
        menuRenderFn={(
          anchorElementRef,
          { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
        ) =>
          anchorElementRef.current && options.length
            ? ReactDOM.createPortal(
                <div className="z-50 min-w-[300px] overflow-hidden bg-popover rounded-lg border border-border shadow-lg animate-in fade-in-0 zoom-in-95">
                  <input
                    className="w-full px-2 py-1 text-sm bg-transparent border-none outline-none focus:ring-0"
                    placeholder="Search..."
                    // onChange={(e) => console.log(e.target.value)}
                  />
                  <div className="max-h-[300px] overflow-y-scroll scrollbar-thin scrollbar-thumb-primary scrollbar-track-background p-1">
                    <ul className="space-y-0.5">
                      {options.map((option, i: number) => (
                        <ComponentPickerMenuItem
                          index={i}
                          isSelected={selectedIndex === i}
                          onClick={() => {
                            setHighlightedIndex(i);
                            selectOptionAndCleanUp(option);
                          }}
                          onMouseEnter={() => {
                            setHighlightedIndex(i);
                          }}
                          key={i + "-" + option.key}
                          option={option}
                        />
                      ))}
                    </ul>
                  </div>
                </div>,
                anchorElementRef.current
              )
            : null
        }
      />
    </>
  );
}
