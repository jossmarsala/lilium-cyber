import { useEffect, useMemo, useState } from "react";
import type { App as OsApp, OsTheme } from "@react-ui-os/core";
import { useWindowManager } from "@react-ui-os/core";
import {
  Desktop,
  pickInitialBounds,
  registerSystemWindow,
  useApps,
  useDesktopContext,
  useTheme,
} from "@react-ui-os/desktop";
import {
  applyDemoIcons,
  applyDemoSettingsIcon,
  buildDemoTheme,
  localIcon,
  persistThemeChoice,
  readInitialThemeChoice,
  type DemoThemeChoice,
} from "@react-ui-os/demo";
import { exampleApps } from "@react-ui-os/example-apps";
import { tulipTerminalApp } from "@/os-apps/terminal";
import { tulipPlaybookApp } from "@/os-apps/playbook";

import { notesApp } from "@/os-apps/notes";
import { seedLabNotes } from "./seedLabNotes";
import { hasRecents } from "./recents";
import { RecentsFolder } from "./RecentsFolder";
import { RecentsIcon } from "./RecentsIcon";
import { StartRecents } from "./StartRecents";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { UbuntuQuickSettings } from "./UbuntuQuickSettings";

// The apps, per-theme icons, theme builder, and Settings icons all come from
// the shared @react-ui-os/demo config so the playground and the docs embed
// stay in sync. "/" is the playground's asset base (it serves public/ at root).
const ASSET_BASE = "/";

// Register the Recents system window once at module load. The desktop icon for
// it surfaces only when `hasRecents(storage)` returns true, so the folder
// appears the moment the user adds their first entry and disappears when they
// delete the last one.
registerSystemWindow("recents", {
  name: "Recents",
  tagline: "Recently created items",
  accent: "#6b8afd",
  defaultBounds: { w: 560, h: 420 },
  content: RecentsFolder,
  icon: RecentsIcon,
  icons: { fluent: localIcon(`${ASSET_BASE}local/win11/recents.png`, RecentsIcon) },
  appearsAsDesktopIcon: (storage) => hasRecents(storage),
});

applyDemoSettingsIcon(ASSET_BASE);

/**
 * Initializes desktop storage with the Lab 1 preloaded notes:
 * - ITSM Incident Ticket INC-1049
 * - Risk & Asset Matrix Template
 * - Former Operator Easter-Egg Diary
 * - Linux Defense Commands Quick Reference
 */
function DesktopInitializer() {
  const { storage } = useDesktopContext();
  useEffect(() => {
    seedLabNotes(storage);
  }, [storage]);
  return null;
}

const desktopApps: OsApp[] = [
  tulipPlaybookApp,
  tulipTerminalApp,
  notesApp,
  ...exampleApps.filter((app) => app.id !== "terminal" && app.id !== "notes"),
];

const apps: OsApp[] = applyDemoIcons(desktopApps, ASSET_BASE);

function LabAutoLauncher() {
  const { openWindow, state } = useWindowManager();
  const apps = useApps();
  const theme = useTheme();

  useEffect(() => {
    // Auto-launch Playbook and Terminal side by side if no windows exist yet
    if (state.windows.length === 0) {
      const leftX = Math.max(20, Math.floor((window.innerWidth - 1340) / 2));
      const playbookW = Math.min(580, Math.floor(window.innerWidth * 0.46));
      const terminalW = Math.min(780, Math.floor(window.innerWidth * 0.54));
      const targetH = Math.min(650, window.innerHeight - 110);

      const playbookBounds = pickInitialBounds(
        { kind: "app", appId: "playbook" },
        theme,
        apps,
        undefined,
        0
      );
      openWindow(
        { kind: "app", appId: "playbook" },
        {
          ...playbookBounds,
          x: leftX,
          y: 48,
          w: playbookW,
          h: targetH,
        }
      );

      const termBounds = pickInitialBounds(
        { kind: "app", appId: "terminal" },
        theme,
        apps,
        undefined,
        1
      );
      openWindow(
        { kind: "app", appId: "terminal" },
        {
          ...termBounds,
          x: leftX + playbookW + 16,
          y: 48,
          w: terminalW,
          h: targetH,
        }
      );
    }
  }, [state.windows.length, openWindow, theme, apps]);

  return null;
}

export default function DesktopPage() {
  const [themeChoice, setThemeChoice] =
    useState<DemoThemeChoice>(readInitialThemeChoice);
  const theme = useMemo<OsTheme>(
    () => buildDemoTheme(themeChoice, ASSET_BASE),
    [themeChoice],
  );

  const handleThemeChange = (choice: DemoThemeChoice) => {
    setThemeChoice(choice);
    persistThemeChoice(choice);
  };

  return (
    <Desktop apps={apps} theme={theme}>
      <DesktopInitializer />
      {themeChoice === "ubuntu" && <UbuntuQuickSettings />}
      <StartRecents />
      <ThemeSwitcher value={themeChoice} onChange={handleThemeChange} />
      <LabAutoLauncher />
    </Desktop>
  );
}
