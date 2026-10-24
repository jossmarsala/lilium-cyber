/**
 * Declarative Real-Time Lab Verification Engine
 * Evaluates lab milestones (v1-*, v2-*, v3-*) based on:
 *   (a) Commands executed in v86 serial terminal
 *   (b) Terminal stdout
 *   (c) Cuaderno de Campo (bitacora findings & consignas)
 * Enforces sequential phase locking and native @react-ui-os toasts.
 */

import { notify } from '@react-ui-os/core'
import type { BitacoraFinding, ConsignaAssignment } from '@/os-apps/notes/bitacora-store'
import type {
  CommandRecord,
  LabVerificationConfig,
  LabVerificationListener,
  LabVerificationState,
  VerificationContext,
  VerificationRule,
} from './types'
import { getLabVerificationConfig } from './rules'
import { liliumVmService } from '@/services/liliumVmService'
import { getLabSetupScript } from '@/data/compiledLabs'

const MAX_OUTPUT_BUFFER_LENGTH = 131072 // 128 KB
const EVAL_DEBOUNCE_MS = 250

export class LabVerificationEngine {
  private labId = 'lab-01'
  private config: LabVerificationConfig
  private checkedItems: Record<string, boolean> = {}
  private completedPhases: Record<string, boolean> = {}
  private commandHistory: CommandRecord[] = []
  private recentOutput = ''
  private notifiedItems = new Set<string>()
  private notifiedPhases = new Set<string>()
  private listeners = new Set<LabVerificationListener>()
  private isEvaluating = false
  private evalTimer: ReturnType<typeof setTimeout> | null = null

  // Line assembler for terminal keyboard input
  private inputLineBuffer = ''

  constructor(labId = 'lab-01') {
    this.labId = labId
    this.config = getLabVerificationConfig(labId)
    this.loadState()
    this.setupStorageListeners()
    this.setupVmListeners()
  }

  private setupVmListeners(): void {
    // Automatically observe any serial input sent to the VM (excluding muted SSoT commands)
    liliumVmService.subscribeSerialInput((data) => {
      if (liliumVmService.getIsSerialMuted()) return
      this.onTerminalInput(data)
    })

    // Automatically observe any serial output chunks from the VM (excluding muted SSoT output)
    liliumVmService.subscribeSerialChunks((chunk) => {
      if (liliumVmService.getIsSerialMuted()) return
      this.onSerialOutputChunk(chunk)
    })
  }

  /* ── Storage Keys ── */
  private getStorageKeys() {
    return {
      checklist:
        this.labId === 'lab-01'
          ? 'lilium_lab_01_playbook_checklist_v1'
          : `lilium_${this.labId}_playbook_checklist_v1`,
      phasesDone:
        this.labId === 'lab-01'
          ? 'lilium_lab_01_phases_completed_v1'
          : `lilium_${this.labId}_phases_completed_v1`,
      notifiedItems: `lilium_${this.labId}_notified_verifications_v1`,
      notifiedPhases: `lilium_${this.labId}_notified_phases_v1`,
      commandHistory: `lilium_${this.labId}_cmd_history_v1`,
    }
  }

