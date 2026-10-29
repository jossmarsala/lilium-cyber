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
 *     DocsNextButton,
 *     DocsPagination,
 *     DocsSubindexCard,
 *   } from '@/components/docs'
 */

export { default as DocsCallout } from './DocsCallout'
export type { CalloutVariant } from './DocsCallout'

export { DocsSteps, DocsStep } from './DocsSteps'
export type { StepCode } from './DocsSteps'

export { DocsList, DocsListItem, DocsGroup, DocsGroupRow } from './DocsList'

export { default as DocsTable } from './DocsTable'
export { default as CodeBlock } from './CodeBlock'

export { default as DocsNextButton } from './DocsNextButton'
export { default as NextSubindexButton } from './DocsNextButton'
export type { DocsNextButtonProps, DocsButtonVariant, DocsButtonDirection } from './DocsNextButton'

export { default as DocsPagination } from './DocsPagination'
export type { DocsPaginationProps } from './DocsPagination'

export { default as DocsSubindexCard } from './DocsSubindexCard'
export type { DocsSubindexCardProps } from './DocsSubindexCard'

export { default as Diagrama, DiagramaZone, DiagramaConnector, DiagramaNode } from './Diagrama'
export type {
  DiagramaProps,
  DiagramaZoneProps,
  DiagramaConnectorProps,
  DiagramaNodeProps,
  DiagramaGridType,
} from './Diagrama'
