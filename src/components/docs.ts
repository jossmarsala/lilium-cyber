/**
 * Documentation component library — barrel export.
 *
 * Import from this file to get all docs-specific primitives:
 *
 *   import {
 *     DocsCallout,
 *     DocsSteps, DocsStep,
 *     DocsList, DocsListItem,
 *     DocsGroup, DocsGroupRow,
 *     DocsTable,
 *   } from '@/components/docs'
 */

export { default as DocsCallout } from './DocsCallout'
export type { CalloutVariant } from './DocsCallout'

export { DocsSteps, DocsStep } from './DocsSteps'
export type { StepCode } from './DocsSteps'

export { DocsList, DocsListItem, DocsGroup, DocsGroupRow } from './DocsList'

export { default as DocsTable } from './DocsTable'
export { default as CodeBlock } from './CodeBlock'
