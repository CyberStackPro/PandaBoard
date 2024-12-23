"use client";

import {
  AudioWaveform,
  Blocks,
  Calendar,
  Command,
  Home,
  Inbox,
  MessageCircleQuestion,
  Search,
  Settings2,
  Sparkles,
  Trash2,
} from "lucide-react";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useStore } from "@/stores/store";
import { NavSecondary } from "./nav-secondary";
import { NavWorkspaces } from "./nav-workspaces";
import { TeamSwitcher } from "./team-switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// This is sample data.
const DATA = {
  teams: [
    {
      name: "Acme Inc",
      logo: Command,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
    {
      title: "Ask AI",
      url: "#",
      icon: Sparkles,
    },
    {
      title: "Home",
      url: "#",
      icon: Home,
      isActive: true,
    },
    {
      title: "Inbox",
      url: "#",
      icon: Inbox,
      badge: "10",
    },
  ],
  navSecondary: [
    {
      title: "Calendar",
      url: "#",
      icon: Calendar,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
    },
    {
      title: "Templates",
      url: "#",
      icon: Blocks,
    },
    {
      title: "Trash",
      url: "#",
      icon: Trash2,
    },
    {
      title: "Help",
      url: "#",
      icon: MessageCircleQuestion,
    },
  ],
  favorites: [
    {
      name: "Project Management & Task Tracking",
      url: "#",
      icon: "📊",
    },
    {
      name: "Family Recipe Collection & Meal Planning",
      url: "#",
      icon: "🍳",
    },
    {
      name: "Fitness Tracker & Workout Routines",
      url: "#",
      icon: "💪",
    },
    {
      name: "Book Notes & Reading List",
      url: "#",
      icon: "📚",
    },
    {
      name: "Sustainable Gardening Tips & Plant Care",
      url: "#",
      icon: "🌱",
    },
    {
      name: "Language Learning Progress & Resources",
      url: "#",
      icon: "🗣️",
    },
    {
      name: "Home Renovation Ideas & Budget Tracker",
      url: "#",
      icon: "🏠",
    },
    {
      name: "Personal Finance & Investment Portfolio",
      url: "#",
      icon: "💰",
    },
    {
      name: "Movie & TV Show Watchlist with Reviews",
      url: "#",
      icon: "🎬",
    },
    {
      name: "Daily Habit Tracker & Goal Setting",
      url: "#",
      icon: "✅",
    },
  ],
  workspaces: [
    {
      id: "1",
      name: "Jonathan's James",
      icon: "🏠",
      children: [
        {
          id: "1-1",
          name: "Personal Life Management",
          icon: "🏠",
          children: [
            {
              id: "1-1-1",
              name: "Daily Journal & Reflection",
              url: "#",
              icon: "📔",
            },
            {
              id: "1-1-2",
              name: "Health & Wellness Tracker",
              url: "#",
              icon: "🍏",
            },
            {
              id: "1-1-3",
              name: "Personal Growth & Learning Goals",
              url: "#",
              icon: "🌟",
            },
          ],
        },
        {
          id: "1-2",
          name: "Professional Development",
          icon: "💼",
          children: [
            {
              id: "1-2-1",
              name: "Career Objectives & Milestones",
              url: "#",
              icon: "🎯",
            },
            {
              id: "1-2-2",
              name: "Skill Acquisition & Training Log",
              url: "#",
              icon: "🧠",
            },
            {
              id: "1-2-3",
              name: "Networking Contacts & Events",
              url: "#",
              icon: "🤝",
            },
          ],
        },
        {
          id: "1-3",
          name: "Creative Projects",
          icon: "🎨",
          children: [
            {
              id: "1-3-1",
              name: "Writing Ideas & Story Outlines",
              url: "#",
              icon: "✍️",
            },
            {
              id: "1-3-2",
              name: "Art & Design Portfolio",
              url: "#",
              icon: "🖼️",
            },
            {
              id: "1-3-3",
              name: "Music Composition & Practice Log",
              url: "#",
              icon: "🎵",
            },
          ],
        },
      ],
    },
    {
      id: "2",
      name: "Home Management",
      icon: "🏡",
      children: [
        {
          id: "2-1",
          name: "Household Budget & Expense Tracking",
          url: "#",
          icon: "💰",
        },
        {
          id: "2-2",
          name: "Home Maintenance Schedule & Tasks",
          url: "#",
          icon: "🔧",
        },
        {
          id: "2-3",
          name: "Family Calendar & Event Planning",
          url: "#",
          icon: "📅",
        },
      ],
    },
    {
      id: "3",
      name: "Travel & Adventure",
      icon: "🧳",
      children: [
        {
          id: "3-1",
          name: "Trip Planning & Itineraries",
          url: "#",
          icon: "🗺️",
        },
        {
          id: "3-2",
          name: "Travel Bucket List & Inspiration",
          url: "#",
          icon: "🌎",
        },
        {
          id: "3-3",
          name: "Travel Journal & Photo Gallery",
          url: "#",
          icon: "📸",
        },
      ],
    },
    {
      id: "4",
      name: "Personal Life Management",
      icon: "🏠",
      children: [
        {
          id: "4-1",
          name: "Daily Journal & Reflection",
          url: "#",
          icon: "📔",
        },
        {
          id: "4-2",
          name: "Health & Wellness Tracker",
          url: "#",
          icon: "🍏",
        },
        {
          id: "4-3",
          name: "Personal Growth & Learning Goals",
          url: "#",
          icon: "🌟",
        },
      ],
    },
  ],
};
// ],
// };
const promptForName = async (type: "folder" | "file") => {
  // In a real application, you'd want to use a proper dialog/modal component
  const defaultName = type === "folder" ? "Untitled Folder" : "Untitled";
  const name = prompt(`Enter ${type} name:`, defaultName);
  return name || null;
};
// const NameDialog = (name?: string, type: "folder" | "file") => {
//   const [parentId, setParentId] = React.useState<string | null>(null);
//   const [name, setName] = React.useState<string | null>(null);
//   const defaultName = type === "folder" ? "Untitled Folder" : "Untitled";
//   return (
//     <>
//      <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="outline">{name}</Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Add Name</DialogTitle>
//           <DialogDescription>
//            {name}
//           </DialogDescription>
//         </DialogHeader>
//         <div className="grid gap-4 py-4">
//           <div className="grid grid-cols-4 items-center gap-4">
//             <Label htmlFor="name" className="text-right">
//               Name
//             </Label>
//             <Input  id="name" defaultValue={defaultName} value={name} className="col-span-3" />
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//     </>
//   )
// }
export function AppSidebar({
  // className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const [data] = React.useState(DATA);
  const workspaces = useStore((state) => state.workspaces);
  const addProject = useStore((state) => state.addProject);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogType, setDialogType] = React.useState<"folder" | "file">(
    "folder"
  );
  const [parentId, setParentId] = React.useState<string | null>(null);

  const handleAddProject = async (
    parentId: string | null,
    type: "folder" | "file"
  ) => {
    setDialogType(type);
    setParentId(parentId);
    setDialogOpen(true);
  };

  const handleDialogSubmit = async (name: string) => {
    await addProject({
      name,
      parent_id: parentId,
      type: dialogType,
    });
  };

  return (
    // <div className="relative  group-data-[variant=floating]:border-0">
    // {/* <div className="absolute inset-y-0 right-0 w-3 bg-white filter blur-md opacity-100"></div> */}
    <Sidebar
      className="border-r-0 backdrop-blur-sm bg-background/50"
      collapsible="icon"
      {...props}
    >
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavWorkspaces
          isCollapsed={false}
          onAddProject={handleAddProject}
          projects={workspaces}
        />

        <NavSecondary items={data.navSecondary} />
      </SidebarContent>
      <SidebarRail />
      <NameDialog
        type={dialogType}
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleDialogSubmit}
      />
    </Sidebar>
    // </div>
  );
}

