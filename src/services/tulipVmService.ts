import { V86, type V86Options } from 'v86'

export type VmStatus = 'booting' | 'ready' | 'stopped'
export type SerialOutputListener = (byte: number) => void
export type SerialChunkListener = (chunk: Uint8Array) => void
export type StatusListener = (status: VmStatus) => void

/**
 * Singleton service decoupling the x86 WebAssembly VM lifecycle from React.
 * Keeps the VM running across window minimize, close, reopen actions in React UI-OS.
 */
class TulipVmService {
  private vm: V86 | null = null
  private status: VmStatus = 'stopped'
  private bootPromise: Promise<V86> | null = null

  // In-memory buffer storing recent serial output bytes (capped at maxBufferSize)
  private maxBufferSize = 65536 // 64 KB of recent characters
  private serialBuffer: number[] = []

  // Active listeners
  private serialListeners = new Set<SerialOutputListener>()
  private chunkListeners = new Set<SerialChunkListener>()
  private statusListeners = new Set<StatusListener>()

  // Pending chunk queue for micro-batching serial writes
  private pendingChunk: number[] = []
  private chunkFlushScheduled = false

  private readyDetected = false

  public getStatus(): VmStatus {
    return this.status
  }

  private setStatus(newStatus: VmStatus): void {
    if (this.status !== newStatus) {
      this.status = newStatus
      for (const listener of this.statusListeners) {
        try {
          listener(newStatus)
        } catch (err) {
          console.error('[TulipVmService] Error notifying status listener:', err)
        }
      }
    }
  }

  public onStatusChange(listener: StatusListener): () => void {
    this.statusListeners.add(listener)
    listener(this.status)
    return () => {
      this.statusListeners.delete(listener)
    }
  }

  /**
   * Lazily boots the v86 VM instance with headless serial configuration.
   */
  public async boot(): Promise<V86> {
    if (this.vm) {
      return this.vm
    }
    if (this.bootPromise) {
      return this.bootPromise
    }

    this.bootPromise = new Promise<V86>((resolve, reject) => {
      this.setStatus('booting')
      this.readyDetected = false

      const options: V86Options = {
        wasm_path: '/v86/v86.wasm',
        memory_size: 64 * 1024 * 1024,
        vga_memory_size: 2 * 1024 * 1024,
        bios: { url: '/v86/seabios.bin' },
        vga_bios: { url: '/v86/vgabios.bin' },
        bzimage: { url: '/v86/buildroot-bzimage68.bin' },
        cmdline: 'rw root=/dev/ram0 console=ttyS0 quiet',
        filesystem: {},
        autostart: true,
        disable_keyboard: true,
        disable_mouse: true,
      }

      try {
        const emulator = new V86(options)
        this.vm = emulator

        let hasResolved = false
        const markResolved = () => {
          if (!hasResolved) {
            hasResolved = true
            resolve(emulator)
          }
        }

        // Stream serial output from ttyS0
        emulator.add_listener('serial0-output-byte', (byte: number) => {
          this.serialBuffer.push(byte)

          // Amortized O(1) buffer trimming instead of O(N) shift per byte
          if (this.serialBuffer.length >= this.maxBufferSize * 1.5) {
            this.serialBuffer = this.serialBuffer.slice(-this.maxBufferSize)
          }

          // Check for prompt indicators to transition from booting to ready
          if (!this.readyDetected) {
            const recent = this.getRecentOutput(128)
            if (
              recent.includes('# ') ||
              recent.includes('$ ') ||
              recent.includes('~%') ||
              recent.includes('~ #') ||
              recent.includes('/ #') ||
              recent.includes('login:') ||
              recent.includes('Welcome to Buildroot') ||
              recent.includes('buildroot login') ||
              recent.includes('Files send via emulator')
            ) {
              this.readyDetected = true
              this.setStatus('ready')
              markResolved()
            }
          }

          // Individual byte listeners
          for (const listener of this.serialListeners) {
            try {
              listener(byte)
            } catch (err) {
              console.error('[TulipVmService] Error in serial listener:', err)
            }
          }

          // Micro-batched chunk listeners for lag-free rendering
          if (this.chunkListeners.size > 0) {
            this.pendingChunk.push(byte)
            if (!this.chunkFlushScheduled) {
              this.chunkFlushScheduled = true
              queueMicrotask(() => {
                this.chunkFlushScheduled = false
                if (this.pendingChunk.length > 0) {
                  const chunk = new Uint8Array(this.pendingChunk)
                  this.pendingChunk = []
                  for (const cl of this.chunkListeners) {
                    try {
                      cl(chunk)
                    } catch (err) {
                      console.error('[TulipVmService] Error in chunk listener:', err)
                    }
                  }
                }
              })
            }
          }
        })

        emulator.add_listener('emulator-ready', () => {
          markResolved()
          // If not detected via prompt text after a brief grace period, mark ready
          setTimeout(() => {
            if (this.status === 'booting') {
              this.readyDetected = true
              this.setStatus('ready')
            }
          }, 3500)
        })

        emulator.add_listener('emulator-stopped', () => {
          this.setStatus('stopped')
        })

        emulator.add_listener('download-error', (err) => {
          console.error('[TulipVmService] Download error for VM asset:', err)
          this.setStatus('stopped')
          this.bootPromise = null
          this.vm = null
          if (!hasResolved) {
            hasResolved = true
            reject(new Error(`VM asset download error: ${String(err)}`))
          }
        })

        // Resolve immediately so callers can interact or subscribe
        markResolved()
      } catch (err) {
        this.setStatus('stopped')
        this.bootPromise = null
        this.vm = null
        console.error('[TulipVmService] Failed to initialize v86:', err)
        reject(err)
      }
    })

    return this.bootPromise
  }

