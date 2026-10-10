/**
 * DocsContent — renders the active section overview or subsection content.
 *
 * All content structures are dynamically driven by `src/data/docs.json`:
 *  - Tables (DocsTable)
 *  - Numbered Steps (DocsSteps, DocsStep) with CodeBlocks
 *  - Fenced & standalone Code Blocks with light theme + keyword color accents
 *  - Grouped key-value containers (DocsGroup, DocsGroupRow)
 *  - Unordered lists (DocsList, DocsListItem)
 *  - Contextual callouts (DocsCallout)
 *  - File trees & prose
 */
import type { ReactNode } from 'react'
import type { DocSection, DocSubSection, DocBlock } from '@/data/docs'
import styles from './DocsContent.module.css'
import DocsCallout from './DocsCallout'
import { DocsSteps, DocsStep } from './DocsSteps'
import { DocsList, DocsListItem, DocsGroup, DocsGroupRow } from './DocsList'
import DocsTable from './DocsTable'
import CodeBlock from './CodeBlock'
import DocsUIPreview from './DocsUIPreview'
import DocsNextButton from './DocsNextButton'
import DocsPagination from './DocsPagination'
import DocsSubindexCard from './DocsSubindexCard'
import { renderInline } from '@/utils/renderInline'

interface Props {
  section?: DocSection
  subSection?: DocSubSection
}

/* ── Body parser for plain-text / Markdown fallback ── */
function renderBody(text: string) {
  if (!text.trim()) return null

  const lines = text.split('\n')
  const nodes: ReactNode[] = []
  let i = 0

  // Detect file-tree block: starts with "src/" and contains indented paths
  const isFileTree =
    lines.some((l) => l.trim().startsWith('src/')) &&
    lines.some((l) => l.startsWith(' ') || l.startsWith('\t'))

  if (isFileTree) {
    const treeStart = lines.findIndex((l) => l.trim().startsWith('src/'))
    const prose = lines.slice(0, treeStart).join('\n').trim()
    const tree = lines.slice(treeStart).join('\n')

    return (
      <>
        {prose && <p className={styles.pre}>{renderInline(prose, 'prose')}</p>}
        <div className={styles.fileTree}>
          <div className={styles.fileTreeHeader}>Project Structure</div>
          <pre className={styles.fileTreeBody}>{tree}</pre>
        </div>
      </>
    )
  }

  while (i < lines.length) {
    const line = lines[i]

    // Fenced code block -> uses light CodeBlock with keyword accents
    if (line.trim().startsWith('```')) {
      const lang = line.trim().slice(3).trim() || 'shell'
      const blockLines: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        blockLines.push(lines[i])
        i++
      }
      nodes.push(<CodeBlock key={i} lang={lang} code={blockLines.join('\n')} />)
      i++
      continue
    }

    if (!line.trim()) {
      i++
      continue
    }

    const paraLines: string[] = []
    while (i < lines.length && lines[i].trim() && !lines[i].trim().startsWith('```')) {
      paraLines.push(lines[i])
      i++
    }

    nodes.push(
      <p className={styles.paragraph} key={i}>
        {renderInline(paraLines.join(' '), 'p')}
      </p>
    )
  }

  return <>{nodes}</>
}

