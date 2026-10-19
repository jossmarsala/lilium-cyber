#!/usr/bin/env node
/**
 * scripts/compile-labs.ts
 *
 * Build-time compiler: reads docs/labs/lab-XX/ markdown files and emits
 * src/data/compiledLabs.ts — the typed TypeScript module consumed by the
 * fictional OS apps (Playbook, Notes) at runtime.
 *
 * Schema per lab directory:
 *   playbook.md    → PlaybookPhase[]   (phases, directives, hints, guide, verifications)
 *   ssot-commands.md → string          (raw markdown injected into Notes SSoT note)
 *   notes.md       → LabNote[]         (pre-seeded notes for the Notes app)
 *
 * Run:
 *   node --loader ts-node/esm scripts/compile-labs.ts
 *   OR (after building):
 *   npx ts-node scripts/compile-labs.ts
 */

import fs from 'fs'
import path from 'path'

// ---------------------------------------------------------------------------
// Types (mirror of src/components/apps/LiliumPlaybookApp.tsx)
// ---------------------------------------------------------------------------

interface PlaybookPhaseHint {
  tool: string
  description: string
  command?: string
}

interface PlaybookPhaseStep {
  action: string
  command?: string
  detail?: string
}

interface PlaybookPhaseGuide {
  sectionTitle: string
  rationale: string
  steps: PlaybookPhaseStep[]
}

interface PlaybookPhaseVerification {
  id: string
  label: string
}

interface PlaybookPhase {
  id: string
  number: string
  title: string
  subtitle: string
  directives: { title: string; text: string }[]
  hints: PlaybookPhaseHint[]
  pedagogicalGuide: PlaybookPhaseGuide[]
  verification: PlaybookPhaseVerification[]
}

interface LabNote {
  id: string
  body: string
  createdAt: number
  updatedAt: number
}

interface CompiledLab {
  id: string
  title: string
  metadata?: {
    titulo?: string
    laboratorio?: string
    idioma?: string
    referencia?: string
    formato?: string
    [key: string]: string | undefined
  }
  mission?: string
  rules?: string[]
  helpGuide?: string
  phases: PlaybookPhase[]
  ssotCommands: string
  notes: LabNote[]
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Split markdown into H2 sections, returning [heading, body] pairs. */
function splitH2Sections(md: string): Array<{ heading: string; body: string }> {
  const lines = md.split('\n')
  const sections: Array<{ heading: string; body: string }> = []
  let current: { heading: string; lines: string[] } | null = null

  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (current) sections.push({ heading: current.heading, body: current.lines.join('\n') })
      current = { heading: line.slice(3).trim(), lines: [] }
    } else {
      current?.lines.push(line)
    }
  }
  if (current) sections.push({ heading: current.heading, body: current.lines.join('\n') })
  return sections
}

/** Split markdown into H3 sections. */
function splitH3Sections(md: string): Array<{ heading: string; body: string }> {
  const lines = md.split('\n')
  const sections: Array<{ heading: string; body: string }> = []
  let current: { heading: string; lines: string[] } | null = null

  for (const line of lines) {
    if (line.startsWith('### ')) {
      if (current) sections.push({ heading: current.heading, body: current.lines.join('\n') })
      current = { heading: line.slice(4).trim(), lines: [] }
    } else {
      current?.lines.push(line)
    }
  }
  if (current) sections.push({ heading: current.heading, body: current.lines.join('\n') })
  return sections
}

/** Extract subtitle from `> subtitle: ...` blockquote. */
function extractSubtitle(body: string): string {
  const match = body.match(/^>\s*subtitle:\s*(.+)$/m)
  return match ? match[1].trim() : ''
}

/** Parse bullet items of the form `- **Title** — Text` into directive objects. */
function parseDirectives(body: string): { title: string; text: string }[] {
  const directives: { title: string; text: string }[] = []
  const lines = body.split('\n')
  for (const line of lines) {
    const match = line.match(/^\d+\.\s+\*\*(.+?)\*\*\s+—\s+(.+)$/)
    if (match) {
      directives.push({ title: match[1].trim(), text: match[2].trim() })
    }
  }
  return directives
}

/**
 * Parse hints from bullet items:
 * `- **Tool** | Description | `command``
 * `- **Tool** | Description` (no command)
 */