  /**
   * Waits for the VM to fully boot and display a ready shell prompt.
   */
  public async waitForReady(timeoutMs = 60000): Promise<V86> {
    const vm = await this.boot()
    if (this.status === 'ready') return vm

    return new Promise<V86>((resolve, reject) => {
      let timer: ReturnType<typeof setTimeout> | null = null

      const unsubscribe = this.onStatusChange((status) => {
        if (status === 'ready') {
          if (timer) clearTimeout(timer)
          unsubscribe()
          resolve(vm)
        } else if (status === 'stopped') {
          if (timer) clearTimeout(timer)
          unsubscribe()
          reject(new Error('VM stopped before reaching ready state'))
        }
      })

      timer = setTimeout(() => {
        unsubscribe()
        if (this.status !== 'stopped') {
          this.readyDetected = true
          this.setStatus('ready')
          resolve(vm)
        } else {
          reject(new Error(`Timeout waiting for VM ready (${timeoutMs}ms)`))
        }
      }, timeoutMs)
    })
  }

  /**
   * Subscribe to serial byte output (legacy single-byte subscriber).
   */
  public subscribeSerial(listener: SerialOutputListener): () => void {
    this.serialListeners.add(listener)
    return () => {
      this.serialListeners.delete(listener)
    }
  }

  /**
   * Subscribe to coalesced serial output chunks for high-throughput, lag-free terminal rendering.
   */
  public subscribeSerialChunks(listener: SerialChunkListener): () => void {
    this.chunkListeners.add(listener)
    return () => {
      this.chunkListeners.delete(listener)
    }
  }

  /**
   * Send text or keystroke sequences directly to serial ttyS0.
   * Encodes strings into UTF-8 bytes to guarantee that pipe (|), redirects (>, >>),
   * accents, and control sequences are transmitted accurately without character corruption.
   */
  public serial0_send(data: string | Uint8Array): void {
    const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data

    const sendBytes = (emulator: V86) => {
      const bus = (emulator as unknown as { bus?: { send: (name: string, value: number) => void } }).bus
      if (bus && typeof bus.send === 'function') {
        for (let i = 0; i < bytes.length; i++) {
          bus.send('serial0-input', bytes[i])
        }
      } else if (typeof emulator.serial0_send === 'function') {
        const str = typeof data === 'string' ? data : new TextDecoder().decode(bytes)
        emulator.serial0_send(str)
      }
    }

    if (this.vm) {
      sendBytes(this.vm)
    } else {
      this.boot()
        .then((vm) => sendBytes(vm))
        .catch((err) => console.error('[TulipVmService] Error sending to serial port:', err))
    }
  }

  /**
   * Get the recent serial output as a decoded string.
   */
  public getRecentOutput(maxChars?: number): string {
    const slice = maxChars ? this.serialBuffer.slice(-maxChars) : this.serialBuffer
    return new TextDecoder('utf-8', { fatal: false }).decode(new Uint8Array(slice))
  }

  /**
   * Get the raw recent output bytes.
   */
  public getRawBuffer(): Uint8Array {
    const slice = this.serialBuffer.slice(-this.maxBufferSize)
    return new Uint8Array(slice)
  }

  /**
   * Cold restart of the VM: tears down the current instance, clears buffers,
   * and initializes a fresh instance.
   */
  public async reset(): Promise<void> {
    if (this.vm) {
      const oldVm = this.vm
      this.vm = null
      try {
        await Promise.race([
          oldVm.destroy(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('vm.destroy timeout')), 2500)),
        ])
      } catch (err) {
        console.warn('[TulipVmService] Notice during vm.destroy():', err)
      }
    }
    this.bootPromise = null
    this.serialBuffer = []
    this.pendingChunk = []
    this.readyDetected = false
    this.setStatus('booting')
    await this.boot()
  }

  /**
   * Helper to write a file into the guest 9pfs root.
   */
  public async writeFile(path: string, content: string | Uint8Array): Promise<void> {
    const emulator = await this.boot()
    const data = typeof content === 'string' ? new TextEncoder().encode(content) : content
    const cleanPath = path.startsWith('/') ? path.slice(1) : path

    try {
      await emulator.create_file(cleanPath, data)
    } catch {
      await emulator.create_file(path, data)
    }
  }

  /**
   * Helper to read a file from the guest 9pfs root.
   */
  public async readFile(path: string): Promise<string> {
    const emulator = await this.boot()
    const cleanPath = path.startsWith('/') ? path.slice(1) : path

    let bytes: Uint8Array
    try {
      bytes = await emulator.read_file(cleanPath)
    } catch {
      bytes = await emulator.read_file(path)
    }
    return new TextDecoder().decode(bytes)
  }
}

export const tulipVmService = new TulipVmService()
