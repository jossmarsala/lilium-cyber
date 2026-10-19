"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import type { AppContentProps } from "@react-ui-os/core";
import { useWindowManager } from "@react-ui-os/core";
import { useApp, useApps, useTheme } from "@react-ui-os/desktop";
import {
  commandNames,
  completeCommand,
  runCommand,
} from "./shell";
import { lab1Store, useLab1Store } from "../../services/lab1/lab1Store";

/** Monospace stack matching the platform terminal fonts (SF Mono, Menlo, …). */
const MONO =
  '"SF Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';

/** One scrollback line: an echoed command (with prompt) or an output line. */
interface ScrollLine {
  id: number;
  kind: "command" | "output" | "error";
  text: string;
}

/** Format the prompt string from live store state. */
function buildPrompt(user: string, host: string, cwd: string): string {
  // Abbreviate home directory to ~
  const homeDir = user === "root" ? "/root" : `/home/${user}`;
  const displayCwd =
    cwd === homeDir
      ? "~"
      : cwd.startsWith(homeDir + "/")
        ? "~" + cwd.slice(homeDir.length)
        : cwd;
  const symbol = user === "root" ? "#" : "$";
  return `${user}@${host}:${displayCwd}${symbol} `;
}

/** Seed scrollback shown on first mount. */
function bootLines(user: string, host: string): ScrollLine[] {
  const texts = [
    `Laboratorio 1: El Invernadero — Auditoría y Respuesta a Incidentes`,
    `Aviso: Esta es una consola de terminal emulada en entorno de laboratorio.`,
    `Configuración inicial cargada con éxito.`,
    ``,
    `Estación Botánica Automatizada N.º 4 — ${host}`,
    `Linux 5.15.0-invernadero (x86_64) — Consola de Control`,
    ``,
    `Sesión iniciada como: ${user}`,
    `Escribe 'help' para ver los comandos disponibles.`,
    ``,
  ];
  return texts.map((text, id) => ({ id, kind: "output" as const, text }));
}

