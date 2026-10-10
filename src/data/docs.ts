/**
 * Documentation content tree — typed interface & dynamic JSON loader.
 *
 * Content and rich structures (tables, lists, code, steps, groups, callouts)
 * are configured directly in `src/data/docs.json`.
 *
 * The `id` field drives URL routing: /docs/:sectionId and /docs/:sectionId/:subSectionId
 */
import docsJson from './docs.json'

export type CalloutVariant = 'note' | 'tip' | 'warning' | 'critical'
export type BadgeKind = 'required' | 'optional' | 'default'

export interface StepItem {
  title: string
  description?: string
  code?: {
    lang?: string
    content: string
  }
  outcome?: string
  completed?: boolean
}

export interface GroupRowItem {
  keyLabel: string
  badge?: BadgeKind
  text: string
}

export type DocBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; level?: number; text: string }
  | { type: 'callout'; variant?: CalloutVariant; label?: string; text: string }
  | { type: 'code'; lang?: string; filename?: string; content: string }
  | { type: 'steps'; items: StepItem[] }
  | { type: 'table'; columns: string[]; rows: (string | number)[][]; caption?: string }
  | { type: 'list'; items: string[]; ordered?: boolean; start?: number }
  | { type: 'group'; title: string; description?: string; rows: GroupRowItem[] }
  | { type: 'fileTree'; title?: string; content: string }
  | { type: 'componentPreview'; component?: 'specularButton' | 'pills' | 'rubberSegment' | 'all' }
  | {
      type: 'nextButton'
      to?: string
      title?: string
      sectionTitle?: string
      description?: string
      variant?: 'card' | 'banner' | 'pill' | 'compact'
    }

export interface DocSubSection {
  id: string
  title: string
  icon?: string
  content?: string
  blocks?: DocBlock[]
  hidden?: boolean
}

export interface DocSection {
  id: string
  title: string
  icon?: string
  /** Optional overview shown when the section itself (not a subsection) is active */
  overview?: string
  blocks?: DocBlock[]
  subsections: DocSubSection[]
  hidden?: boolean
}

export const docs: DocSection[] = docsJson as DocSection[]

export default docs
