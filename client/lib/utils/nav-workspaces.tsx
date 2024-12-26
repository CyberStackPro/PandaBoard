import { Copy, Edit, Trash, Star, Link2 } from "lucide-react";

export const RIGHT_CLICK_MENU_ITEMS = [
  {
    name: "Duplicate",
    icon: <Copy className="h-4 w-4" />,
    shortcut: "⌘D",
    action: "duplicate",
    subItems: [
      {
        name: "Duplicate with contents",
        action: "duplicateWithContents",
      },
      {
        name: "Duplicate structure only",
        action: "duplicateStructure",
      },
    ],
  },
  {
    name: "Rename",
    icon: <Edit className="h-4 w-4" />,
    shortcut: "⌘R",
    action: "rename",
  },
  {
    name: "Move to Trash",
    icon: <Trash className="h-4 w-4" />,
    shortcut: "⌘T",
    action: "delete",
  },
  {
    name: "Add to Favorites",
    icon: <Star className="h-4 w-4" />,
    shortcut: "⌘F",
    action: "favorite",
  },
  {
    name: "Copy Link",
    icon: <Link2 className="h-4 w-4" />,
    shortcut: "⌘L",
    action: "copyLink",
  },
];
