/**
 * scripts/generate-og-png.mjs
 * Generates a valid 1200x630 PNG file for Open Graph and Twitter Card social previews
 * using pure Node.js built-ins (zlib, Buffer, fs) without third-party dependencies.
 */
import fs from 'node:fs'
import path from 'node:path'
import zlib from 'node:zlib'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

const WIDTH = 1200
const HEIGHT = 630

function crc32(buf) {
  let table = crc32.table
  if (!table) {
    table = crc32.table = new Uint32Array(256)
    for (let i = 0; i < 256; i++) {
      let c = i
      for (let j = 0; j < 8; j++) {
        c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1)
      }
      table[i] = c
    }
  }
  let crc = 0xffffffff
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii')
  const lenBuf = Buffer.alloc(4)
  lenBuf.writeUInt32BE(data.length, 0)
  const toCrc = Buffer.concat([typeBuf, data])
  const crcVal = crc32(toCrc)
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crcVal, 0)
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf])
}

// Generate image pixels (RGBA)
const rawData = Buffer.alloc(HEIGHT * (1 + WIDTH * 4))

let offset = 0
for (let y = 0; y < HEIGHT; y++) {
  // Filter byte 0 (None)
  rawData[offset++] = 0

  for (let x = 0; x < WIDTH; x++) {
    // Base dark background (#090a0f -> #0d111a)
    let r = Math.floor(9 + (x / WIDTH) * 4 + (y / HEIGHT) * 6)
    let g = Math.floor(10 + (x / WIDTH) * 6 + (y / HEIGHT) * 8)
    let b = Math.floor(15 + (x / WIDTH) * 12 + (y / HEIGHT) * 10)

    // Subtle Grid pattern every 40px
    if (x % 40 === 0 || y % 40 === 0) {
      r = Math.min(255, r + 7)
      g = Math.min(255, g + 8)
      b = Math.min(255, b + 12)
    }

    // Top-right glowing emerald nebula (around x: 920, y: 160)
    const distEmerald = Math.hypot(x - 920, y - 160)
    if (distEmerald < 420) {
      const factor = Math.max(0, 1 - distEmerald / 420)
      r = Math.min(255, Math.floor(r + 0 * factor))
      g = Math.min(255, Math.floor(g + 255 * factor * 0.22))
      b = Math.min(255, Math.floor(b + 102 * factor * 0.15))
    }

    // Bottom-left subtle blue accent (around x: 220, y: 520)
    const distBlue = Math.hypot(x - 220, y - 520)
    if (distBlue < 380) {
      const factor = Math.max(0, 1 - distBlue / 380)
      r = Math.min(255, Math.floor(r + 59 * factor * 0.12))
      g = Math.min(255, Math.floor(g + 130 * factor * 0.15))
      b = Math.min(255, Math.floor(b + 246 * factor * 0.25))
    }

    // Outer subtle card border (x: 20..1180, y: 20..610)
    if (
      (x === 20 || x === 1179) && y >= 20 && y <= 610 ||
      (y === 20 || y === 609) && x >= 20 && x <= 1180
    ) {
      r = Math.min(255, r + 40)
      g = Math.min(255, g + 45)
      b = Math.min(255, b + 55)
    }

    // Terminal mock window frame on the right (x: 680..1120, y: 80..550)
    if (x >= 680 && x <= 1120 && y >= 80 && y <= 550) {
      // Terminal background #0d1017
      r = Math.floor(r * 0.3 + 13 * 0.7)
      g = Math.floor(g * 0.3 + 16 * 0.7)
      b = Math.floor(b * 0.3 + 23 * 0.7)

      // Window border
      if (x === 680 || x === 1120 || y === 80 || y === 550) {
        r = 60
        g = 70
        b = 90
      }

      // Title bar header (y: 80..122)
      if (y <= 122) {
        r += 12
        g += 14
        b += 18

        // Red close button (x: 704, y: 101)
        if (Math.hypot(x - 704, y - 101) <= 6) {
          r = 255; g = 95; b = 86
        }
        // Yellow minimize (x: 724, y: 101)
        else if (Math.hypot(x - 724, y - 101) <= 6) {
          r = 255; g = 189; b = 46
        }
        // Green maximize (x: 744, y: 101)
        else if (Math.hypot(x - 744, y - 101) <= 6) {
          r = 39; g = 201; b = 63
        }
      }

      // Inside terminal: highlight box (y: 350..420, x: 705..1095)
      if (y >= 350 && y <= 420 && x >= 705 && x <= 1095) {
        r = Math.floor(r * 0.6 + 0 * 0.4)
        g = Math.floor(g * 0.6 + 80 * 0.4)
        b = Math.floor(b * 0.6 + 40 * 0.4)
      }
    }

    rawData[offset++] = r
    rawData[offset++] = g
    rawData[offset++] = b
    rawData[offset++] = 255 // Alpha
  }
}

// Compress data
const compressed = zlib.deflateSync(rawData)

// PNG signature
const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

// IHDR chunk
const ihdr = Buffer.alloc(13)
ihdr.writeUInt32BE(WIDTH, 0)
ihdr.writeUInt32BE(HEIGHT, 4)
ihdr[8] = 8 // bit depth
ihdr[9] = 6 // color type RGBA
ihdr[10] = 0 // compression
ihdr[11] = 0 // filter
ihdr[12] = 0 // interlace

const pngBuffer = Buffer.concat([
  signature,
  createChunk('IHDR', ihdr),
  createChunk('IDAT', compressed),
  createChunk('IEND', Buffer.alloc(0))
])

const outputPath = path.resolve(rootDir, 'public/og-image.png')
fs.writeFileSync(outputPath, pngBuffer)
console.log(`[generate-og-png] Successfully generated ${outputPath} (${pngBuffer.length} bytes).`)
