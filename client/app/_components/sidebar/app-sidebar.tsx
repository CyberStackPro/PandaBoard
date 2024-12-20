"use client";

import * as React from "react";
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

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { TeamSwitcher } from "./team-switch";
import { NavMain } from "./nav-main";
import { NavFavorites } from "./nav-favorites";
import { NavWorkspaces } from "./nav-workspaces";
import { NavSecondary } from "./nav-secondary";
import { cn } from "@/lib/utils";

// This is sample data.
const data = {
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
      name: "Jonathan's James",
      icon: "🏠",
      pages: [
        {
          name: "Personal Life Management",
          icon: "🏠",
          pages: [
            {
              name: "Daily Journal & Reflection",
              url: "#",
              icon: "📔",
            },
            {
              name: "Health & Wellness Tracker",
              url: "#",
              icon: "🍏",
            },
            {
              name: "Personal Growth & Learning Goals",
              url: "#",
              icon: "🌟",
            },
          ],
        },
        {
          name: "Professional Development",
          icon: "💼",
          pages: [
            {
              name: "Career Objectives & Milestones",
              url: "#",
              icon: "🎯",
            },
            {
              name: "Skill Acquisition & Training Log",
              url: "#",
              icon: "🧠",
            },
            {
              name: "Networking Contacts & Events",
              url: "#",
              icon: "🤝",
            },
          ],
        },
        {
          name: "Creative Projects",
          icon: "🎨",
          pages: [
            {
              name: "Writing Ideas & Story Outlines",
              url: "#",
              icon: "✍️",
            },
            {
              name: "Art & Design Portfolio",
              url: "#",
              icon: "🖼️",
            },
            {
              name: "Music Composition & Practice Log",
              url: "#",
              icon: "🎵",
            },
          ],
        },
        {
          name: "Home Management",
          icon: "🏡",
          pages: [
            {
              name: "Household Budget & Expense Tracking",
              url: "#",
              icon: "💰",
            },
            {
              name: "Home Maintenance Schedule & Tasks",
              url: "#",
              icon: "🔧",
            },
            {
              name: "Family Calendar & Event Planning",
              url: "#",
              icon: "📅",
            },
          ],
        },
        {
          name: "Travel & Adventure",
          icon: "🧳",
          pages: [
            {
              name: "Trip Planning & Itineraries",
              url: "#",
              icon: "🗺️",
            },
            {
              name: "Travel Bucket List & Inspiration",
              url: "#",
              icon: "🌎",
            },
            {
              name: "Travel Journal & Photo Gallery",
              url: "#",
              icon: "📸",
            },
          ],
        },
      ],
    },
  ],
};

export function AppSidebar({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { state } = useSidebar();
  return (
    <div
      className={cn(
        "flex h-full flex-col bg-sidebar-accent overflow-hidden",
        className
      )}
      {...props}
    >
      {/* <Sidebar className="border-r-0" collapsible="icon" {...props}></Sidebar> */}
      <div className="flex-shrink-0 transition-all p-4">
        <TeamSwitcher teams={data.teams} />
      </div>
      <div className="flex-1  overflow-auto">
        {/* <NavMain items={data.navMain} /> */}
        {/* <NavFavorites favorites={data.favorites} /> */}
        <NavWorkspaces workspaces={data.workspaces} />
      </div>
      <div className="flex-shrink-0 p-4">
        <NavSecondary items={data.navSecondary} />
      </div>
    </div>
  );
}