  /* ── State Loading & Persistence ── */
  private loadState(): void {
    if (typeof window === 'undefined') return
    const keys = this.getStorageKeys()

    try {
      const savedChecklist = localStorage.getItem(keys.checklist)
      if (savedChecklist) {
        this.checkedItems = JSON.parse(savedChecklist)
      }
    } catch (err) {
      console.warn('[LabVerificationEngine] Error loading checklist:', err)
    }

    try {
      const savedPhases = localStorage.getItem(keys.phasesDone)
      if (savedPhases) {
        this.completedPhases = JSON.parse(savedPhases)
      }
    } catch (err) {
      console.warn('[LabVerificationEngine] Error loading phases:', err)
    }

    try {
      const savedNotifiedItems = localStorage.getItem(keys.notifiedItems)
      if (savedNotifiedItems) {
        const arr: string[] = JSON.parse(savedNotifiedItems)
        this.notifiedItems = new Set(arr)
      } else {
        // Pre-populate with already completed items so we don't spam notifications on initial load
        this.notifiedItems = new Set(
          Object.keys(this.checkedItems).filter((k) => this.checkedItems[k])
        )
      }
    } catch (err) {
      console.warn('[LabVerificationEngine] Error loading notified items:', err)
    }

    try {
      const savedNotifiedPhases = localStorage.getItem(keys.notifiedPhases)
      if (savedNotifiedPhases) {
        const arr: string[] = JSON.parse(savedNotifiedPhases)
        this.notifiedPhases = new Set(arr)
      } else {
        this.notifiedPhases = new Set(
          Object.keys(this.completedPhases).filter((k) => this.completedPhases[k])
        )
      }
    } catch (err) {
      console.warn('[LabVerificationEngine] Error loading notified phases:', err)
    }

    try {
      const savedCmds = sessionStorage.getItem(keys.commandHistory)
      if (savedCmds) {
        const rawHistory: CommandRecord[] = JSON.parse(savedCmds)
        const cleanHistory = rawHistory.filter((c) => !this.isSsotCommand(c.command))
        this.commandHistory = cleanHistory
        if (cleanHistory.length !== rawHistory.length) {
          sessionStorage.setItem(keys.commandHistory, JSON.stringify(cleanHistory.slice(-200)))
        }
      }
    } catch (err) {
      console.warn('[LabVerificationEngine] Error loading command history:', err)
    }

    // Sanitize any state falsely checked by past SSoT initialization runs
    if (this.commandHistory.length === 0) {
      const automatedRuleIds = [
        'v1.1-whoami',
        'v1.1-id',
        'v1.1-hostname',
        'v1.1-uname',
        'v1.1-os-release',
        'v1.1-uptime',
        'v1-nobrk',
        'v1-base',
      ]
      let cleanedAny = false
      for (const id of automatedRuleIds) {
        if (this.checkedItems[id]) {
          delete this.checkedItems[id]
          cleanedAny = true
        }
      }
      if (cleanedAny) {
        delete this.completedPhases['fase-1']
      }
    }
  }

  private saveState(): void {
    if (typeof window === 'undefined') return
    const keys = this.getStorageKeys()

    try {
      localStorage.setItem(keys.checklist, JSON.stringify(this.checkedItems))
      localStorage.setItem(keys.phasesDone, JSON.stringify(this.completedPhases))
      localStorage.setItem(
        keys.notifiedItems,
        JSON.stringify(Array.from(this.notifiedItems))
      )
      localStorage.setItem(
        keys.notifiedPhases,
        JSON.stringify(Array.from(this.notifiedPhases))
      )
      sessionStorage.setItem(keys.commandHistory, JSON.stringify(this.commandHistory.slice(-200)))
    } catch (err) {
      console.warn('[LabVerificationEngine] Error saving state:', err)
    }

    this.notifyListeners()
  }

