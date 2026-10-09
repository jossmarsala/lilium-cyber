/**
 * CodeBlock — Light theme code block with syntax color accents for keywords.
 *
 * Features:
 *  - Clean light background with subtle Mac window control dots
 *  - Keyword color accents matching the system's active accent color
 *  - Syntax tokens for commands, strings, flags, comments, types, and numbers
 *  - One-click copy with visual feedback
 */
import { useState, type ReactNode } from 'react'
import styles from './CodeBlock.module.css'

interface CodeBlockProps {
  code: string
  lang?: string
  filename?: string
  className?: string
}

const JS_KEYWORDS = new Set([
  'import',
  'export',
  'from',
  'const',
  'let',
  'var',
  'function',
  'return',
  'default',
  'class',
  'interface',
  'type',
  'extends',
  'implements',
  'as',
  'new',
  'if',
  'else',
  'while',
  'for',
  'in',
  'of',
  'await',
  'async',
  'try',
  'catch',
  'throw',
  'finally',
  'typeof',
  'instanceof',
  'switch',
  'case',
  'break',
  'continue',
])

const SHELL_KEYWORDS = new Set([
  'git',
  'clone',
  'npm',
  'npx',
  'pnpm',
  'yarn',
  'node',
  'run',
  'dev',
  'build',
  'test',
  'start',
  'install',
  'i',
  'add',
  'cd',
  'cp',
  'mv',
  'rm',
  'mkdir',
  'echo',
  'cat',
  'curl',
  'export',
  'sudo',
  'preview',
  'init',
  'push',
  'pull',
  'checkout',
  'commit',
  'status',
])

const TYPES = new Set([
  'string',
  'number',
  'boolean',
  'void',
  'any',
  'never',
  'unknown',
  'Promise',
  'Record',
  'Array',
  'ReactNode',
  'DocSection',
  'DocSubSection',
  'Objective',
  'LabManifest',
])

const LITERALS = new Set(['true', 'false', 'null', 'undefined'])

function highlightLine(line: string, lang = 'shell'): ReactNode[] {
  const trimmed = line.trim()
  const isShell = /^(bash|shell|sh|zsh)$/i.test(lang)

  // Full-line comments
  if (trimmed.startsWith('//') || (isShell && trimmed.startsWith('#'))) {
    return [<span key="full-comment" className={styles.tokenComment}>{line}</span>]
  }

  // Token regex matching strings, comments, flags, numbers, words, paths
  const tokenRegex =
    /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\/\/.*|#.*|--[a-zA-Z0-9_-]+|-[a-zA-Z0-9]+|\b\d+(?:\.\d+)?\b|[a-zA-Z_$][a-zA-Z0-9_$-]*(?:\/[a-zA-Z0-9_$-]+)*|[^\s\w]+|\s+)/g

  const matches = line.match(tokenRegex) || [line]

  return matches.map((token, i) => {
    // String literals
    if (
      (token.startsWith('"') && token.endsWith('"')) ||
      (token.startsWith("'") && token.endsWith("'")) ||
      (token.startsWith('`') && token.endsWith('`'))
    ) {
      return (
        <span key={i} className={styles.tokenString}>
          {token}
        </span>
      )
    }

    // Trailing comments
    if (token.startsWith('//') || (isShell && token.startsWith('#'))) {
      return (
        <span key={i} className={styles.tokenComment}>
          {token}
        </span>
      )
    }

    // CLI flags like --host, -v, -r
    if (token.startsWith('-') && token.length > 1) {
      return (
        <span key={i} className={styles.tokenFlag}>
          {token}
        </span>
      )
    }

    // Number literals
    if (/^\d+(\.\d+)?$/.test(token)) {
      return (
        <span key={i} className={styles.tokenNumber}>
          {token}
        </span>
      )
    }

    // Keywords (get brand accent color!)
    if (JS_KEYWORDS.has(token) || (isShell && SHELL_KEYWORDS.has(token))) {
      return (
        <span key={i} className={styles.tokenKeyword}>
          {token}
        </span>
      )
    }

    // Types
    if (TYPES.has(token)) {
      return (
        <span key={i} className={styles.tokenType}>
          {token}
        </span>
      )
    }

    // Literals (true, false, null)
    if (LITERALS.has(token)) {
      return (
        <span key={i} className={styles.tokenType}>
          {token}
        </span>
      )
    }

    // Paths like src/features/... or https://...
    if (token.includes('/') && !token.startsWith('//')) {
      return (
        <span key={i} className={styles.tokenPath}>
          {token}
        </span>
      )
    }

    // Default plain text
    return <span key={i}>{token}</span>
  })
}

export default function CodeBlock({
  code,
  lang = 'shell',
  filename,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      setCopied(false)
    }
  }

  const lines = code.split('\n')

  return (
    <div className={`${styles.container} ${className ?? ''}`}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.dots} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className={styles.headerMeta}>
            <span className={styles.label}>{lang}</span>
            {filename && <span className={styles.filename}>{filename}</span>}
          </div>
        </div>

        <button
          type="button"
          className={`${styles.copyButton} ${copied ? styles.copyButtonCopied : ''}`}
          onClick={handleCopy}
          aria-label={copied ? 'Copied to clipboard' : 'Copy code to clipboard'}
          title="Copy code"
        >
          {copied ? (
            <>
              <svg
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
              <span>Copied!</span>
            </>
          ) : (
            <>
              <svg
                width="11"
                height="11"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
                <path d="M10.5 5.5V3.5a1.5 1.5 0 0 0-1.5-1.5H3.5A1.5 1.5 0 0 0 2 3.5v6a1.5 1.5 0 0 0 1.5 1.5h2" />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <pre className={styles.pre}>
        {lines.map((line, idx) => (
          <div key={idx}>{highlightLine(line, lang)}</div>
        ))}
      </pre>
    </div>
  )
}
