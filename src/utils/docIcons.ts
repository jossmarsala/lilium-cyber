import type { IconSvgElement } from '@hugeicons/react'
import {
  Book01Icon,
  Book02Icon,
  Bookmark01Icon,
  InformationCircleIcon,
  HelpCircleIcon,
  Shield01Icon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  LockKeyIcon,
  EyeIcon,
  Target01Icon,
  Key01Icon,
  AlertDiamondIcon,
  Alert01Icon,
  Bug01Icon,
  ComputerIcon,
  ServerIcon,
  NetworkIcon,
  CpuIcon,
  Globe02Icon,
  ToolsIcon,
  Wrench01Icon,
  CommandLineIcon,
  TerminalIcon,
  CodeIcon,
  DocumentCodeIcon,
  Layers01Icon,
  PaintBoardIcon,
  Database01Icon,
  Folder01Icon,
  File01Icon,
  Rocket01Icon,
  Download04Icon,
  Settings02Icon,
  CheckIcon,
  PlayIcon,
  Search01Icon,
  BrainIcon,
} from '@hugeicons/core-free-icons'

/**
 * Registry of available documentation icons.
 * Can be referenced directly by name (e.g. "Shield01Icon" or "Shield01") in docs.json.
 */
export const DOC_ICONS: Record<string, IconSvgElement> = {
  // Books & Documentation
  Book01Icon,
  Book02Icon,
  Bookmark01Icon,
  InformationCircleIcon,
  HelpCircleIcon,

  // Security & Trust
  Shield01Icon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  LockKeyIcon,
  EyeIcon,
  Target01Icon,
  Key01Icon,
  BrainIcon,

  // Alerts & Threats
  AlertDiamondIcon,
  Alert01Icon,
  Bug01Icon,

  // Systems, Infrastructure & Networks
  ComputerIcon,
  ServerIcon,
  NetworkIcon,
  CpuIcon,
  Globe02Icon,

  // Tools & Terminal
  ToolsIcon,
  Wrench01Icon,
  CommandLineIcon,
  TerminalIcon,
  CodeIcon,
  DocumentCodeIcon,

  // Structure & Data
  Layers01Icon,
  PaintBoardIcon,
  Database01Icon,
  Folder01Icon,
  File01Icon,

  // Actions & Navigation
  Rocket01Icon,
  Download04Icon,
  Settings02Icon,
  CheckIcon,
  PlayIcon,
  Search01Icon,
}

/**
 * Friendly aliases mapping intuitive keywords or IDs to specific icons.
 */
