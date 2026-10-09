/**
 * DocsSteps — numbered implementation step list.
 *
 * Usage:
 *   <DocsSteps>
 *     <DocsStep title="Install dependencies">
 *       Run the installer from the project root.
 *     </DocsStep>
 *
 *     <DocsStep
 *       title="Start dev server"
 *       code={{ lang: 'bash', content: 'npm run dev' }}
 *       outcome="App available at http://localhost:5173"
 *       completed
 *     />
 *   </DocsSteps>
 */
import type { ReactNode } from 'react'
import CodeBlock from './CodeBlock'
import styles from './DocsSteps.module.css'

/* ── Individual step data ── */
export interface StepCode {
  /** Language label shown in the code block header */
  lang?: string
  content: string
}

interface StepProps {
  title: string
  /** Optional prose description (supports inline `code` via children) */
  children?: ReactNode
  /** Optional embedded code block */
  code?: StepCode
  /** Short expected-outcome string shown as a green pill */
  outcome?: string
  /** Renders the number bubble as filled/checked */
  completed?: boolean
}

/* ── Wrapper ── */
interface StepsProps {
  children: ReactNode
}

/** Container — wraps ordered steps */
export function DocsSteps({ children }: StepsProps) {
  return <ol className={styles.steps}>{children}</ol>
}

/** Individual step */
export function DocsStep({
  title,
  children,
  code,
  outcome,
  completed = false,
}: StepProps) {
  return (
    <li className={`${styles.step}${completed ? ` ${styles.completed}` : ''}`}>
      {/* Counter bubble */}
      <span className={styles.number} aria-hidden="true">
        {completed ? (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="2 6 5 9 10 3" />
          </svg>
        ) : null}
      </span>

      {/* Step body */}
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>

        {children && (
          <p className={styles.description}>{children}</p>
        )}

        {code && (
          <CodeBlock
            code={code.content}
            lang={code.lang ?? 'shell'}
            className={styles.stepCodeBlock}
          />
        )}

        {outcome && (
          <div className={styles.outcome}>
            <svg
              className={styles.outcomeIcon}
              width="11"
              height="11"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="2 6 5 9 10 3" />
            </svg>
            {outcome}
          </div>
        )}
      </div>
    </li>
  )
}
