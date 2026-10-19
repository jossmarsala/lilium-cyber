import type { App } from "@react-ui-os/core";
import { LiliumPlaybookApp } from "@/components/apps/LiliumPlaybookApp";
import { PlaybookLineIcon, PlaybookFluentIcon } from "@/components/apps/PlaybookIcon";

export const liliumPlaybookApp: App = {
  id: "playbook",
  name: "Playbook",
  tagline: "Manual de Operaciones — Estación Invernadero-Central",
  accent: "#34d399",
  icon: PlaybookLineIcon,
  icons: { fluent: PlaybookFluentIcon },
  category: "Security",
  defaultBounds: { w: 580, h: 540 },
  content: LiliumPlaybookApp,
};

export const playbookApp = liliumPlaybookApp;
