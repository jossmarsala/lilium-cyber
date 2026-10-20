import type { BitacoraFinding, ConsignaAssignment } from '@/os-apps/notes/bitacora-store'

export interface CommandRecord {
  command: string
  timestamp: number
  phaseId: string
}

export interface VerificationContext {
  labId: string
  activePhaseId: string
  completedPhases: Record<string, boolean>
  checkedItems: Record<string, boolean>
  commandHistory: CommandRecord[]
  lastCommand?: CommandRecord
  terminalOutput: string
  recentTerminalOutput: string
  findings: BitacoraFinding[]
  consignas: ConsignaAssignment[]
}

export type RuleEvaluationResult = boolean | Promise<boolean>

export interface VerificationRule {
  id: string // e.g. 'v1.1-whoami'
  phaseId: string // e.g. 'fase-1'
  stepId?: string // e.g. '1.1'
  command?: string // e.g. 'whoami'
  title: string // e.g. '[Paso 1.1] whoami'
  description: string

  /**
   * (a) Command patterns matching commands executed in the serial terminal
   */
  commandPatterns?: Array<string | RegExp>

  /**
   * (b) Output patterns matching text printed in terminal stdout
   */
  outputPatterns?: Array<string | RegExp>

  /**
   * Disallowed commands (e.g. for non-destructive / no-break verification)
   */
  disallowedCommandPatterns?: Array<string | RegExp>

  /**
   * (c) Custom evaluation function combining commands, stdout, and Cuaderno de Campo
   */
  evaluate?: (ctx: VerificationContext) => RuleEvaluationResult
}

export interface LabVerificationPhaseConfig {
  id: string
  number: string
  title: string
  rules: VerificationRule[]
}

export interface LabVerificationConfig {
  labId: string
  phases: LabVerificationPhaseConfig[]
}

export interface LabVerificationState {
  labId: string
  activePhaseId: string
  completedPhases: Record<string, boolean>
  checkedItems: Record<string, boolean>
  commandHistory: CommandRecord[]
  isEvaluating: boolean
}

export type LabVerificationListener = (state: LabVerificationState) => void
