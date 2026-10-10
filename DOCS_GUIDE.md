# Cyber Range — Documentation Authoring Guide

This guide covers how to write, structure, and maintain documentation for the Cyber Range application using **Markdown**, the data layer in [src/data/docs.json](file:///Users/jossmarsala/Documents/cyber-range/src/data/docs.json), and the built-in Docs UI components.

---

## 1. Architecture Overview

The documentation system is data-driven, strictly typed, and rendered dynamically:

- **Primary Content Store**: [src/data/docs.json](file:///Users/jossmarsala/Documents/cyber-range/src/data/docs.json) — all chapters, subsections, and component blocks.
- **TypeScript Types**: [src/data/docs.ts](file:///Users/jossmarsala/Documents/cyber-range/src/data/docs.ts) — definitions for `DocSection`, `DocSubSection`, and `DocBlock`.
- **Content Renderer**: [src/components/DocsContent.tsx](file:///Users/jossmarsala/Documents/cyber-range/src/components/DocsContent.tsx) — renders breadcrumbs, headers, and block widgets.
- **Sidebar Menu**: [src/components/DocsSidebar.tsx](file:///Users/jossmarsala/Documents/cyber-range/src/components/DocsSidebar.tsx) — hierarchical accordion navigation using the branched tree menu.
- **Icon Registry**: [src/utils/docIcons.ts](file:///Users/jossmarsala/Documents/cyber-range/src/utils/docIcons.ts) — resolves HugeIcons for subsections and sidebar items.
- **Routing**:
  - `/docs/:sectionId` → renders section overview and an _"In this section"_ directory card.
  - `/docs/:sectionId/:subSectionId` → renders the specific subsection content.

---

## 2. Document Hierarchy in `docs.json`

Every top-level entry in `docs.json` represents a **Section**, which contains zero or more **Subsections**:

```json
[
  {
    "id": "layer-1",
    "title": "1) Comprender",
    "overview": "Overview text displayed when viewing the root section.",
    "subsections": [
      {
        "id": "introduction",
        "title": "Fundamentos",
        "icon": "Book02Icon",
        "blocks": [/* Array of content blocks */]
      }
    ]
  }
]
```

### Key Properties

| Property   | Type         | Description                                                                                                                              |
| :--------- | :----------- | :--------------------------------------------------------------------------------------------------------------------------------------- |
| `id`       | `string`     | URL slug (e.g. `layer-1`, `threats`). Used in routes `/docs/:sectionId/:subSectionId`.                                                   |
| `title`    | `string`     | Display title in header and sidebar. _(Sidebar truncates titles > 26 characters with `...`)_.                                            |
| `icon`     | `string`     | _(Optional)_ Icon identifier or keyword (e.g. `"Book02Icon"`, `"threats"`, `"tools"`).                                                   |
| `overview` | `string`     | Summary paragraph shown on the section root page.                                                                                        |
| `blocks`   | `DocBlock[]` | Structured content blocks rendered by [DocsContent.tsx](file:///Users/jossmarsala/Documents/cyber-range/src/components/DocsContent.tsx). |
| `content`  | `string`     | _(Fallback)_ Plain-text or markdown string if `blocks` is omitted.                                                                       |

> [!NOTE]
> All prose and descriptions across blocks automatically support **inline code** by wrapping words in single backticks (e.g. `` `npm run dev` ``).

---

## 3. Supported Content Blocks Reference

Each item in a subsection's `blocks` array must specify a `"type"` property:

### 1. Paragraph (`"paragraph"`)

Basic body text with inline code parsing:

```json
{
  "type": "paragraph",
  "text": "The source tree follows a feature-based layout with `src/components` and `src/data`."
}
```

---

### 2. Callout (`"callout"`)

Contextual message callout rendered via [DocsCallout.tsx](file:///Users/jossmarsala/Documents/cyber-range/src/components/DocsCallout.tsx).

- **`variant`**: `"note"` (default) | `"tip"` | `"warning"` | `"critical"`
- **`label`**: _(Optional)_ Custom label string overriding the default.

```json
{
  "type": "callout",
  "variant": "warning",
  "label": "Breaking Change",
  "text": "Node.js 18+ is required. Check your version with `node -v` before proceeding."
}
```

---

### 3. Standalone Code Block (`"code"`)

Syntax-highlighted code block with line numbering, copy button, and window decorations rendered via [CodeBlock.tsx](file:///Users/jossmarsala/Documents/cyber-range/src/components/CodeBlock.tsx).

- **`lang`**: `"bash"` | `"shell"` | `"json"` | `"typescript"` | `"tsx"` | etc.
- **`filename`**: _(Optional)_ Monospace tab label in the code block header.
- **`content`**: Code string (use `\n` for line breaks).

```json
{
  "type": "code",
  "lang": "bash",
  "filename": "terminal",
  "content": "git clone https://github.com/your-org/cyber-range.git\ncd cyber-range\nnpm install"
}
```

---

### 4. Interactive Steps (`"steps"`)

Numbered procedure list rendered via [DocsSteps.tsx](file:///Users/jossmarsala/Documents/cyber-range/src/components/DocsSteps.tsx).

- **`items[].title`**: Step heading.
- **`items[].description`**: _(Optional)_ Detailed instructions.
- **`items[].code`**: _(Optional)_ `{ "lang": "bash", "content": "..." }`.
- **`items[].outcome`**: _(Optional)_ Green completion pill message.
- **`items[].completed`**: _(Optional)_ `true` to render checkmark bubble.

```json
{
  "type": "steps",
  "items": [
    {
      "title": "Clone the repository",
      "code": {
        "lang": "bash",
        "content": "git clone https://github.com/your-org/cyber-range.git\ncd cyber-range"
      }
    },
    {
      "title": "Install dependencies",
      "code": {
        "lang": "bash",
        "content": "npm install"
      },
      "outcome": "Dependencies installed successfully"
    },
    {
      "title": "Start local dev server",
      "code": {
        "lang": "bash",
        "content": "npm run dev"
      },
      "outcome": "App running at http://localhost:5173",
      "description": "Hot module replacement is enabled."
    }
  ]
}
```

---

### 5. Table (`"table"`)

Scrollable comparison or parameter table rendered via [DocsTable.tsx](file:///Users/jossmarsala/Documents/cyber-range/src/components/DocsTable.tsx).

- **`columns`**: Array of column header strings.
- **`rows`**: 2D array of row values (supports backticks for inline code).
- **`caption`**: _(Optional)_ Muted footer label.

```json
{
  "type": "table",
  "columns": ["Tool", "Min Version", "Verification"],
  "rows": [
    ["Node.js", "18.0.0", "`node -v`"],
    ["npm", "9.0.0", "`npm -v`"],
    ["Git", "any", "`git --version`"]
  ],
  "caption": "Development environment prerequisites"
}
```

---

### 6. Bullet List (`"list"`)

Styled bulleted list rendered via [DocsList.tsx](file:///Users/jossmarsala/Documents/cyber-range/src/components/DocsList.tsx).

```json
{
  "type": "list",
  "items": [
    "Supports both `npm` and `pnpm` package managers.",
    "Strict TypeScript typing with path alias `@/*`.",
    "Integrated Vite dev server with fast refresh."
  ]
}
```

---

### 7. Key-Value Group (`"group"`)

Card container for configuration schemas, environment variables, or CLI flags.

- **`title`**: Header label.
- **`description`**: _(Optional)_ Header sublabel / file path (e.g. `".env"`).
- **`rows[].keyLabel`**: Parameter or key name (monospace).
- **`rows[].badge`**: _(Optional)_ `"required"` | `"optional"` | `"default"`.
- **`rows[].text`**: Explanation of the variable/setting.

```json
{
  "type": "group",
  "title": "Environment Variables",
  "description": ".env.local",
  "rows": [
    {
      "keyLabel": "VITE_API_URL",
      "badge": "required",
      "text": "Base endpoint for the Cyber Range telemetry backend."
    },
    {
      "keyLabel": "PORT",
      "badge": "optional",
      "text": "Port for local web server. Defaults to `5173`."
    }
  ]
}
```

---

### 8. File Tree (`"fileTree"`)

Structured monospace project tree diagram.

```json
{
  "type": "fileTree",
  "title": "Directory Layout",
  "content": "src/\n  components/   # Reusable UI components\n  data/         # docs.json and typed sources\n  pages/        # Routed views\n  router/       # Application routing configuration"
}
```

---

### 9. Next Subindex Navigation Button (`"nextButton"`)

Reusable action button to navigate readers to the next (or previous) subindex or section, rendered via [DocsNextButton.tsx](file:///Users/jossmarsala/Documents/cyber-range/src/components/DocsNextButton.tsx).

- **`to`**: _(Optional)_ Destination route (e.g. `"/docs/layer-1/frameworks-references"`). Automatically deduced if omitted.
- **`title`**: _(Optional)_ Target title. Automatically deduced if omitted.
- **`sectionTitle`**: _(Optional)_ Category or parent chapter indicator.
- **`description`**: _(Optional)_ Short synopsis.
- **`variant`**: `"card"` (default pagination block) | `"banner"` (wide hero callout) | `"pill"` (inline tag button) | `"compact"` (minimal).

```json
{
  "type": "nextButton",
  "variant": "banner",
  "title": "Frameworks y Referencias",
  "sectionTitle": "1) Comprender",
  "description": "Explora los estándares NIST, CIS Controls e ISO 27001 implementados en la plataforma."
}
```

---

## 4. Sidebar & Icon Configuration

Icons are resolved automatically in [src/utils/docIcons.ts](file:///Users/jossmarsala/Documents/cyber-range/src/utils/docIcons.ts). You can assign icons using two methods:

### Method A: Direct HugeIcons Icon Name

Set `"icon"` to any registered icon name from `DOC_ICONS`:

- Books: `"Book01Icon"`, `"Book02Icon"`, `"Bookmark01Icon"`
- Security: `"Shield01Icon"`, `"ShieldAlertIcon"`, `"LockKeyIcon"`, `"BrainIcon"`
- Warnings: `"AlertDiamondIcon"`, `"Alert01Icon"`, `"Bug01Icon"`
- Infrastructure: `"ServerIcon"`, `"NetworkIcon"`, `"CpuIcon"`, `"ComputerIcon"`
- Tools: `"ToolsIcon"`, `"Wrench01Icon"`, `"CommandLineIcon"`, `"TerminalIcon"`
- Structure: `"Layers01Icon"`, `"Database01Icon"`, `"Folder01Icon"`

### Method B: Semantic Keyword Aliases

You can use natural keywords or let the system deduce the icon from the subsection `id`:

- `"threats"` or `"threat"` → `AlertDiamondIcon`
- `"networks"` or `"network"` → `NetworkIcon`
- `"toolkit"` or `"tools"` → `ToolsIcon`
- `"security"` or `"mentality"` → `Shield01Icon` / `BrainIcon`
- `"server"` or `"os"` → `ServerIcon`
- `"intro"` or `"fundamentos"` → `Book02Icon`

---

## 5. Direct TSX Component Usage

If you are developing custom pages or components outside of `docs.json`, you can import and compose the docs components directly:

```tsx
import {
  DocsCallout,
  DocsSteps,
  DocsStep,
  DocsList,
  DocsListItem,
  DocsGroup,
  DocsGroupRow,
  DocsTable,
  CodeBlock,
  DocsNextButton,
  DocsPagination,
  DocsSubindexCard,
} from '@/components/docs'

export function MyCustomGuide() {
  return (
    <div>
      <DocsCallout variant="tip" label="Pro Tip">
        Remember to start Docker before launching simulations.
      </DocsCallout>

      <DocsGroup title="Simulation Flags" description="config.json">
        <DocsGroupRow keyLabel="enableLiveTelemetry" badge="default">
          Streams real-time metrics over WebSocket.
        </DocsGroupRow>
      </DocsGroup>

      <DocsSteps>
        <DocsStep
          title="Launch Simulation"
          code={{ lang: 'bash', content: 'npm run simulate' }}
          outcome="Simulation active"
        >
          Executes the scenario script in headless mode.
        </DocsStep>
      </DocsSteps>

      {/* Standalone Next Subindex Button */}
      <DocsNextButton
        variant="card"
        to="/docs/layer-1/frameworks-references"
        title="Frameworks y Referencias"
        sectionTitle="1) Comprender"
      />

      {/* Dual Previous / Next Bottom Pagination Bar */}
      <DocsPagination sectionId="layer-1" subSectionId="introduction" />
    </div>
  )
}
```

---

## 6. Writing in Markdown (`docs/docs.md` Compiler)

Instead of hand-writing JSON, you can author all your documentation in standard Markdown inside [docs/docs.md](file:///Users/jossmarsala/Documents/cyber-range/docs/docs.md) and compile it automatically.

### Running the Compiler

```bash
npm run docs:build
```

You can also specify custom input/output paths:

```bash
node scripts/md-to-docs.mjs path/to/my-doc.md --out src/data/docs.json
```

### Markdown Syntax Cheatsheet

| Component          | Markdown Syntax                                                                  |
| :----------------- | :------------------------------------------------------------------------------- |
| **Section**        | `# 1) Comprender <!-- id: layer-1 -->`                                           |
| **Subsection**     | `## Fundamentos <!-- id: introduction, icon: Book02Icon -->`                     |
| **Next Subindex**  | `:::next title="Frameworks" to="/docs/layer-1/frameworks-references"`            |
| **Callout**        | `> [!NOTE]` or `> [!TIP]` or `> [!WARNING]` or `> [!CRITICAL]`                   |
| **Code Block**     | ` ```bash:terminal ` or ` ```typescript filename="src/app.ts" `                  |
| **Table**          | Standard `\| Header 1 \| Header 2 \|` with optional `*Caption text*` below       |
| **Steps**          | `:::steps` block with `### Step Title`, sub-codeblocks, and `> outcome: Success` |
| **Group / Badges** | `:::group title="Env" description=".env"` with `- **KEY** [required]: text`      |
| **File Tree**      | ` ```filetree:Project Structure ` or `:::filetree title="..."`                   |
| **Bullet List**    | Standard `- item 1` or `* item 2`                                                |
| **Inline Code**    | Words wrapped in single backticks: `` `command` ``                               |