export function TerminalContent({ focused }: AppContentProps) {
  const theme = useTheme();
  const accent = useApp("terminal")?.accent ?? theme.palette.accent;
  const apps = useApps();
  const { openWindow } = useWindowManager();

  // ── Subscribe to lab1Store ───────────────────────────────────────────────
  const currentUser = useLab1Store((s) => s.currentUser);
  const hostname = useLab1Store((s) => s.hostname);
  const cwd = useLab1Store((s) => s.cwd);

  // ── Local terminal state ─────────────────────────────────────────────────
  const [lines, setLines] = useState<ScrollLine[]>(() =>
    bootLines(currentUser, hostname),
  );
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  // -1 means "editing a fresh line"; otherwise an index into `history`.
  const [historyCursor, setHistoryCursor] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lineId = useRef(lines.length);

  const openableAppIds = useMemo(() => apps.map((a) => a.id), [apps]);
  const appLabels = useMemo(() => {
    const labels: Record<string, string> = {};
    for (const a of apps) labels[a.id] = a.name;
    return labels;
  }, [apps]);

  const appendLines = useCallback((incoming: Omit<ScrollLine, "id">[]) => {
    setLines((prev) => {
      const next = incoming.map((l) => ({ ...l, id: lineId.current++ }));
      return [...prev, ...next];
    });
  }, []);

  const submit = useCallback(
    (raw: string) => {
      // Read live state at command dispatch time (not a stale closure)
      const liveState = lab1Store.getState();
      const promptPrefix = buildPrompt(
        liveState.currentUser,
        liveState.hostname,
        liveState.cwd,
      );

      // Always echo the entered line with its prompt.
      appendLines([{ kind: "command", text: `${promptPrefix}${raw}` }]);

      const trimmed = raw.trim();
      const nextHistory = trimmed === "" ? history : [...history, trimmed];
      if (trimmed !== "") setHistory(nextHistory);
      setHistoryCursor(-1);
      setInput("");

      const result = runCommand(raw, {
        state: liveState,
        openableAppIds,
        appLabels,
        history: nextHistory,
      });

      if (result.signal.type === "clear") {
        setLines([]);
        lineId.current = 0;
        return;
      }

      if (result.signal.type === "open") {
        openWindow({ kind: "app", appId: result.signal.appId });
      }

      if (result.signal.type === "cd") {
        lab1Store.setCwd(result.signal.path);
      }

      if (result.signal.type === "su") {
        const newUser = result.signal.user;
        lab1Store.setCurrentUser(newUser);
        // Move cwd to new user's home directory
        const newHome =
          newUser === "root" ? "/root" : `/home/${newUser}`;
        const newHomeNode = lab1Store.getState().fs[newHome];
        if (newHomeNode) {
          lab1Store.setCwd(newHome);
        }
      }

      if (result.output.length > 0) {
        appendLines(result.output.map((text) => ({ kind: "output" as const, text })));
      }

      // Guarantee the input maintains focus immediately after command execution.
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    },
    [appendLines, appLabels, history, openableAppIds, openWindow],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        submit(input);
        return;
      }
      // Readline-style history recall.
      if (event.key === "ArrowUp") {
        event.preventDefault();
        if (history.length === 0) return;
        const next =
          historyCursor === -1 ? history.length - 1 : Math.max(0, historyCursor - 1);
        setHistoryCursor(next);
        setInput(history[next] ?? "");
        return;
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (historyCursor === -1) return;
        const next = historyCursor + 1;
        if (next >= history.length) {
          setHistoryCursor(-1);
          setInput("");
        } else {
          setHistoryCursor(next);
          setInput(history[next] ?? "");
        }
        return;
      }
      // Tab completion for the first word (command name).
      if (event.key === "Tab") {
        event.preventDefault();
        if (input.includes(" ")) return;
        const matches = completeCommand(input);
        if (matches.length === 1) {
          setInput(matches[0] ?? input);
        } else if (matches.length > 1) {
          appendLines([{ kind: "output", text: matches.join("  ") }]);
        }
        return;
      }
    },
    [appendLines, history, historyCursor, input, submit],
  );

  // Auto-scroll to the bottom whenever new output lands.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  // Pull focus to the input when the window gains focus.
  useEffect(() => {
    if (focused) inputRef.current?.focus();
  }, [focused]);

  // Maintain focus on window focus events.
  useEffect(() => {
    const handleWinFocus = () => {
      if (focused) inputRef.current?.focus();
    };
    window.addEventListener("focus", handleWinFocus);
    return () => window.removeEventListener("focus", handleWinFocus);
  }, [focused]);

  const focusInput = useCallback(() => {
    if (typeof window !== "undefined") {
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) return;
    }
    inputRef.current?.focus();
  }, []);

  // ── Styles ───────────────────────────────────────────────────────────────
  const surfaceStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    minHeight: 0,
    background: theme.palette.background,
    color: theme.palette.textPrimary,
    borderRadius: theme.shape.small,
    border: `1px solid ${focused ? accent : theme.palette.border}`,
    fontFamily: MONO,
    fontSize: 13,
    lineHeight: 1.5,
    overflow: "hidden",
    transition: `border-color ${theme.motion.dockHoverDurationMs}ms ${theme.motion.windowOpenEasing}`,
  };

  const scrollStyle: CSSProperties = {
    flex: "1 1 auto",
    minHeight: 0,
    overflowY: "auto",
    padding: "10px 12px",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  };

  const inputRowStyle: CSSProperties = {
    flex: "0 0 auto",
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    borderTop: `1px solid ${theme.palette.border}`,
  };

  const promptStyle: CSSProperties = {
    color: accent,
    fontWeight: 600,
    whiteSpace: "nowrap",
    userSelect: "none",
  };

  const inputStyle: CSSProperties = {
    flex: "1 1 auto",
    appearance: "none",
    border: "none",
    outline: "none",
    background: "transparent",
    color: theme.palette.textPrimary,
    caretColor: accent,
    fontFamily: MONO,
    fontSize: 13,
    lineHeight: 1.5,
    minWidth: 0,
  };

  // Build the live prompt to show in the input row
  const livePrompt = buildPrompt(currentUser, hostname, cwd);

  return (
    <div style={surfaceStyle} onMouseDown={focusInput}>
      <div
        ref={scrollRef}
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
        style={scrollStyle}
      >
        {lines.map((line) => (
          <div
            key={line.id}
            style={{
              color:
                line.kind === "command"
                  ? theme.palette.textPrimary
                  : line.kind === "error"
                    ? "#ff6b6b"
                    : theme.palette.textSecondary,
            }}
          >
            {line.text}
          </div>
        ))}
      </div>
      <div style={inputRowStyle}>
        <span aria-hidden style={promptStyle}>
          {livePrompt}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          aria-label="Terminal command input"
          placeholder=""
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={inputStyle}
        />
      </div>
    </div>
  );
}

// Re-export for backward-compat consumers that may import from this file.
export { commandNames };
