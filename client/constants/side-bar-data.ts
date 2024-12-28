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

export const DATA = {
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
