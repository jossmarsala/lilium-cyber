// Shared input schemas for the MCP tools and the HTTP API.
// Keeping them in one place guarantees both interfaces accept the same payloads.
import { z } from 'zod'

const timeoutMs = z.number().int().positive().max(120_000).optional()
const settleMs = z.number().int().min(0).max(10_000).optional()

export const waitUntilSchema = z.enum(['load', 'domcontentloaded', 'networkidle', 'commit'])

export const locatorSchema = z.object({
  selector: z
    .string()
    .min(1)
    .optional()
    .describe('CSS selector, for example "button[type=submit]".'),
  role: z
    .string()
    .min(1)
    .optional()
    .describe('ARIA role, for example "button", "link", "textbox", "heading".'),
  name: z.string().optional().describe('Accessible name used together with role.'),
  label: z.string().optional().describe('Form label text, for example "Email".'),
  placeholder: z.string().optional().describe('Input placeholder text.'),
  text: z.string().optional().describe('Visible text content.'),
  testId: z.string().optional().describe('Value of the data-testid attribute.'),
  exact: z.boolean().optional().describe('Require an exact name/text match. Defaults to false.'),
  index: z
    .number()
    .int()
    .min(0)
    .optional()
    .describe('Zero-based index when the locator matches several elements. Defaults to 0.'),
})

export const navigateSchema = z.object({
  url: z
    .string()
    .min(1)
    .describe(
      'Absolute URL, or a path relative to BROWSER_BASE_URL (default http://localhost:5173).'
    ),
  waitUntil: waitUntilSchema
    .optional()
    .describe('Navigation readiness. Defaults to "networkidle" with a graceful fallback.'),
  timeoutMs: timeoutMs.describe('Navigation timeout in milliseconds.'),
  waitForSelector: z
    .string()
    .optional()
    .describe('Wait for this CSS selector to be visible after navigation (useful for hydration).'),
  settleMs: settleMs.describe(
    'Extra wait after navigation for client-side rendering. Defaults to 200.'
  ),
})

export const snapshotSchema = z.object({
  mode: z
    .enum(['aria', 'text', 'html'])
    .optional()
    .describe(
      'aria (default) returns the accessibility tree, text returns visible text, html returns outerHTML.'
    ),
  selector: z
    .string()
    .optional()
    .describe('Scope the snapshot to a CSS selector. Defaults to the whole body.'),
  maxChars: z
    .number()
    .int()
    .min(1_000)
    .max(500_000)
    .optional()
    .describe('Truncate the snapshot after this many characters. Defaults to 60000.'),
})

export const clickSchema = locatorSchema.extend({
  button: z
    .enum(['left', 'right', 'middle'])
    .optional()
    .describe('Mouse button. Defaults to left.'),
  clickCount: z
    .number()
    .int()
    .min(1)
    .max(3)
    .optional()
    .describe('Number of clicks. Defaults to 1.'),
  timeoutMs: timeoutMs.describe('Action timeout in milliseconds.'),
  settleMs: settleMs.describe('Extra wait after clicking. Defaults to 200.'),
  waitForSelector: z
    .string()
    .optional()
    .describe('Wait for this selector after clicking instead of the short network-idle wait.'),
})

export const fillSchema = locatorSchema.extend({
  value: z.string().describe('Value to enter. Replaces the current value.'),
  submit: z.boolean().optional().describe('Press Enter after filling. Defaults to false.'),
  timeoutMs: timeoutMs.describe('Action timeout in milliseconds.'),
  settleMs: settleMs.describe('Extra wait after filling. Defaults to 200.'),
  waitForSelector: z.string().optional().describe('Wait for this selector after filling.'),
})

export const pressSchema = locatorSchema.extend({
  key: z
    .string()
    .min(1)
    .describe('Key or chord to press, for example "Enter", "Escape", "Control+A".'),
  timeoutMs: timeoutMs.describe('Action timeout in milliseconds.'),
  settleMs: settleMs.describe('Extra wait after pressing. Defaults to 150.'),
})

export const waitSchema = z.object({
  selector: z.string().optional().describe('CSS selector to wait for.'),
  text: z.string().optional().describe('Visible text to wait for.'),
  url: z.string().optional().describe('URL glob to wait for, for example "**/dashboard".'),
  state: z
    .enum(['attached', 'detached', 'visible', 'hidden'])
    .optional()
    .describe('Element state for selector/text waits. Defaults to visible.'),
  timeoutMs: timeoutMs.describe('Maximum wait in milliseconds.'),
})

export const screenshotSchema = z.object({
  path: z
    .string()
    .optional()
    .describe(
      'Optional file path. Relative paths resolve inside BROWSER_ARTIFACTS_DIR (default .browser/artifacts).'
    ),
  selector: z.string().optional().describe('Capture only the element matching this CSS selector.'),
  fullPage: z.boolean().optional().describe('Capture the full scrollable page. Defaults to true.'),
  type: z.enum(['png', 'jpeg', 'webp']).optional().describe('Image format. Defaults to png.'),
  quality: z
    .number()
    .int()
    .min(0)
    .max(100)
    .optional()
    .describe('Lossy quality for jpeg/webp (0-100). Ignored for png.'),
  timeoutMs: timeoutMs.describe('Screenshot timeout in milliseconds.'),
})

export const resizeSchema = z.object({
  width: z.number().int().min(100).max(10_000).describe('Viewport width in CSS pixels.'),
  height: z.number().int().min(100).max(10_000).describe('Viewport height in CSS pixels.'),
})

export type LocatorInput = z.infer<typeof locatorSchema>
export type NavigateInput = z.infer<typeof navigateSchema>
export type SnapshotInput = z.infer<typeof snapshotSchema>
export type ClickInput = z.infer<typeof clickSchema>
export type FillInput = z.infer<typeof fillSchema>
export type PressInput = z.infer<typeof pressSchema>
export type WaitInput = z.infer<typeof waitSchema>
export type ScreenshotInput = z.infer<typeof screenshotSchema>
export type ResizeInput = z.infer<typeof resizeSchema>
