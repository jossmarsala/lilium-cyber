import type {
  DocSection,
  DocSubSection,
  DocBlock,
  CalloutVariant,
  BadgeKind,
  StepItem,
  GroupRowItem,
} from '@/data/docs'

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

function extractHeadingMetadata(line: string): {
  cleanTitle: string
  meta: Record<string, string>
} {
  const commentMatch = line.match(/<!--(.*?)-->/)
  const meta: Record<string, string> = {}

  if (commentMatch) {
    const rawMeta = commentMatch[1]
    const pairs = rawMeta.split(',')
    for (const pair of pairs) {
      const [k, v] = pair.split(':').map((s) => s.trim())
      if (k && v) {
        meta[k] = v
      }
    }
  }

  const cleanTitle = line.replace(/<!--.*?-->/, '').trim()
  return { cleanTitle, meta }
}

function parseDirectiveAttrs(str: string): Record<string, string> {
  const attrs: Record<string, string> = {}
  const regex = /(\w+)=(?:"([^"]*)"|'([^']*)'|(\S+))/g
  let match: RegExpExecArray | null
  while ((match = regex.exec(str)) !== null) {
    attrs[match[1]] = match[2] ?? match[3] ?? match[4] ?? ''
  }
  return attrs
}

export function parseMarkdownToBlocks(markdown: string): DocBlock[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  const blocks: DocBlock[] = []
  let i = 0

  while (i < lines.length) {
    const startI = i
    const line = lines[i]
    const trimmed = line.trim()

    if (!trimmed) {
      i++
      continue
    }

    // ── 1. Custom container: :::group ──
    if (trimmed.startsWith(':::group')) {
      const attrs = parseDirectiveAttrs(trimmed)
      i++
      const groupLines: string[] = []
      while (i < lines.length && !lines[i].trim().startsWith(':::')) {
        groupLines.push(lines[i])
        i++
      }
      if (i < lines.length && lines[i].trim().startsWith(':::')) {
        i++
      }

      const rows: GroupRowItem[] = []
      for (const gLine of groupLines) {
        const itemTrimmed = gLine.trim()
        if (!itemTrimmed.startsWith('-') && !itemTrimmed.startsWith('*')) continue
        const content = itemTrimmed.replace(/^[-*]\s*/, '').trim()

        const badgeMatch = content.match(
          /^(?:\*\*(.*?)\*\*|(.*?))(?:\s*\[(required|optional|default)\])?\s*:\s*(.*)$/,
        )
        if (badgeMatch) {
          const keyLabel = (badgeMatch[1] ?? badgeMatch[2] ?? '').trim()
          const badge = badgeMatch[3] as BadgeKind | undefined
          const text = (badgeMatch[4] ?? '').trim()
          rows.push({ keyLabel, badge, text })
        } else {
          rows.push({ keyLabel: content, text: '' })
        }
      }

      blocks.push({
        type: 'group',
        title: attrs.title || 'Properties',
        description: attrs.description,
        rows,
      })
      continue
    }

    // ── 2. Custom container: :::steps ──
    if (trimmed.startsWith(':::steps')) {
      i++
      const stepLines: string[] = []
      while (i < lines.length && !lines[i].trim().startsWith(':::')) {
        stepLines.push(lines[i])
        i++
      }
      if (i < lines.length && lines[i].trim().startsWith(':::')) {
        i++
      }

      const stepItems: StepItem[] = []
      let currentStep: Partial<StepItem> | null = null
      let descLines: string[] = []
      let bulletLines: string[] = []
      let inBullets = false

      const commitCurrentStep = () => {
        if (currentStep && currentStep.title) {
          if (descLines.length > 0) {
            currentStep.description = descLines.join(' ').trim()
          }
          if (bulletLines.length > 0) {
            ;(currentStep as Partial<StepItem> & { bullets?: string[] }).bullets = bulletLines
          }
          stepItems.push(currentStep as StepItem)
        }
        currentStep = null
        descLines = []
        bulletLines = []
        inBullets = false
      }

      let sIdx = 0
      while (sIdx < stepLines.length) {
        const sLine = stepLines[sIdx]
        const sTrim = sLine.trim()

        const stepHeaderMatch = sTrim.match(/^(?:#{1,4}|\d+\.)\s+(.+)$/)
        if (stepHeaderMatch && !sTrim.startsWith('```')) {
          commitCurrentStep()
          let title = stepHeaderMatch[1].trim()
          let completed = false
          if (title.startsWith('[x] ') || title.startsWith('[X] ')) {
            completed = true
            title = title.slice(4).trim()
          }
          currentStep = { title, completed }
          sIdx++
          continue
        }

        if (sTrim.startsWith('```')) {
          const lang = sTrim.slice(3).trim() || 'shell'
          sIdx++
          const codeContent: string[] = []
          while (sIdx < stepLines.length && !stepLines[sIdx].trim().startsWith('```')) {
            codeContent.push(stepLines[sIdx])
            sIdx++
          }
          if (sIdx < stepLines.length && stepLines[sIdx].trim().startsWith('```')) {
            sIdx++
          }
          if (currentStep) {
            currentStep.code = {
              lang,
              content: codeContent.join('\n'),
            }
          }
          inBullets = false
          continue
        }

        const outcomeMatch = sTrim.match(/^(?:>\s*)?(?:outcome|result):\s*(.+)$/i)
        if (outcomeMatch && currentStep) {
          currentStep.outcome = outcomeMatch[1].trim()
          sIdx++
          continue
        }

        // Bullet list item inside a step
        const bulletMatch = sTrim.match(/^[-*]\s+(.+)$/)
        if (bulletMatch && currentStep) {
          inBullets = true
          bulletLines.push(bulletMatch[1].trim())
          sIdx++
          continue
        }

        // Continuation line for a bullet (indented)
        if (inBullets && (sLine.startsWith('  ') || sLine.startsWith('\t')) && sTrim && currentStep) {
          bulletLines[bulletLines.length - 1] += ' ' + sTrim
          sIdx++
          continue
        }

        if (sTrim && currentStep) {
          inBullets = false
          descLines.push(sTrim)
        }
        sIdx++
      }
      commitCurrentStep()

      blocks.push({
        type: 'steps',
        items: stepItems,
      })
      continue
    }

    // ── 3. Custom container: :::filetree ──
    if (trimmed.startsWith(':::filetree')) {
      const attrs = parseDirectiveAttrs(trimmed)
      i++
      const treeLines: string[] = []
      while (i < lines.length && !lines[i].trim().startsWith(':::')) {
        treeLines.push(lines[i])
        i++
      }
      if (i < lines.length && lines[i].trim().startsWith(':::')) {
        i++
      }
      blocks.push({
        type: 'fileTree',
        title: attrs.title || 'Project Structure',
        content: treeLines.join('\n'),
      })
      continue
    }

    // ── 3b. Custom container: :::preview or :::ui-preview ──
    if (trimmed.startsWith(':::preview') || trimmed.startsWith(':::ui-preview')) {
      const attrs = parseDirectiveAttrs(trimmed)
      i++
      while (i < lines.length && !lines[i].trim().startsWith(':::')) {
        i++
      }
      if (i < lines.length && lines[i].trim().startsWith(':::')) {
        i++
      }
      blocks.push({
        type: 'componentPreview',
        component: (attrs.component as 'specularButton' | 'pills' | 'rubberSegment' | 'all') || 'all',
      })
      continue
    }

    // ── 3c. Custom container: :::next, :::next-subindex or :::next-button ──
    if (
      trimmed.startsWith(':::next') ||
      trimmed.startsWith(':::next-subindex') ||
      trimmed.startsWith(':::next-button')
    ) {
      const attrs = parseDirectiveAttrs(trimmed)
      i++
      while (i < lines.length && !lines[i].trim().startsWith(':::')) {
        i++
      }
      if (i < lines.length && lines[i].trim().startsWith(':::')) {
        i++
      }
      blocks.push({
        type: 'nextButton',
        ...(attrs.to ? { to: attrs.to } : {}),
        ...(attrs.title ? { title: attrs.title } : {}),
        ...(attrs.sectionTitle || attrs.section ? { sectionTitle: attrs.sectionTitle || attrs.section } : {}),
        ...(attrs.description ? { description: attrs.description } : {}),
        ...(attrs.variant ? { variant: attrs.variant as 'card' | 'banner' | 'pill' | 'compact' } : {}),
      })
      continue
    }

    // ── 4. Blockquotes & Callouts: > [!NOTE], > **Riesgo**, > Note: ──
    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''))
        i++
      }

      const first = (quoteLines[0] || '').trim()
      let variant: CalloutVariant = 'note'
      let label: string | undefined

      const alertMatch = first.match(/^\[!(NOTE|TIP|WARNING|CRITICAL|IMPORTANT)(?::([^\]]+))?\]\s*(.*)$/i)
      if (alertMatch) {
        const rawKind = alertMatch[1].toUpperCase()
        if (rawKind === 'IMPORTANT') {
          variant = 'warning'
        } else {
          variant = alertMatch[1].toLowerCase() as CalloutVariant
        }
        label = alertMatch[2]?.trim() || (rawKind === 'IMPORTANT' ? 'Importante' : undefined)
        const trailing = alertMatch[3]?.trim()
        if (trailing) {
          quoteLines[0] = trailing
        } else {
          quoteLines.shift()
        }
      } else {
        const boldHeaderMatch = first.match(/^\*\*(.*?)\*\*:?$/)
        if (boldHeaderMatch) {
          label = boldHeaderMatch[1].trim()
          const norm = label.toLowerCase()
          if (
            norm.includes('crític') ||
            norm.includes('critical') ||
            norm.includes('peligro') ||
            norm.includes('danger')
          ) {
            variant = 'critical'
          } else if (
            norm.includes('advertencia') ||
            norm.includes('warning') ||
            norm.includes('limitación') ||
            norm.includes('limitaciones') ||
            norm.includes('alerta')
          ) {
            variant = 'warning'
          } else if (
            norm.includes('tip') ||
            norm.includes('consejo') ||
            norm.includes('truco')
          ) {
            variant = 'tip'
          } else {
            variant = 'note'
          }
          quoteLines.shift()
        } else {
          const colonMatch = first.match(
            /^(Note|Tip|Warning|Critical|Nota|Advertencia|Atención|Consejo):\s*(.*)$/i,
          )
          if (colonMatch) {
            const norm = colonMatch[1].toLowerCase()
            if (norm === 'tip' || norm === 'consejo') variant = 'tip'
            else if (
              norm === 'warning' ||
              norm === 'advertencia' ||
              norm === 'atención'
            )
              variant = 'warning'
            else if (norm === 'critical') variant = 'critical'
            else variant = 'note'
            label = colonMatch[1]
            quoteLines[0] = colonMatch[2]
          }
        }
      }

      // If no explicit label was set and the next non-empty line is a standalone bold header
      while (quoteLines.length && !quoteLines[0].trim()) {
        quoteLines.shift()
      }
      if (!label && quoteLines.length > 0) {
        const nextBold = quoteLines[0].trim().match(/^\*\*(.*?)\*\*:?$/)
        if (nextBold) {
          label = nextBold[1].trim()
          quoteLines.shift()
          while (quoteLines.length && !quoteLines[0].trim()) {
            quoteLines.shift()
          }
        }
      }

      // Separate prose text lines and bullet list items (- or *)
      const textLines: string[] = []
      const items: string[] = []
      let collectingList = false

      for (const rawLine of quoteLines) {
        const line = rawLine.trim()
        if (!line) continue

        const bulletMatch = line.match(/^[-*]\s+(.*)$/)
        if (bulletMatch) {
          collectingList = true
          items.push(bulletMatch[1].trim())
        } else if (
          collectingList &&
          items.length > 0 &&
          (rawLine.startsWith('  ') || rawLine.startsWith('\t'))
        ) {
          items[items.length - 1] += ' ' + line
        } else {
          collectingList = false
          textLines.push(line)
        }
      }

      const text = textLines.join(' ').trim()

      blocks.push({
        type: 'callout',
        variant,
        ...(label ? { label } : {}),
        ...(text ? { text } : {}),
        ...(items.length > 0 ? { items } : {}),
      })
      continue
    }

    // ── 5. Code block: ```lang[:filename] ──
    if (trimmed.startsWith('```')) {
      const rawHeader = trimmed.slice(3).trim()
      let lang = 'shell'
      let filename: string | undefined

      if (rawHeader) {
        if (rawHeader.includes(':')) {
          const parts = rawHeader.split(':')
          lang = parts[0].trim() || 'shell'
          filename = parts.slice(1).join(':').trim()
        } else if (rawHeader.includes('filename=')) {
          const fnMatch = rawHeader.match(/filename=["']?([^"'\s]+)["']?/)
          if (fnMatch) filename = fnMatch[1]
          lang = rawHeader.replace(/filename=.*$/, '').trim() || 'shell'
        } else {
          lang = rawHeader
        }
      }

      i++
      const codeLines: string[] = []
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      if (i < lines.length && lines[i].trim().startsWith('```')) {
        i++
      }

      if (lang === 'filetree' || lang === 'tree') {
        blocks.push({
          type: 'fileTree',
          title: filename || 'Project Structure',
          content: codeLines.join('\n'),
        })
      } else {
        blocks.push({
          type: 'code',
          lang,
          filename,
          content: codeLines.join('\n'),
        })
      }
      continue
    }

    // ── 6. Markdown Table: | Col 1 | Col 2 | ──
    if (trimmed.startsWith('|') && trimmed.includes('|')) {
      const tableLines: string[] = []
      let tempI = i
      while (tempI < lines.length) {
        const cur = lines[tempI].trim()
        if (cur.startsWith('|')) {
          tableLines.push(cur)
          tempI++
        } else if (cur === '') {
          // Lookahead: check if the table continues after blank line(s)
          let nextIdx = tempI + 1
          while (nextIdx < lines.length && !lines[nextIdx].trim()) {
            nextIdx++
          }
          if (
            nextIdx < lines.length &&
            lines[nextIdx].trim().startsWith('|') &&
            !(
              nextIdx + 1 < lines.length &&
              lines[nextIdx + 1].trim().startsWith('|') &&
              lines[nextIdx + 1].trim().includes('-')
            )
          ) {
            tempI = nextIdx
          } else {
            break
          }
        } else {
          break
        }
      }

      if (tableLines.length >= 2 && tableLines[1].includes('-')) {
        i = tempI

        const splitCells = (lineStr: string): string[] => {
          let s = lineStr.trim()
          if (s.startsWith('|')) s = s.slice(1)
          if (s.endsWith('|')) s = s.slice(0, -1)
          return s.split('|').map((c) => c.trim())
        }

        const rawColumns = splitCells(tableLines[0])
        const columns = rawColumns.length > 0 ? rawColumns : ['']

        const rows: (string | number)[][] = []
        let pendingCells: string[] = []

        for (let r = 2; r < tableLines.length; r++) {
          const lineStr = tableLines[r].trim()
          if (!lineStr || lineStr === '|' || lineStr === '||') continue

          const cells = splitCells(lineStr)
          if (!cells.some(Boolean)) continue

          if (pendingCells.length === 0) {
            if (cells.length >= columns.length) {
              rows.push(cells.slice(0, columns.length))
            } else {
              pendingCells = [...cells]
            }
          } else {
            pendingCells.push(...cells)
            if (pendingCells.length >= columns.length) {
              rows.push(pendingCells.slice(0, columns.length))
              pendingCells = []
            }
          }
        }

        if (pendingCells.length > 0) {
          while (pendingCells.length < columns.length) {
            pendingCells.push('')
          }
          rows.push(pendingCells.slice(0, columns.length))
        }

        // Pad all rows to match columns.length
        for (const row of rows) {
          while (row.length < columns.length) {
            row.push('')
          }
        }

        // Caption extraction
        let caption: string | undefined = undefined

        // 1. Check if the last row is actually a caption row (e.g. | _Caption_ | | |)
        if (rows.length > 0) {
          const lastRow = rows[rows.length - 1]
          const firstVal = String(lastRow[0] || '').trim()
          const restEmpty = lastRow.slice(1).every((c) => !c || !String(c).trim())
          const capMatch =
            firstVal.match(/^(\*|_)(.+)\1$/) || firstVal.match(/^Table:\s*(.+)$/i)
          if (capMatch && restEmpty) {
            caption = (capMatch[2] ?? capMatch[1] ?? firstVal).trim()
            rows.pop()
          }
        }

        // 2. Check subsequent lines for a caption (e.g. _Caption_ or *Caption* or Table: Caption)
        if (!caption) {
          let lookAhead = i
          while (lookAhead < lines.length && !lines[lookAhead].trim()) {
            lookAhead++
          }
          if (lookAhead < lines.length && lookAhead <= i + 2) {
            const capCandidate = lines[lookAhead].trim()
            const capMatch =
              capCandidate.match(/^(\*|_)(.+)\1$/) ||
              capCandidate.match(/^Table:\s*(.+)$/i)
            if (
              capMatch &&
              !capCandidate.startsWith('#') &&
              !capCandidate.startsWith(':::') &&
              !capCandidate.startsWith('|') &&
              !capCandidate.startsWith('- ') &&
              !capCandidate.startsWith('* ') &&
              !capCandidate.startsWith('```')
            ) {
              caption = (capMatch[2] ?? capMatch[1] ?? '').trim()
              i = lookAhead + 1
            }
          }
        }

        blocks.push({
          type: 'table',
          columns,
          rows,
          caption,
        })
        continue
      }
    }

    // ── 7. Internal Headings: ### Title or #### Title ──
    if (trimmed.startsWith('#')) {
      const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/)
      if (headingMatch) {
        const level = headingMatch[1].length
        const cleanHeading = headingMatch[2].replace(/<!--.*?-->/, '').trim()
        blocks.push({
          type: 'heading',
          level,
          text: cleanHeading,
        })
        i++
        continue
      }
    }

    // ── 8. Bullet List: - Item or * Item ──
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const items: (string | { text: string; level: number })[] = []
      while (i < lines.length) {
        const rawLine = lines[i]
        const curTrim = rawLine.trim()

        if (!curTrim) {
          // Lookahead: check if next non-empty line continues this bullet list
          let nextIdx = i + 1
          while (nextIdx < lines.length && !lines[nextIdx].trim()) {
            nextIdx++
          }
          if (
            nextIdx < lines.length &&
            (lines[nextIdx].trim().startsWith('- ') || lines[nextIdx].trim().startsWith('* '))
          ) {
            i = nextIdx
            continue
          }
          break
        }

        const bulletMatch = curTrim.match(/^[-*]\s+(.*)$/)
        if (bulletMatch) {
          const indentMatch = rawLine.match(/^(\s*)/)
          const indentLength = indentMatch ? indentMatch[1].replace(/\t/g, '  ').length : 0
          const level = indentLength >= 2 ? 2 : 1
          let itemText = bulletMatch[1]
          i++

          while (
            i < lines.length &&
            lines[i].trim() &&
            (lines[i].startsWith('  ') || lines[i].startsWith('\t')) &&
            !lines[i].trim().startsWith('- ') &&
            !lines[i].trim().startsWith('* ') &&
            !lines[i].trim().match(/^\d+\.\s+/) &&
            !lines[i].trim().match(/^[a-zA-Z]\)\s+/)
          ) {
            itemText += ' ' + lines[i].trim()
            i++
          }

          items.push(level === 2 ? { text: itemText, level: 2 } : itemText)
        } else {
          break
        }
      }

      blocks.push({
        type: 'list',
        items,
      })
      continue
    }

    // ── 9. Numbered List: 1. Item or 1) Item or indented a) Item ──
    const numMatch = trimmed.match(/^(\d+\.|\d+\)|[a-zA-Z]\))\s+/)
    if (numMatch) {
      const items: (string | { text: string; level: number })[] = []
      while (i < lines.length) {
        const rawLine = lines[i]
        const curTrim = rawLine.trim()

        if (!curTrim) {
          let nextIdx = i + 1
          while (nextIdx < lines.length && !lines[nextIdx].trim()) {
            nextIdx++
          }
          if (
            nextIdx < lines.length &&
            lines[nextIdx].trim().match(/^(\d+\.|\d+\)|[a-zA-Z]\))\s+/)
          ) {
            i = nextIdx
            continue
          }
          break
        }

        const match = curTrim.match(/^(\d+\.|\d+\)|[a-zA-Z]\))\s+(.*)$/)
        if (match) {
          const indentMatch = rawLine.match(/^(\s*)/)
          const indentLength = indentMatch ? indentMatch[1].replace(/\t/g, '  ').length : 0
          const isLetter = /^[a-zA-Z]\)/.test(match[1])
          const level = (indentLength >= 2 || isLetter) ? 2 : 1

          let itemText = match[2]
          i++
          while (
            i < lines.length &&
            lines[i].trim() &&
            (lines[i].startsWith('  ') || lines[i].startsWith('\t')) &&
            !lines[i].trim().match(/^(\d+\.|\d+\)|[a-zA-Z]\))\s+/) &&
            !lines[i].trim().startsWith('- ') &&
            !lines[i].trim().startsWith('* ')
          ) {
            itemText += ' ' + lines[i].trim()
            i++
          }
          items.push(level === 2 ? { text: itemText, level: 2 } : itemText)
        } else {
          break
        }
      }

      blocks.push({
        type: 'list',
        ordered: true,
        items,
      })
      continue
    }

    // ── 10. Regular paragraph ──
    const paraLines: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith('#') &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].trim().startsWith('>') &&
      !lines[i].trim().startsWith('|') &&
      !lines[i].trim().startsWith('- ') &&
      !lines[i].trim().startsWith('* ') &&
      !lines[i].trim().match(/^\d+\.\s+/) &&
      !lines[i].trim().startsWith(':::')
    ) {
      paraLines.push(lines[i].trim())
      i++
    }

    if (paraLines.length > 0) {
      blocks.push({
        type: 'paragraph',
        text: paraLines.join(' '),
      })
    }

    // ── 11. Safety guarantee: always advance ──
    if (i === startI) {
      if (trimmed) {
        blocks.push({
          type: 'paragraph',
          text: trimmed,
        })
      }
      i++
    }
  }

  return blocks
}