const ICON_ALIASES: Record<string, IconSvgElement> = {
  // Introduction / Fundamentals
  intro: Book02Icon,
  introduction: Book02Icon,
  fundamentals: Book02Icon,
  fundamentos: Book02Icon,
  book: Book01Icon,

  // Threats / Vulnerabilities
  threat: AlertDiamondIcon,
  threats: AlertDiamondIcon,
  amenazas: AlertDiamondIcon,
  danger: AlertDiamondIcon,
  alert: Alert01Icon,
  bug: Bug01Icon,
  vulnerability: Bug01Icon,

  // Frameworks & References
  framework: Bookmark01Icon,
  frameworks: Bookmark01Icon,
  reference: Bookmark01Icon,
  references: Bookmark01Icon,
  referencias: Bookmark01Icon,

  // Toolkit / Tools
  toolkit: ToolsIcon,
  tool: ToolsIcon,
  tools: ToolsIcon,
  herramientas: ToolsIcon,
  wrench: Wrench01Icon,

  // Networks & Systems
  network: NetworkIcon,
  networks: NetworkIcon,
  redes: NetworkIcon,
  os: ServerIcon,
  system: ServerIcon,
  systems: ServerIcon,
  sistema: ServerIcon,
  server: ServerIcon,
  computer: ComputerIcon,
  cpu: CpuIcon,

  // Security & Mindset
  security: Shield01Icon,
  seguridad: Shield01Icon,
  shield: Shield01Icon,
  mentality: BrainIcon,
  mindset: BrainIcon,
  mentalidad: BrainIcon,
  brain: BrainIcon,
  lock: LockKeyIcon,
  target: Target01Icon,
  key: Key01Icon,
  eye: EyeIcon,

  // Getting started / Developer workflows
  prerequisites: Download04Icon,
  download: Download04Icon,
  install: Download04Icon,
  rocket: Rocket01Icon,
  'running-locally': Rocket01Icon,
  start: Rocket01Icon,
  launch: Rocket01Icon,

  // Architecture & Structure
  structure: Layers01Icon,
  layers: Layers01Icon,
  'project-structure': Layers01Icon,
  routing: Settings02Icon,
  settings: Settings02Icon,
  config: Settings02Icon,
  'feature-modules': PaintBoardIcon,
  features: PaintBoardIcon,
  modules: PaintBoardIcon,
  'data-layer': Database01Icon,
  data: Database01Icon,
  database: Database01Icon,

  // Labs & Scenarios
  lab: Folder01Icon,
  labs: Folder01Icon,
  'lab-structure': Folder01Icon,
  folder: Folder01Icon,
  file: File01Icon,
  'creating-a-lab': File01Icon,
  'simulation-model': CpuIcon,
  simulation: CpuIcon,
  simulations: CpuIcon,
  'scenario-schema': CheckIcon,
  scenario: CheckIcon,
  scenarios: CheckIcon,
  check: CheckIcon,

  // Code & CLI
  code: CodeIcon,
  terminal: TerminalIcon,
  cli: CommandLineIcon,
  search: Search01Icon,
}

/**
 * Normalizes a string key: lowercased, stripped of hyphens, underscores, and trailing "icon".
 */
function normalizeKey(str: string): string {
  return str.toLowerCase().replace(/[-_\s]/g, '')
}

// Pre-index normalized names of DOC_ICONS for fast lookup (e.g. "shield01" -> Shield01Icon)
const NORMALIZED_DOC_ICONS = new Map<string, IconSvgElement>()
for (const [name, icon] of Object.entries(DOC_ICONS)) {
  NORMALIZED_DOC_ICONS.set(normalizeKey(name), icon)
  if (name.endsWith('Icon')) {
    NORMALIZED_DOC_ICONS.set(normalizeKey(name.slice(0, -4)), icon)
  }
}

/**
 * Resolves an icon dynamically from an explicit icon name, ID, or fallback.
 *
 * Lookup order:
 * 1. Exact match in DOC_ICONS (e.g. "Book02Icon")
 * 2. Case-insensitive/normalized match in DOC_ICONS (e.g. "book02", "shield01icon")
 * 3. Keyword / alias match (e.g. "threats" -> AlertDiamondIcon, "network" -> NetworkIcon)
 * 4. Subsection ID alias match if subId is provided
 * 5. Default fallback icon (File01Icon)
 */
export function resolveDocIcon(iconName?: string, subId?: string): IconSvgElement {
  // 1. Direct name lookup
  if (iconName) {
    if (DOC_ICONS[iconName]) {
      return DOC_ICONS[iconName]
    }

    const norm = normalizeKey(iconName)
    if (NORMALIZED_DOC_ICONS.has(norm)) {
      return NORMALIZED_DOC_ICONS.get(norm)!
    }

    if (ICON_ALIASES[norm]) {
      return ICON_ALIASES[norm]
    }
  }

  // 2. Fallback to subId keyword/alias
  if (subId) {
    const normId = normalizeKey(subId)
    if (ICON_ALIASES[normId]) {
      return ICON_ALIASES[normId]
    }

    // Partial keyword detection in subId (e.g., "networks-operating-systems" -> network)
    for (const [alias, icon] of Object.entries(ICON_ALIASES)) {
      if (normId.includes(alias) || alias.includes(normId)) {
        return icon
      }
    }
  }

  // 3. Fallback default
  return File01Icon
}