// export function AppSidebar({
//   className,
//   ...props
// }: React.HTMLAttributes<HTMLDivElement>) {
//   const { state } = useSidebar();
//   return (
//     <div
//       className={cn(
//         "flex h-full flex-col bg-sidebar-accent overflow-hidden",
//         className
//       )}
//       {...props}
//     >
//       <Sidebar className="border-r-0" collapsible="icon" {...props}>

//       </Sidebar>
//       <div className="flex-shrink-0 transition-all p-4">
//         <TeamSwitcher teams={data.teams} />
//       </div>
//       <div className="flex-1  overflow-auto">
//         {/* <NavMain items={data.navMain} />
//         <NavFavorites favorites={data.favorites} /> */}
//         <NavWorkspaces workspaces={data.workspaces} />
//       </div>
//       <div className="flex-shrink-0 p-4">
//         <NavSecondary items={data.navSecondary} />
//       </div>
//     </div>
//   );
// }

interface NameDialogProps {
  type: "folder" | "file";
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

export function NameDialog({
  type,
  isOpen,
  onClose,
  onSubmit,
}: NameDialogProps) {
  const [name, setName] = React.useState("");
  const defaultName = type === "folder" ? "Untitled Folder" : "Untitled";

  React.useEffect(() => {
    if (isOpen) {
      setName(defaultName);
    }
  }, [isOpen, defaultName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add {type === "folder" ? "Folder" : "File"}</DialogTitle>
          <DialogDescription>
            Enter a name for your new {type}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                autoFocus
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