function parseHints(body: string): PlaybookPhaseHint[] {
  const hints: PlaybookPhaseHint[] = []
  const lines = body.split('\n')
  for (const line of lines) {
    const trimmed = line.replace(/^-\s+/, '').trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const parts = trimmed.split('|').map((p) => p.trim())
    if (parts.length < 2) continue
    const tool = parts[0].replace(/\*\*/g, '').trim()
    const description = parts[1].trim()
    const rawCmd = parts.length > 2 ? parts.slice(2).join(' | ') : undefined
    let command: string | undefined
    if (rawCmd) {
      const cmdMatch = rawCmd.match(/`([^`]+)`/)
      command = cmdMatch ? cmdMatch[1] : rawCmd.trim()
    }
    if (tool) hints.push({ tool, description, command })
  }
  return hints
}

/** Parse H4 sections within the pedagogical guide body. */
function parsePedagogicalGuide(body: string): PlaybookPhaseGuide[] {
  const guides: PlaybookPhaseGuide[] = []
  const lines = body.split('\n')
  let current: { title: string; rationale: string; lines: string[] } | null = null

  for (const line of lines) {
    if (line.startsWith('#### ')) {
      if (current) {
        guides.push(buildGuide(current.title, current.rationale, current.lines))
      }
      current = { title: line.slice(5).trim(), rationale: '', lines: [] }
    } else if (current) {
      // First blockquote line without a label is the rationale
      if (line.startsWith('> ') && !current.rationale) {
        current.rationale = line.slice(2).trim()
      } else {
        current.lines.push(line)
      }
    }
  }
  if (current) guides.push(buildGuide(current.title, current.rationale, current.lines))
  return guides
}

function buildGuide(
  sectionTitle: string,
  rationale: string,
  lines: string[]
): PlaybookPhaseGuide {
  const steps: PlaybookPhaseStep[] = []
  let pendingStep: PlaybookPhaseStep | null = null

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    // Detail lines: indented bullets with italic text or direct italic lines
    if (/^-\s+_/.test(trimmed) || /^_/.test(trimmed)) {
      if (pendingStep) {
        pendingStep.detail = trimmed
          .replace(/^-\s+_?/, '')
          .replace(/^_/, '')
          .replace(/_$/, '')
          .trim()
      }
    } else if (/^-\s+/.test(trimmed)) {
      if (pendingStep) steps.push(pendingStep)
      const content = trimmed.replace(/^-\s+/, '')
      const cmdMatch = content.match(/`([^`]+)`/)
      const actionText = content.replace(/`[^`]+`/, '').trim()

      pendingStep = {
        action: actionText,
        command: cmdMatch ? cmdMatch[1] : undefined,
      }
    }
  }
  if (pendingStep) steps.push(pendingStep)

  return { sectionTitle, rationale, steps: steps.filter((s) => s.action) }
}

/** Parse verification checkpoints: `- id | Label` */
function parseVerifications(body: string): PlaybookPhaseVerification[] {
  const verifications: PlaybookPhaseVerification[] = []
  const lines = body.split('\n')
  for (const line of lines) {
    const trimmed = line.replace(/^-\s+/, '').trim()
    const parts = trimmed.split('|')
    if (parts.length >= 2) {
      verifications.push({ id: parts[0].trim(), label: parts[1].trim() })
    }
  }
  return verifications
}

// ---------------------------------------------------------------------------
// Prelude & Metadata parser
// ---------------------------------------------------------------------------

function parsePlaybookPrelude(playbookContent: string) {
  let frontmatter: Record<string, string> = {}
  let body = playbookContent

  const fmMatch = playbookContent.match(/^---\r?\n([\s\S]+?)\r?\n---\r?\n([\s\S]*)$/)
  if (fmMatch) {
    const yaml = fmMatch[1]
    body = fmMatch[2]
    for (const line of yaml.split('\n')) {
      const idx = line.indexOf(':')
      if (idx !== -1) {
        const k = line.slice(0, idx).trim()
        const v = line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '')
        frontmatter[k] = v
      }
    }
  }

  // Everything before the first "## FASE" is the prelude
  const phaseSplit = body.split(/\n## FASE\s/i)
  const preludeText = phaseSplit[0]

  // Extract H1 title: e.g. # La estación olvidada: Primer contacto con la ciberseguridad
  const h1Match = preludeText.match(/^#\s+(.+)$/m)
  const title = frontmatter.titulo || (h1Match ? h1Match[1].trim() : '')

  const h3Sections = splitH3Sections(preludeText)

  const missionSection = h3Sections.find((s) => /misi[oó]n/i.test(s.heading))
  const mission = missionSection ? missionSection.body.trim() : undefined

  const rulesSection = h3Sections.find((s) => /reglas/i.test(s.heading))
  let rules: string[] | undefined = undefined
  if (rulesSection) {
    rules = rulesSection.body
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => /^[•\-*]/.test(l))
      .map((l) => l.replace(/^[•\-*]\s*/, '').trim())
      .filter(Boolean)
  }

  const helpSection = h3Sections.find((s) => /ayudas/i.test(s.heading))
  const helpGuide = helpSection ? helpSection.body.trim() : undefined

  return {
    title,
    metadata: frontmatter,
    mission,
    rules,
    helpGuide,
    strippedPlaybook: body,
  }
}

// ---------------------------------------------------------------------------
// Phase parser
// ---------------------------------------------------------------------------

function parsePhase(heading: string, body: string, index: number): PlaybookPhase {
  const subtitle = extractSubtitle(body)
  const h3Sections = splitH3Sections(body)

  const directivesSection = h3Sections.find((s) => s.heading === 'Directivas')
  const hintsSection = h3Sections.find((s) => s.heading === 'Pistas')
  const guideSection = h3Sections.find((s) => s.heading === 'Guía Pedagógica')
  const verifSection = h3Sections.find((s) => s.heading === 'Verificaciones')

  const phaseNum = String(index + 1).padStart(2, '0')
  const phaseId = `fase-${index + 1}`

  return {
    id: phaseId,
    number: phaseNum,
    title: heading,
    subtitle,
    directives: directivesSection ? parseDirectives(directivesSection.body) : [],
    hints: hintsSection ? parseHints(hintsSection.body) : [],
    pedagogicalGuide: guideSection ? parsePedagogicalGuide(guideSection.body) : [],
    verification: verifSection ? parseVerifications(verifSection.body) : [],
  }
}

// ---------------------------------------------------------------------------
// Notes parser
// ---------------------------------------------------------------------------

function parseNotes(md: string, labId: string): LabNote[] {
  const notes: LabNote[] = []
  const noteBlocks = md.split(/^## NOTE:/m).slice(1)
  const now = Date.now()

  noteBlocks.forEach((block, idx) => {
    const lines = block.split('\n')
    const titleLine = lines[0].trim()
    const rawBody = lines.slice(1).join('\n').trim()
    const codeMatch = rawBody.match(/^```[\s\S]+?```/m)
    const noteBody = codeMatch
      ? codeMatch[0].replace(/^```[^\n]*\n/, '').replace(/```$/, '').trim()
      : rawBody

    const finalBody = noteBody.trim() ? noteBody.trim() : titleLine

    notes.push({
      id: `${labId}-note-${idx}`,
      body: finalBody,
      createdAt: now - (noteBlocks.length - idx) * 3_600_000,
      updatedAt: now - (noteBlocks.length - idx) * 3_600_000,
    })
  })
  return notes
}

// ---------------------------------------------------------------------------
// Main compilation
// ---------------------------------------------------------------------------

const DOCS_LABS_DIR = path.resolve(process.cwd(), 'docs/labs')
const OUTPUT_FILE = path.resolve(process.cwd(), 'src/data/compiledLabs.ts')

function compileLabs(): CompiledLab[] {
  if (!fs.existsSync(DOCS_LABS_DIR)) {
    console.warn(`[compile-labs] docs/labs/ not found, skipping compilation.`)
    return []
  }

  const labDirs = fs
    .readdirSync(DOCS_LABS_DIR)
    .filter((d) => /^lab-\d+$/.test(d))
    .sort()

  const compiled: CompiledLab[] = []

  for (const labDir of labDirs) {
    const labPath = path.join(DOCS_LABS_DIR, labDir)
    const labId = labDir // e.g. "lab-01"

    const playbookFile = path.join(labPath, 'playbook.md')
    const ssotFile = path.join(labPath, 'ssot-commands.md')
    const notesFile = path.join(labPath, 'notes.md')

    const playbookContent = fs.existsSync(playbookFile)
      ? fs.readFileSync(playbookFile, 'utf-8')
      : ''

    // SSoT commands (raw markdown string)
    const ssotCommands = fs.existsSync(ssotFile)
      ? fs.readFileSync(ssotFile, 'utf-8').replace(/^---[\s\S]+?---\n/, '').trim()
      : ''

    // Notes
    const notesMd = fs.existsSync(notesFile) ? fs.readFileSync(notesFile, 'utf-8') : ''
    const notes = notesMd ? parseNotes(notesMd, labId) : []

    // If stub or empty playbook, emit empty phases but preserve notes and ssotCommands if present
    if (playbookContent.includes('status: "stub"') || !playbookContent) {
      console.log(`[compile-labs] ${labId}: stub detected (${notes.length} notes, ssot ${ssotCommands.length} chars).`)
      compiled.push({ id: labId, title: labId, phases: [], ssotCommands, notes })
      continue
    }

    const { title, metadata, mission, rules, helpGuide, strippedPlaybook } =
      parsePlaybookPrelude(playbookContent)

    // Parse H2 sections = phases
    const h2Sections = splitH2Sections(strippedPlaybook).filter((s) =>
      s.heading.startsWith('FASE ')
    )
    const phases = h2Sections.map((s, i) => parsePhase(s.heading, s.body, i))

    compiled.push({
      id: labId,
      title: title || metadata?.titulo || labId,
      metadata,
      mission,
      rules,
      helpGuide,
      phases,
      ssotCommands,
      notes,
    })
    console.log(
      `[compile-labs] ${labId}: ${phases.length} phases, ${notes.length} notes compiled.`
    )
  }

  return compiled
}

function emitTypeScript(labs: CompiledLab[]): string {
  const header = `/**
 * AUTO-GENERATED — DO NOT EDIT MANUALLY
 * Source: docs/labs/lab-XX/{playbook,ssot-commands,notes}.md
 * Generated by: scripts/compile-labs.ts
 *
 * Re-generate with:  node scripts/compile-labs.ts
 */

import type { PlaybookPhase } from '@/components/apps/LiliumPlaybookApp'

export interface CompiledLabNote {
  id: string
  body: string
  createdAt: number
  updatedAt: number
}

export interface CompiledLab {
  /** Lab identifier matching LabItem.id, e.g. "lab-01" */
  id: string
  /** Title from frontmatter or H1, e.g. "La estación olvidada: Primer contacto con la ciberseguridad" */
  title: string
  /** Frontmatter attributes from playbook.md */
  metadata?: {
    titulo?: string
    laboratorio?: string
    idioma?: string
    referencia?: string
    formato?: string
    [key: string]: string | undefined
  }
  /** Mission text from ### Tu misión */
  mission?: string
  /** Rules of work from ### Reglas de trabajo */
  rules?: string[]
  /** Help usage guide from ### Cómo usar las ayudas */
  helpGuide?: string
  /** Parsed Playbook phases — drives LiliumPlaybookApp */
  phases: PlaybookPhase[]
  /** Raw SSoT commands markdown — seeded as a Notes app note */
  ssotCommands: string
  /** Pre-seeded notes for the Notes app on lab entry */
  notes: CompiledLabNote[]
}

`

  const body =
    `export const COMPILED_LABS: CompiledLab[] = ` +
    JSON.stringify(labs, null, 2) +
    ';\n\n' +
    [
      '/**',
      ' * Quick lookup by lab id',
      ' */',
      'export function getCompiledLab(labId: string): CompiledLab | undefined {',
      '  return COMPILED_LABS.find((l) => l.id === labId)',
      '}',
      '',
      '/**',
      ' * Extracts executable Linux terminal setup script lines from a lab ssotCommands.',
      ' * Strips markdown code blocks and returns an array of shell command lines',
      ' * ready to be streamed to the v86 Linux VM via serial interface.',
      ' */',
      'export function getLabSetupScript(labId: string): string[] {',
      '  const lab = getCompiledLab(labId)',
      '  if (!lab || !lab.ssotCommands) return []',
      '  const pattern = /(?:`{3,4})(?:bash|sh)?\\r?\\n([\\s\\S]*?)(?:`{3,4})/',
      '  const codeBlockMatch = lab.ssotCommands.match(pattern)',
      '  const scriptText = codeBlockMatch ? codeBlockMatch[1] : lab.ssotCommands',
      '  return scriptText',
      '    .split(/\\r?\\n/)',
      '    .map((line) => line.trimEnd())',
      '    .filter((line) => line.length > 0)',
      '}',
      '',
    ].join('\n')

  return header + body
}

// Run
const labs = compileLabs()
const tsOutput = emitTypeScript(labs)
fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true })
fs.writeFileSync(OUTPUT_FILE, tsOutput, 'utf-8')
console.log(`[compile-labs] Written → ${OUTPUT_FILE}`)
