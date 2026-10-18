import type { App } from "@react-ui-os/core";
import { TulipTerminalApp } from "@/components/apps/TulipTerminalApp";
import { TerminalIcon, TerminalFluentIcon } from "@react-ui-os/icons";

export const tulipTerminalApp: App = {
  id: "terminal",
  name: "Terminal",
  tagline: "Terminal Linux emulada (v86) — invernadero-central",
  accent: "#22c55e",
  icon: TerminalIcon,
  icons: { fluent: TerminalFluentIcon },
  category: "Productivity",
  // Wider default to give xterm room to breathe
  defaultBounds: { w: 780, h: 520 },
  content: TulipTerminalApp,
};

export const terminalApp = tulipTerminalApp;

