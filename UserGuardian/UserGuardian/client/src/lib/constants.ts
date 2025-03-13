export const APP_NAME = "UNova";

export const ASSISTANCE_TYPES = {
  GENERAL: "GENERAL",
  RESEARCH: "RESEARCH",
  SPEECHWRITING: "SPEECHWRITING",
  DEBATE: "DEBATE",
  RESOLUTION: "RESOLUTION"
};

export const QUICK_PROMPTS = [
  "Research for my country",
  "Draft a speech",
  "Develop debate strategy",
  "Help with resolution writing",
  "Explain MUN procedures"
];

export const SIDEBAR_ITEMS = [
  {
    name: "AI Assistant",
    icon: "chat",
    path: "/",
    color: "primary"
  },
  {
    name: "Research",
    icon: "search",
    path: "/research",
    color: "gray"
  },
  {
    name: "Speechwriting",
    icon: "mic",
    path: "/speech",
    color: "gray"
  },
  {
    name: "Debate Strategy",
    icon: "forum",
    path: "/debate",
    color: "gray"
  },
  {
    name: "Resolution Drafting",
    icon: "description",
    path: "/resolution",
    color: "gray"
  },
  {
    name: "MUN Rules",
    icon: "gavel",
    path: "/rules",
    color: "gray"
  }
];

export const SAVED_ITEMS = [
  {
    name: "My Documents",
    icon: "folder",
    path: "/documents",
    color: "gray"
  },
  {
    name: "Recent Conversations",
    icon: "history",
    path: "/history",
    color: "gray"
  }
];
