'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import type { AppContentProps } from '@react-ui-os/core'
import { useApp, useTheme } from '@react-ui-os/desktop'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import '@xterm/xterm/css/xterm.css'
import './TulipTerminalApp.css'
import { tulipVmService } from '@/services/tulipVmService'
import { seedVmScenario, resetVmSeeder } from '@/services/vmScenarioSeeder'

/** Monospace font stack matching platform terminal fonts */
const MONO = '"SF Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace'

export function TulipTerminalApp({ focused }: AppContentProps) {
  const theme = useTheme()
  const app = useApp('terminal')
  const accent = app?.accent ?? theme.palette.accent ?? '#ff3366'

  const terminalRef = useRef<HTMLDivElement>(null)
  const termInstanceRef = useRef<Terminal | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)

  const [isResetting, setIsResetting] = useState(false)

  // Safe focus helper
  const focusTerminal = useCallback(() => {
    if (typeof window !== 'undefined') {
      const selection = window.getSelection()
      if (selection && selection.toString().length > 0) return
    }
    try {
      termInstanceRef.current?.focus()
    } catch {
      // Suppress transient unmount focus errors
    }
  }, [])

  // Initialize xterm and connect to tulipVmService
  useEffect(() => {
    if (!terminalRef.current) return

    // Ensure the VM is booting, then seed the lab scenario from the SSoT
    tulipVmService.boot().then(() => {
      seedVmScenario().catch((err) => {
        console.error('[TulipTerminalApp] Scenario seed error:', err)
      })
    }).catch((err) => {
      console.error('[TulipTerminalApp] VM boot error:', err)
    })

    const term = new Terminal({
      fontFamily: MONO,
      fontSize: 13,
      lineHeight: 1.25,
      cursorBlink: true,
      cursorStyle: 'block',
      allowTransparency: true,
      convertEol: true,
      scrollback: 5000,
      theme: {
        background: '#0e1117',
        foreground: '#e6edf3',
        cursor: accent,
        cursorAccent: '#0d1117',
        selectionBackground: 'rgba(255, 51, 102, 0.35)',
        selectionForeground: '#ffffff',
        black: '#1f242c',
        red: '#ff7b72',
        green: '#3fb950',
        yellow: '#d29922',
        blue: '#58a6ff',
        magenta: '#bc8cff',
        cyan: '#39c5cf',
        white: '#b1bac4',
        brightBlack: '#6e7681',
        brightRed: '#ffa198',
        brightGreen: '#56d364',
        brightYellow: '#e3b341',
        brightBlue: '#79c0ff',
        brightMagenta: '#d2a8ff',
        brightCyan: '#56d4dd',
        brightWhite: '#f0f6fc',
      },
    })

    const fitAddon = new FitAddon()
    term.loadAddon(fitAddon)

    term.open(terminalRef.current)
    termInstanceRef.current = term
    fitAddonRef.current = fitAddon

    // Safe fit
    const safeFit = () => {
      try {
        if (terminalRef.current && terminalRef.current.clientWidth > 40 && terminalRef.current.clientHeight > 40) {
          fitAddon.fit()
        }
      } catch {
        // Suppress fit errors during transient unmount/animation states
      }
    }

    // Delay first fit slightly to ensure DOM dimensions have settled, then claim focus
    const initialFitTimer = setTimeout(() => {
      safeFit()
      term.focus()
    }, 50)

    let reportedReady = false

    // Rehydrate circular buffer from VM
    const rawBuffer = tulipVmService.getRawBuffer()
    if (rawBuffer.length > 0) {
      term.write(rawBuffer)
      // Send newline so shell redraws prompt on current column width
      tulipVmService.serial0_send('\n')
      reportedReady = true
    } else {
      term.writeln('\x1b[36m[invernadero-central]\x1b[0m Conectando puerto serie ttyS0...')
      term.writeln('\x1b[90mIniciando consola para operario@invernadero-central:~$\x1b[0m')
      if (tulipVmService.getStatus() === 'ready') {
        term.writeln('\x1b[32m[invernadero-central]\x1b[0m Conectado (ttyS0) - operario@invernadero-central:~$\r\n')
        reportedReady = true
      }
    }

    // Forward terminal keyboard input to serial port via UTF-8 bytes
    const dataDisposable = term.onData((data) => {
      tulipVmService.serial0_send(data)
    })

    // High-throughput chunk streaming to eliminate per-byte rendering stutter
    const unsubscribeChunks = tulipVmService.subscribeSerialChunks((chunk) => {
      term.write(chunk)
    })

    // Subscribe to VM status changes to communicate state via terminal messages
    const unsubscribeStatus = tulipVmService.onStatusChange((status) => {
      if (status === 'ready') {
        if (!reportedReady) {
          reportedReady = true
          term.writeln('\r\n\x1b[32m[invernadero-central]\x1b[0m Conectado (ttyS0) - operario@invernadero-central:~$\r\n')
        }
      } else if (status === 'stopped') {
        reportedReady = false
        term.writeln('\r\n\x1b[31m[TULIP x86 OS]\x1b[0m Conexión detenida / desconectado.\r\n')
      } else if (status === 'booting') {
        reportedReady = false
      }
    })

    // ResizeObserver for dynamic window resizing
    const resizeObserver = new ResizeObserver(() => {
      safeFit()
    })
    resizeObserver.observe(terminalRef.current)

    return () => {
      clearTimeout(initialFitTimer)
      resizeObserver.disconnect()
      dataDisposable.dispose()
      unsubscribeChunks()
      unsubscribeStatus()
      term.dispose()
      termInstanceRef.current = null
      fitAddonRef.current = null
    }
  }, [accent])

  // Focus terminal when window gains focus or receives focus prop
  useEffect(() => {
    if (focused && termInstanceRef.current) {
      termInstanceRef.current.focus()
    }
  }, [focused])

  // Also reclaim focus when browser tab/window regains focus
  useEffect(() => {
    const handleWindowFocus = () => {
      if (focused && termInstanceRef.current) {
        termInstanceRef.current.focus()
      }
    }
    window.addEventListener('focus', handleWindowFocus)
    return () => window.removeEventListener('focus', handleWindowFocus)
  }, [focused])

  // Handle Cold Restart
  const handleReset = async () => {
    if (isResetting) return
    setIsResetting(true)
    const term = termInstanceRef.current
    if (term) {
      term.clear()
      term.writeln('\x1b[33m[TULIP x86 OS]\x1b[0m Reiniciando máquina virtual en frío...')
      term.writeln('\x1b[90mIniciando kernel Linux WebAssembly (Buildroot 6.8)...\x1b[0m')
    }
    resetVmSeeder() // allow re-seeding the scenario after reset
    try {
      await tulipVmService.reset()
    } catch (err) {
      console.error('[TulipTerminalApp] Error resetting VM:', err)
      term?.writeln('\r\n\x1b[31m[TULIP x86 OS]\x1b[0m Error al reiniciar la máquina virtual.\r\n')
    } finally {
      setIsResetting(false)
      // Restore focus to terminal immediately after reset completes
      setTimeout(() => {
        termInstanceRef.current?.focus()
      }, 60)
    }
  }

  return (
    <div
      className="tulip-terminal-container"
      onMouseDown={focusTerminal}
      onClick={focusTerminal}
    >
      <button
        type="button"
        className="tulip-terminal-floating-reset"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={handleReset}
        disabled={isResetting}
        title="Reiniciar máquina virtual en frío"
        aria-label="Reiniciar terminal"
      >
        <span className={isResetting ? 'tulip-terminal-spin' : ''}>↻</span>
        <span>{isResetting ? 'Reiniciando...' : 'Reiniciar'}</span>
      </button>

      {/* Screen container for XTerm */}
      <div ref={terminalRef} className="tulip-terminal-screen" />
    </div>
  )
}

export default TulipTerminalApp