/* ── Dynamic Block Renderer ── */
function renderBlock(block: DocBlock, index: number): ReactNode {
  switch (block.type) {
    case 'paragraph':
      return (
        <p className={styles.paragraph} key={index}>
          {renderInline(block.text, index)}
        </p>
      )

    case 'heading':
      if (block.level === 1) {
        return (
          <h2 className={styles.heading1} key={index}>
            {renderInline(block.text, index)}
          </h2>
        )
      }
      if (block.level === 3) {
        return (
          <h3 className={styles.heading3} key={index}>
            {renderInline(block.text, index)}
          </h3>
        )
      }
      if (block.level === 4) {
        return (
          <h4 className={styles.heading4} key={index}>
            {renderInline(block.text, index)}
          </h4>
        )
      }
      return (
        <h2 className={styles.heading2} key={index}>
          {renderInline(block.text, index)}
        </h2>
      )

    case 'callout':
      return (
        <DocsCallout key={index} variant={block.variant ?? 'note'} label={block.label}>
          {renderInline(block.text, index)}
        </DocsCallout>
      )

    case 'code':
      return (
        <CodeBlock
          key={index}
          lang={block.lang ?? 'shell'}
          filename={block.filename}
          code={block.content}
        />
      )

    case 'steps':
      return (
        <DocsSteps key={index}>
          {block.items.map((step, sIdx) => (
            <DocsStep
              key={sIdx}
              title={step.title}
              code={step.code}
              outcome={step.outcome}
              completed={step.completed}
            >
              {step.description ? renderInline(step.description, sIdx) : null}
            </DocsStep>
          ))}
        </DocsSteps>
      )

    case 'table':
      return (
        <DocsTable key={index} columns={block.columns} rows={block.rows} caption={block.caption} />
      )

    case 'list':
      return (
        <DocsList key={index} ordered={block.ordered} start={block.start}>
          {block.items.map((item, lIdx) => (
            <DocsListItem
              key={lIdx}
              index={block.ordered ? (block.start ?? 1) + lIdx : undefined}
              ordered={block.ordered}
            >
              {renderInline(item, lIdx)}
            </DocsListItem>
          ))}
        </DocsList>
      )

    case 'group':
      return (
        <DocsGroup key={index} title={block.title} description={block.description}>
          {block.rows.map((row, rIdx) => (
            <DocsGroupRow key={rIdx} keyLabel={row.keyLabel} badge={row.badge}>
              {renderInline(row.text, rIdx)}
            </DocsGroupRow>
          ))}
        </DocsGroup>
      )

    case 'fileTree':
      return (
        <div className={styles.fileTree} key={index}>
          <div className={styles.fileTreeHeader}>{block.title ?? 'Project Structure'}</div>
          <pre className={styles.fileTreeBody}>{block.content}</pre>
        </div>
      )

    case 'componentPreview':
      return <DocsUIPreview key={index} component={block.component} />

    case 'nextButton':
      return (
        <DocsNextButton
          key={index}
          to={block.to}
          title={block.title}
          sectionTitle={block.sectionTitle}
          description={block.description}
          variant={block.variant}
        />
      )

    default:
      return null
  }
}

export default function DocsContent({ section, subSection }: Props) {
  if (!section) {
    return (
      <div className={styles.content}>
        <div className={styles.inner}>
          <p className={styles.empty}>Select a section from the sidebar.</p>
        </div>
      </div>
    )
  }

  const title = subSection ? subSection.title : section.title
  const target = subSection ?? section

  const hasBlocks = target.blocks && target.blocks.length > 0
  const fallbackText = subSection ? subSection.content : section.overview

  return (
    <article className={styles.content}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <span className={styles.breadcrumb}>{subSection ? section.title : 'Documentation'}</span>
          <h1 className={styles.title}>{title}</h1>
        </header>

        <div className={styles.body}>
          {/* Dynamically render JSON blocks if configured */}
          {hasBlocks ? (
            target.blocks!.map((block, idx) => renderBlock(block, idx))
          ) : fallbackText ? (
            /* Fallback to plain-text / markdown renderer */
            renderBody(fallbackText)
          ) : (
            <p className={styles.empty}>No content yet.</p>
          )}

          {/* Section overview → subsection quick-nav cards */}
          {!subSection && section.subsections.length > 0 && (
            <div className={styles.subIndex}>
              <div className={styles.subIndexHeader}>
                <h2 className={styles.subIndexHeading}>En esta sección</h2>
                <span className={styles.subIndexCount}>
                  {section.subsections.length} subíndices
                </span>
              </div>
              <div className={styles.subIndexGrid}>
                {section.subsections.map((sub, idx) => (
                  <DocsSubindexCard
                    key={sub.id}
                    sectionId={section.id}
                    subSection={sub}
                    index={idx + 1}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Bottom navigation buttons to go into the next / previous subindex */}
          <DocsPagination sectionId={section.id} subSectionId={subSection?.id} />
        </div>
      </div>
    </article>
  )
}