export function parseMarkdownToSections(markdown: string): DocSection[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n')
  const sections: DocSection[] = []

  let currentSection: DocSection | null = null
  let currentSubSection: DocSubSection | null = null
  let sectionOverviewLines: string[] = []
  let subSectionMarkdownLines: string[] = []

  const commitSubSection = () => {
    if (currentSubSection && currentSection) {
      const rawMd = subSectionMarkdownLines.join('\n').trim()
      if (rawMd) {
        currentSubSection.blocks = parseMarkdownToBlocks(rawMd)
      }
      currentSection.subsections.push(currentSubSection)
      currentSubSection = null
      subSectionMarkdownLines = []
    }
  }

  const commitSection = () => {
    commitSubSection()
    if (currentSection) {
      const overviewText = sectionOverviewLines.join('\n').trim()
      if (overviewText) {
        currentSection.overview = overviewText
      }
      sections.push(currentSection)
      currentSection = null
      sectionOverviewLines = []
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    const isSectionHeader =
      trimmed.startsWith('# ') &&
      (trimmed.includes('id:') ||
        trimmed.match(/^#\s+[0-9]\)/) ||
        trimmed.match(/^#\s+layer/i))

    if (isSectionHeader) {
      commitSection()

      const rawTitle = trimmed.slice(2).trim()
      const { cleanTitle, meta } = extractHeadingMetadata(rawTitle)
      const id = meta.id || slugify(cleanTitle)

      const isHidden = meta.hidden === 'true'

      currentSection = {
        id,
        title: cleanTitle,
        icon: meta.icon,
        ...(isHidden ? { hidden: true } : {}),
        subsections: [],
      }
      continue
    }

    const isSubSectionHeader =
      trimmed.startsWith('## ') &&
      (trimmed.includes('id:') ||
        trimmed.includes('icon:') ||
        (!currentSubSection && currentSection))

    if (isSubSectionHeader && currentSection) {
      commitSubSection()

      const rawTitle = trimmed.slice(3).trim()
      const { cleanTitle, meta } = extractHeadingMetadata(rawTitle)
      const id = meta.id || slugify(cleanTitle)
      const isSubHidden = meta.hidden === 'true'

      currentSubSection = {
        id,
        title: cleanTitle,
        icon: meta.icon,
        ...(isSubHidden ? { hidden: true } : {}),
      }
      continue
    }

    if (currentSubSection) {
      subSectionMarkdownLines.push(line)
    } else if (currentSection) {
      sectionOverviewLines.push(line)
    }
  }

  commitSection()
  return sections
}
