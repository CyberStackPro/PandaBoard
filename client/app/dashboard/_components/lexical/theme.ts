export const theme = {
  // Text direction
  ltr: "text-left",
  rtl: "text-right",

  // Block styles
  paragraph: "text-muted-foreground mb-2 min-h-[1.5em] leading-relaxed",
  quote: "border-l-4 border-muted pl-4 my-4 italic text-muted-foreground",

  // Headings with modern spacing and sizing
  heading: {
    h1: "text-4xl font-bold mb-4 mt-8 text-foreground tracking-tight",
    h2: "text-3xl font-bold mb-3 mt-6 text-foreground tracking-tight",
    h3: "text-2xl font-bold mb-2 mt-4 text-foreground tracking-tight",
    h4: "text-xl font-bold mb-2 mt-4 text-foreground",
    h5: "text-lg font-bold mb-2 mt-2 text-foreground",
    h6: "text-base font-bold mb-2 mt-2 text-foreground",
  },

  // List styles with better hierarchy
  list: {
    nested: {
      listitem: "ml-6 relative",
    },
    listitemChecked: `relative my-1 pl-8 before:absolute before:left-0 before:top-1 
                      before:h-4 before:w-4 before:rounded 
                      before:border before:border-primary before:bg-primary
                      before:content-[''] text-muted-foreground line-through
                      after:absolute after:left-[7px] after:top-[6px]
                      after:h-[6px] after:w-[3px] after:rotate-45
                      after:border-r-2 after:border-b-2 after:border-white
                      after:content-['']`,
    listitemUnchecked: `relative my-1 pl-8 before:absolute before:left-0 before:top-1 
                        before:h-4 before:w-4 before:rounded 
                        before:border before:border-muted-foreground
                        before:content-[''] hover:before:border-primary
                        focus:before:ring-2 focus:before:ring-ring`,
    ol: "list-decimal ml-6 my-2 relative space-y-1",
    ul: "list-disc ml-6 my-2 relative space-y-1",
    listitem: "ml-2 relative",
    // listitemChecked: "ml-2 line-through text-muted-foreground relative",
    // listitemUnchecked: "ml-2 relative",
    olDepth: [
      "list-decimal",
      "list-[lower-alpha]",
      "list-[lower-roman]",
      "list-[upper-alpha]",
      "list-[upper-roman]",
    ],
    checkbox: "mr-2 h-4 w-4 rounded border-muted-foreground",
  },

  // Enhanced code highlighting
  code: "bg-muted/50 p-4 rounded-lg font-mono text-sm my-4 relative overflow-x-auto border border-border",
  codeHighlight: {
    atrule: "text-purple-500",
    attr: "text-purple-500",
    boolean: "text-blue-500",
    builtin: "text-teal-500",
    cdata: "text-muted-foreground",
    char: "text-green-500",
    class: "text-yellow-500",
    "class-name": "text-yellow-500",
    comment: "italic text-muted-foreground",
    constant: "text-blue-500",
    deleted: "text-red-500",
    doctype: "text-muted-foreground",
    entity: "text-yellow-500",
    function: "text-green-500",
    important: "text-purple-500",
    inserted: "text-green-500",
    keyword: "text-purple-500",
    namespace: "text-yellow-500",
    number: "text-blue-500",
    operator: "text-foreground",
    prolog: "text-muted-foreground",
    property: "text-blue-500",
    punctuation: "text-muted-foreground",
    regex: "text-teal-500",
    selector: "text-green-500",
    string: "text-green-500",
    symbol: "text-blue-500",
    tag: "text-red-500",
    url: "text-blue-500",
    variable: "text-purple-500",
  },

  // Text formatting
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline decoration-[0.5px] underline-offset-[2px]",
    strikethrough: "line-through",
    underlineStrikethrough: "underline line-through",
    subscript: "vertical-align-sub text-[0.8em]",
    superscript: "vertical-align-super text-[0.8em]",
    code: "bg-muted/50 rounded-md px-1.5 py-0.5 font-mono text-sm border border-border",
    capitalize: "capitalize",
    lowercase: "lowercase",
    uppercase: "uppercase",
  },

  // Table styles
  table: "w-full border-collapse my-4 text-sm",
  tableCell: "border border-border p-3 min-w-[100px] relative align-top",
  tableCellHeader: "font-bold bg-muted/50",
  tableHeader: "bg-muted/50 font-bold text-left p-3 border border-border",
  tableRow: "border-b border-border [&:last-child]:border-0",
  tableScrollableWrapper: "w-full overflow-x-auto my-4 relative",
  tableCellResizer:
    "absolute right-0 top-0 w-1 h-full cursor-col-resize hover:bg-primary/20",
  tableSelected: "ring-2 ring-primary ring-offset-2",
  tableCellSelected: "relative bg-primary/10",

  // Special elements
  horizontalRule: "my-8 border-t border-border",
  image: "max-w-full h-auto my-4 rounded-lg",
  inlineImage: "max-h-[1.2em] align-text-bottom",

  // Layout
  layoutContainer: "flex flex-col md:flex-row gap-4 my-4",
  layoutItem: "flex-1 min-w-0",

  // Additional elements
  embedBlock: {
    base: "my-4 w-full rounded-lg border border-border p-4",
    focus: "ring-2 ring-primary ring-offset-2",
  },

  // Utility styles
  indent: "ml-4",
  hashtag:
    "text-primary underline bg-muted/50 px-1.5 py-0.5 rounded-md font-mono text-sm",
  link: "text-primary underline decoration-[0.5px] hover:text-primary/80 transition-colors cursor-pointer",
  characterLimit: "text-sm text-muted-foreground absolute bottom-2 right-2",
  mark: "bg-yellow-200 dark:bg-yellow-800/50 px-0.5 rounded-sm",
  markOverlap: "bg-purple-200 dark:bg-purple-800/50",
  specialText: "text-primary",

  // Editor specific
  blockCursor: "border-l-2 border-primary",
  tab: "ml-8",
};