  /* ── Storage Listeners for Inter-Tab & Bitácora Sync ── */
  private setupStorageListeners(): void {
    if (typeof window === 'undefined') return

    const handleStorageChange = (e: Event) => {
      // Re-evaluate whenever bitacora or checklist changes
      this.scheduleEvaluation()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('react-ui-os:storage-changed', handleStorageChange)
  }

  /* ── Active Phase & Sequential Lock Logic ── */
  public getActivePhaseId(): string {
    const phases = this.config.phases
    for (const phase of phases) {
      if (!this.completedPhases[phase.id]) {
        return phase.id
      }
    }
    return phases[phases.length - 1]?.id ?? 'fase-1'
  }

  public isPhaseLocked(phaseId: string): boolean {
    const phases = this.config.phases
    const targetIdx = phases.findIndex((p) => p.id === phaseId)
    if (targetIdx <= 0) return false // First phase is always unlocked

    // Locked if previous phase is not completed
    const prevPhase = phases[targetIdx - 1]
    return !this.completedPhases[prevPhase.id]
  }

  /* ── Bitácora / Cuaderno de Campo Readers ── */
  public getBitacoraFindings(): BitacoraFinding[] {
    if (typeof window === 'undefined') return []
    try {
      const raw =
        localStorage.getItem('rui-os:lilium_bitacora_findings_v2') ||
        localStorage.getItem('lilium_bitacora_findings_v2') ||
        localStorage.getItem('rui-os:lilium_bitacora_findings_v1') ||
        localStorage.getItem('lilium_bitacora_findings_v1')
      if (raw) return JSON.parse(raw)
    } catch (err) {
      console.warn('[LabVerificationEngine] Error reading findings:', err)
    }
    return []
  }

  public getBitacoraConsignas(): ConsignaAssignment[] {
    if (typeof window === 'undefined') return []
    try {
      const raw =
        localStorage.getItem(`rui-os:lilium_bitacora_consignas_v1_${this.labId}`) ||
        localStorage.getItem(`lilium_bitacora_consignas_v1_${this.labId}`)
      if (raw) return JSON.parse(raw)
    } catch (err) {
      console.warn('[LabVerificationEngine] Error reading consignas:', err)
    }
    return []
  }

  /* ── Terminal Input & Output Ingestion ── */
  /**
   * Identifies whether a command belongs to the SSoT environment setup/provisioning scripts
   * so it is never recorded or counted toward lab milestone verification.
   */
  public isSsotCommand(cmd: string): boolean {
    const trimmed = cmd.trim()
    if (!trimmed) return true

    // Heredocs, script headers, and environment provisioning markers
    if (
      trimmed.startsWith('#!') ||
      trimmed.includes('<<') ||
      trimmed.startsWith('cat >') ||
      trimmed.includes('ELF_BASE64_EOF') ||
      trimmed.includes('DPKG_EOF') ||
      trimmed.includes('J_EOF') ||
      trimmed.includes('LILIUM_EOF') ||
      trimmed.includes('base64 -d >') ||
      trimmed.startsWith('umask 022') ||
      trimmed.startsWith('export PATH=') ||
      trimmed.startsWith('export USER=') ||
      trimmed.startsWith('export HOME=') ||
      trimmed.startsWith('export HOSTNAME=') ||
      trimmed.startsWith('export PS1=') ||
      trimmed.includes('/var/lib/tulip/services') ||
      trimmed.startsWith('adduser -D') ||
      trimmed.startsWith('mkdir -p /bin /usr/bin') ||
      trimmed.startsWith('pkill -f') ||
      trimmed.includes('LILIUM-BACKUP/1') ||
      trimmed.includes('status=PARTIAL') ||
      trimmed.includes('backup_id=BKP') ||
      trimmed.includes('127.0.0.1 localhost') ||
      trimmed.includes('nameserver 10.0.2.3') ||
      trimmed.startsWith('chmod 755 /usr/local/bin/') ||
      trimmed.startsWith('chmod 755 /usr/bin/')
    ) {
      return true
    }

    // Direct match against compiled SSoT setup lines for this lab
    const setupLines = getLabSetupScript(this.labId)
    if (setupLines.length > 0) {
      const lower = trimmed.toLowerCase()
      if (setupLines.some((line) => line.trim().toLowerCase() === lower)) {
        return true
      }
    }

    return false
  }

  /**
   * Feed raw keystrokes/data from xterm or serial0_send.
   * Assembles whole commands when Enter (\r or \n) is encountered.
   */
  public onTerminalInput(data: string | Uint8Array): void {
    if (liliumVmService.getIsSerialMuted()) {
      this.inputLineBuffer = ''
      return
    }

    const text =
      typeof data === 'string'
        ? data
        : new TextDecoder('utf-8', { fatal: false }).decode(data)

    for (let i = 0; i < text.length; i++) {
      const char = text[i]

      // Filter ANSI escape sequences (arrow keys, etc.)
      if (char === '\x1b') {
        while (i + 1 < text.length && !/[a-zA-Z~]/.test(text[i + 1])) {
          i++
        }
        if (i + 1 < text.length) i++
        continue
      }

      if (char === '\r' || char === '\n') {
        const cmd = this.inputLineBuffer.trim()
        if (cmd.length > 0) {
          this.recordCommand(cmd)
        }
        this.inputLineBuffer = ''
      } else if (char === '\x7f' || char === '\x08') {
        // Backspace
        this.inputLineBuffer = this.inputLineBuffer.slice(0, -1)
      } else if (char === '\x03' || char === '\x15') {
        // Ctrl+C or Ctrl+U
        this.inputLineBuffer = ''
      } else if (char >= ' ' || char === '\t') {
        this.inputLineBuffer += char
      }
    }
  }

  /**
   * Record a verified command line executed in terminal.
   */
  public recordCommand(cmd: string): void {
    const trimmed = cmd.trim()
    if (!trimmed) return

    // Never include SSoT setup commands in lab verification
    if (this.isSsotCommand(trimmed)) {
      return
    }

    const activePhaseId = this.getActivePhaseId()
    const record: CommandRecord = {
      command: trimmed,
      timestamp: Date.now(),
      phaseId: activePhaseId,
    }

    this.commandHistory.push(record)
    if (this.commandHistory.length > 250) {
      this.commandHistory.shift()
    }

    // Evaluate immediately on command execution
    this.evaluate()
  }

  /**
   * Feed output chunk from ttyS0 to accumulate stdout for regex evaluation.
   */
  public onSerialOutputChunk(chunk: Uint8Array | string): void {
    if (liliumVmService.getIsSerialMuted()) {
      return
    }

    const text =
      typeof chunk === 'string'
        ? chunk
        : new TextDecoder('utf-8', { fatal: false }).decode(chunk)

    this.recentOutput += text
    if (this.recentOutput.length > MAX_OUTPUT_BUFFER_LENGTH) {
      this.recentOutput = this.recentOutput.slice(-MAX_OUTPUT_BUFFER_LENGTH / 2)
    }

    // Also parse commands echoed by the Linux shell
    this.detectEchoedCommands(text)

    this.scheduleEvaluation()
  }

  /**
   * Parses commands echoed by the Linux shell prompt.
   * Example: "operario@invernadero-central:~$ whoami\r\n"
   */
  private detectEchoedCommands(chunkText: string): void {
    const lines = chunkText.split(/\r?\n/)
    const promptRegex = /(?:operario@invernadero-central|invernadero-central|~|#|\$)\s*[:#$]\s*(.+)$/i

    for (const line of lines) {
      const match = line.match(promptRegex)
      if (match && match[1]) {
        const rawCmd = match[1].trim()
        // Ensure it's not empty, not just control characters, and not already recorded recently
        if (rawCmd.length > 0 && !rawCmd.startsWith('\x1b')) {
          const last = this.commandHistory[this.commandHistory.length - 1]
          if (!last || last.command !== rawCmd || Date.now() - last.timestamp > 1500) {
            this.recordCommand(rawCmd)
          }
        }
      }
    }
  }

  private scheduleEvaluation(): void {
    if (this.evalTimer) return
    this.evalTimer = setTimeout(() => {
      this.evalTimer = null
      this.evaluate()
    }, EVAL_DEBOUNCE_MS)
  }

  /* ── Core Evaluation Routine ── */
  public async evaluate(): Promise<void> {
    if (this.isEvaluating) return
    this.isEvaluating = true

    try {
      const activePhaseId = this.getActivePhaseId()
      const currentPhaseConfig = this.config.phases.find(
        (p) => p.id === activePhaseId
      )

      if (!currentPhaseConfig) return

      const findings = this.getBitacoraFindings()
      const consignas = this.getBitacoraConsignas()

      const context: VerificationContext = {
        labId: this.labId,
        activePhaseId,
        completedPhases: { ...this.completedPhases },
        checkedItems: { ...this.checkedItems },
        commandHistory: [...this.commandHistory],
        lastCommand: this.commandHistory[this.commandHistory.length - 1],
        terminalOutput: this.recentOutput,
        recentTerminalOutput: this.recentOutput.slice(-4096),
        findings,
        consignas,
      }

      let stateChanged = false

      // Only evaluate rules of the active phase (sequential phase locking)
      for (const rule of currentPhaseConfig.rules) {
        if (this.checkedItems[rule.id]) {
          continue // Already completed
        }

        const isSatisfied = await this.evaluateRule(rule, context)
        if (isSatisfied) {
          this.checkedItems[rule.id] = true
          stateChanged = true

          // Fire native toast notification once
          if (!this.notifiedItems.has(rule.id)) {
            this.notifiedItems.add(rule.id)
            notify({
              appId: 'playbook',
              title: `✓ Sub-paso cumplido: ${rule.command || rule.title}`,
              body: `${rule.title} — ${rule.description}`,
              level: 'success',
              duration: 4000,
            })
          }
        }
      }

      this.syncLegacyMilestoneKeys()

      // Check if all rules for this phase are satisfied
      const phaseRules = currentPhaseConfig.rules
      const completedRulesCount = phaseRules.filter((r) => this.checkedItems[r.id]).length
      const allPhaseRulesDone =
        completedRulesCount === phaseRules.length ||
        (completedRulesCount >= Math.floor(phaseRules.length * 0.85) &&
          (activePhaseId !== 'fase-1' || Boolean(this.checkedItems['v1-nobrk'])) &&
          (activePhaseId !== 'fase-2' ||
            (Boolean(this.checkedItems['v2.5-kill-polilla']) &&
              Boolean(this.checkedItems['v2.5-ps-verify']))) &&
          (activePhaseId !== 'fase-3' ||
            (Boolean(this.checkedItems['v3.1-usermod-nologin']) &&
              Boolean(this.checkedItems['v3.2-chmod-ssh']) &&
              Boolean(this.checkedItems['v3.3-disable-ssh']))))

      if (allPhaseRulesDone && !this.completedPhases[activePhaseId]) {
        this.completedPhases[activePhaseId] = true
        stateChanged = true

        if (!this.notifiedPhases.has(activePhaseId)) {
          this.notifiedPhases.add(activePhaseId)
          this.broadcastPhaseCompletion(currentPhaseConfig.id, currentPhaseConfig.number)
        }
      }

      if (stateChanged) {
        this.saveState()
      }
    } catch (err) {
      console.warn('[LabVerificationEngine] Evaluation error:', err)
    } finally {
      this.isEvaluating = false
    }
  }

  private syncLegacyMilestoneKeys(): void {
    const c = this.checkedItems
    if (c['v1.1-whoami'] || c['v1.1-id'] || c['v1.1-hostname']) c['v1-base'] = true
    if (c['v1.2-cat-inventario'] || c['v1.2-dpkg-l']) c['v1-inv'] = true
    if (c['v1.3-cat-passwd'] || c['v1.3-passwd-ex-cuidador']) c['v1-users'] = true
    if (c['v1.4-ls-sensitive'] || c['v1.4-file-tmp']) c['v1-perms'] = true
    if (c['v1.5-ip-addr'] || c['v1.5-ss-tulpn'] || c['v1.5-nginx-status']) c['v1-net'] = true
    if (c['v1.6-cat-actividad'] || c['v1.6-journalctl']) c['v1-logs'] = true
    if (c['v2.2-cat-polilla'] || c['v2.2-cat-riego']) c['v2-proc'] = true
    if (c['v2.3-file-pdf'] || c['v2.3-strings-pdf']) c['v2-pdf'] = true
    if (c['v2.4-cat-bak'] || c['v2.4-cat-manifest']) c['v2-bak'] = true
    if (c['v2.5-kill-polilla']) c['v2-kill'] = true
    if (c['v2.5-ps-riego'] || c['v2.5-nginx-status']) c['v2-srv'] = true
    if (c['v3.1-usermod-nologin'] || c['v3.1-usermod-lock']) c['v3-acc'] = true
    if (c['v3.2-chmod-ssh'] || c['v3.2-chmod-conf']) c['v3-perms'] = true
    if (c['v3.3-disable-ssh']) c['v3-ssh'] = true
    if (c['v3.3-nginx-verify'] || c['v3.5-nginx']) c['v3-alive'] = true
    if (c['v3.4-apt-upgradable']) c['v3-patch'] = true
  }

  private async evaluateRule(
    rule: VerificationRule,
    ctx: VerificationContext
  ): Promise<boolean> {
    // 1. Custom evaluation function
    if (rule.evaluate) {
      try {
        const result = await rule.evaluate(ctx)
        if (result) return true
      } catch (err) {
        console.warn(`[LabVerificationEngine] Error in rule.evaluate (${rule.id}):`, err)
      }
    }

    // 2. Command pattern detection in active phase history
    if (rule.commandPatterns && rule.commandPatterns.length > 0) {
      const activePhaseCmds = ctx.commandHistory.filter(
        (c) => c.phaseId === ctx.activePhaseId
      )

      const matchesAnyCommand = activePhaseCmds.some((record) =>
        rule.commandPatterns!.some((pattern) => {
          if (typeof pattern === 'string') {
            return record.command.toLowerCase().includes(pattern.toLowerCase())
          }
          return pattern.test(record.command)
        })
      )

      if (matchesAnyCommand) return true
    }

    // 3. Output pattern detection in recent terminal output
    if (rule.outputPatterns && rule.outputPatterns.length > 0) {
      const matchesAnyOutput = rule.outputPatterns.some((pattern) => {
        if (typeof pattern === 'string') {
          return ctx.recentTerminalOutput.toLowerCase().includes(pattern.toLowerCase())
        }
        return pattern.test(ctx.recentTerminalOutput)
      })

      if (matchesAnyOutput) return true
    }

    return false
  }

  private broadcastPhaseCompletion(phaseId: string, phaseNumber: string): void {
    if (phaseId === 'fase-1') {
      notify({
        appId: 'playbook',
        title: '🎉 ¡Fase 1 Completada con Éxito!',
        body: 'Has cumplido todos los sub-pasos de auditoría y línea base. ¡Fase 2 desbloqueada!',
        level: 'success',
        duration: 8000,
      })
    } else if (phaseId === 'fase-2') {
      notify({
        appId: 'playbook',
        title: '🛡️ ¡Fase 2 Completada con Éxito!',
        body: 'Has preservado la evidencia y ejecutado la contención controlada. ¡Fase 3 desbloqueada!',
        level: 'success',
        duration: 8000,
      })
    } else if (phaseId === 'fase-3') {
      notify({
        appId: 'playbook',
        title: '🏆 ¡Laboratorio 1 Completado al 100%!',
        body: '¡Felicitaciones! Has completado con éxito todas las fases y controles de seguridad de La Estación Olvidada.',
        level: 'success',
        duration: 10000,
      })
    }
  }

  /* ── Interactive Toggles for Playbook UI ── */
  public toggleCheckItem(itemId: string, phaseId: string): void {
    const nextVal = !this.checkedItems[itemId]
    this.checkedItems[itemId] = nextVal

    if (nextVal && !this.notifiedItems.has(itemId)) {
      this.notifiedItems.add(itemId)
      const rule = this.config.phases
        .flatMap((p) => p.rules)
        .find((r) => r.id === itemId)

      if (rule) {
        notify({
          appId: 'playbook',
          title: `✓ Sub-paso cumplido: ${rule.command || rule.title}`,
          body: `${rule.title} — ${rule.description}`,
          level: 'success',
          duration: 4000,
        })
      }
    }

    // Check if phase is completed
    const targetPhase = this.config.phases.find((p) => p.id === phaseId)
    if (targetPhase) {
      const allDone = targetPhase.rules.every((r) => this.checkedItems[r.id])
      if (allDone && !this.completedPhases[phaseId]) {
        this.completedPhases[phaseId] = true
        if (!this.notifiedPhases.has(phaseId)) {
          this.notifiedPhases.add(phaseId)
          this.broadcastPhaseCompletion(targetPhase.id, targetPhase.number)
        }
      } else if (!allDone && this.completedPhases[phaseId]) {
        this.completedPhases[phaseId] = false
      }
    }

    this.saveState()
  }

  public togglePhaseCompleted(phaseId: string, forceValue?: boolean): void {
    const nextVal =
      forceValue !== undefined ? forceValue : !this.completedPhases[phaseId]
    this.completedPhases[phaseId] = nextVal

    if (nextVal && !this.notifiedPhases.has(phaseId)) {
      this.notifiedPhases.add(phaseId)
      const targetPhase = this.config.phases.find((p) => p.id === phaseId)
      if (targetPhase) {
        this.broadcastPhaseCompletion(targetPhase.id, targetPhase.number)
      }
    }

    this.saveState()
  }

  public resetProgress(): void {
    this.checkedItems = {}
    this.completedPhases = {}
    this.commandHistory = []
    this.notifiedItems.clear()
    this.notifiedPhases.clear()
    this.recentOutput = ''
    this.saveState()

    notify({
      appId: 'playbook',
      title: 'Progreso del Laboratorio Reiniciado',
      body: 'Todas las verificaciones y fases han vuelto a su estado inicial.',
      level: 'info',
      duration: 5000,
    })
  }

  /* ── Subscriptions & State Accessors ── */
  public getState(): LabVerificationState {
    return {
      labId: this.labId,
      activePhaseId: this.getActivePhaseId(),
      completedPhases: { ...this.completedPhases },
      checkedItems: { ...this.checkedItems },
      commandHistory: [...this.commandHistory],
      isEvaluating: this.isEvaluating,
    }
  }

  public subscribe(listener: LabVerificationListener): () => void {
    this.listeners.add(listener)
    listener(this.getState())
    return () => {
      this.listeners.delete(listener)
    }
  }

  private notifyListeners(): void {
    const state = this.getState()
    for (const listener of this.listeners) {
      try {
        listener(state)
      } catch (err) {
        console.error('[LabVerificationEngine] Listener error:', err)
      }
    }
  }

  public setLabId(labId: string): void {
    if (this.labId === labId) return
    this.labId = labId
    this.config = getLabVerificationConfig(labId)
    this.loadState()
    this.notifyListeners()
  }
}

export const labVerificationEngine = new LabVerificationEngine('lab-01')
