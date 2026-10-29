import { Renderer, Program, Mesh, Color, Triangle, Texture } from 'ogl'
import { useEffect, useRef, useMemo, useCallback } from 'react'
import './FaultyTerminal.css'

const LILIUM_PATHS = [
  'M265.29,35.32l-30.44,91.33c-1.85,5.56,3.44,10.85,9,9l91.33-30.44c2.12-.71,3.79-2.38,4.5-4.5l30.44-91.33c1.85-5.56-3.44-10.85-9-9l-91.33,30.44c-2.12.71-3.79,2.38-4.5,4.5Z',
  'M100.7,30.81L9.38.38C3.82-1.48-1.48,3.82.38,9.38l30.44,91.33c.71,2.12,2.38,3.79,4.5,4.5l91.33,30.44c5.56,1.85,10.85-3.44,9-9l-30.44-91.33c-.71-2.12-2.38-3.79-4.5-4.5Z',
  'M335.18,265.29l-91.33-30.44c-5.56-1.85-10.85,3.44-9,9l30.44,91.33c.71,2.12,2.38,3.79,4.5,4.5l91.33,30.44c5.56,1.85,10.85-3.44,9-9l-30.44-91.33c-.71-2.12-2.38-3.79-4.5-4.5Z',
  'M265.42,196.17c0,3.93,3.19,7.12,7.12,7.12h57.91c3.93,0,7.12-3.19,7.12-7.12v-21.84c0-3.93-3.19-7.12-7.12-7.12h-57.91c-3.93,0-7.12,3.19-7.12,7.12v21.84Z',
  'M232.24,167.21h-21.84c-3.93,0-7.12-3.19-7.12-7.12v-21.84c0-3.93-3.19-7.12-7.12-7.12h-21.84c-3.93,0-7.12,3.19-7.12,7.12v21.84c0,3.93-3.19,7.12-7.12,7.12h-21.84c-3.93,0-7.12,3.19-7.12,7.12v21.84c0,3.93,3.19,7.12,7.12,7.12h21.84c3.93,0,7.12,3.19,7.12,7.12v21.84c0,3.93,3.19,7.12,7.12,7.12h21.84c3.93,0,7.12-3.19,7.12-7.12v-21.84c0-3.93,3.19-7.12,7.12-7.12h21.84c3.93,0,7.12-3.19,7.12-7.12v-21.84c0-3.93-3.19-7.12-7.12-7.12Z',
  'M105.21,335.18l30.44-91.33c1.85-5.56-3.44-10.85-9-9l-91.33,30.44c-2.12.71-3.79,2.38-4.5,4.5L.38,361.12c-1.85,5.56,3.44,10.85,9,9l91.33-30.44c2.12-.71,3.79-2.38,4.5-4.5Z',
  'M167.22,301.48v28.95c0,3.93,3.19,7.12,7.12,7.12h21.84c3.93,0,7.12-3.19,7.12-7.12v-57.91c0-3.93-3.19-7.12-7.12-7.12h-21.84c-3.93,0-7.12,3.19-7.12,7.12v28.95Z',
  'M203.29,69.01v-28.95c0-3.93-3.19-7.12-7.12-7.12h-21.84c-3.93,0-7.12,3.19-7.12,7.12v57.91c0,3.93,3.19,7.12,7.12,7.12h21.84c3.93,0,7.12-3.19,7.12-7.12v-28.95Z',
  'M32.95,196.17c0,3.93,3.19,7.12,7.12,7.12h57.9c3.93,0,7.12-3.19,7.12-7.12v-21.84c0-3.93-3.19-7.12-7.12-7.12h-57.9c-3.93,0-7.12,3.19-7.12,7.12v21.84Z',
]

function createLogoTexture(gl: Renderer['gl']) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, 512, 512)

  const pad = 20
  const available = 512 - pad * 2
  const scale = available / 370.51
  ctx.save()
  ctx.translate(pad, pad)
  ctx.scale(scale, scale)
  ctx.fillStyle = '#ffffff'
  for (const d of LILIUM_PATHS) {
    ctx.fill(new Path2D(d))
  }
  ctx.restore()

  return new Texture(gl, {
    image: canvas,
    generateMipmaps: false,
  })
}

const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const fragmentShader = `
precision mediump float;

varying vec2 vUv;

uniform float iTime;
uniform vec3  iResolution;
uniform float uScale;

uniform vec2  uGridMul;
uniform float uDigitSize;
uniform float uScanlineIntensity;
uniform float uGlitchAmount;
uniform float uFlickerAmount;
uniform float uNoiseAmp;
uniform float uChromaticAberration;
uniform float uDither;
uniform float uCurvature;
uniform vec3  uTint;
uniform vec3  uTintThreat;
uniform vec2  uMouse;
uniform float uMouseStrength;
uniform float uUseMouse;
uniform float uPageLoadProgress;
uniform float uUsePageLoadAnimation;
uniform float uBrightness;
uniform float uLightMode;
uniform sampler2D uLogo;
uniform float uUseLogo;

float time;

float hash21(vec2 p){
  p = fract(p * 234.56);
  p += dot(p, p + 34.56);
  return fract(p.x * p.y);
}

float noise(vec2 p)
{
  return sin(p.x * 10.0) * sin(p.y * (3.0 + sin(time * 0.090909))) + 0.2; 
}

mat2 rotate(float angle)
{
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c);
}

float fbm(vec2 p)
{
  p *= 1.1;
  float f = 0.0;
  float amp = 0.5 * uNoiseAmp;
  
  mat2 modify0 = rotate(time * 0.02);
  f += amp * noise(p);
  p = modify0 * p * 2.0;
  amp *= 0.454545;
  
  mat2 modify1 = rotate(time * 0.02);
  f += amp * noise(p);
  p = modify1 * p * 2.0;
  amp *= 0.454545;
  
  mat2 modify2 = rotate(time * 0.08);
  f += amp * noise(p);
  
  return f;
}

float pattern(vec2 p, out vec2 q, out vec2 r) {
  vec2 offset1 = vec2(1.0);
  vec2 offset0 = vec2(0.0);
  mat2 rot01 = rotate(0.1 * time);
  mat2 rot1 = rotate(0.1);
  
  q = vec2(fbm(p + offset1), fbm(rot01 * p + offset1));
  r = vec2(fbm(rot1 * q + offset0), fbm(q + offset0));
  return fbm(p + r);
}

/* Returns digit brightness, raw cell intensity, and logo presence mask */
float digitWithIntensity(vec2 p, out float cellIntensity, out float isLogo){
    vec2 grid = uGridMul * 15.0;
    vec2 s = floor(p * grid) / grid;
    vec2 cellUv = (s + 0.5 / grid) / uScale;
    p = p * grid;
    vec2 q, r;
    float noiseVal = pattern(s * 0.1, q, r);
    float baseNoise = noiseVal * 1.3 - 0.03;
    float intensity = baseNoise;
    isLogo = 0.0;

    if (uUseLogo > 0.5) {
        vec2 centered = cellUv - vec2(0.5);
        float aspect = iResolution.x / iResolution.y;
        if (aspect > 1.0) {
            centered.x *= aspect;
        } else {
            centered.y /= aspect;
        }
        vec2 logoCoords = centered / 0.52 + vec2(0.5);
        float logoMask = 0.0;
        if (logoCoords.x >= 0.0 && logoCoords.x <= 1.0 && logoCoords.y >= 0.0 && logoCoords.y <= 1.0) {
            logoMask = texture2D(uLogo, logoCoords).r;
        }
        
        isLogo = logoMask;
        float logoIntensity = logoMask * (0.85 + 0.35 * noiseVal);
        intensity = max(baseNoise * 0.75, logoIntensity);
    }
    
    if(uUseMouse > 0.5){
        vec2 mouseWorld = uMouse * uScale;
        float distToMouse = distance(s, mouseWorld);
        float mouseInfluence = exp(-distToMouse * 8.0) * uMouseStrength * 10.0;
        intensity += mouseInfluence;
        
        float ripple = sin(distToMouse * 20.0 - iTime * 5.0) * 0.1 * mouseInfluence;
        intensity += ripple;
    }
    
    if(uUsePageLoadAnimation > 0.5){
        float cellRandom = fract(sin(dot(s, vec2(12.9898, 78.233))) * 43758.5453);
        float cellDelay = cellRandom * 0.8;
        float cellProgress = clamp((uPageLoadProgress - cellDelay) / 0.2, 0.0, 1.0);
        
        float fadeAlpha = smoothstep(0.0, 1.0, cellProgress);
        intensity *= fadeAlpha;
    }
    
    cellIntensity = intensity;
    
    p = fract(p);
    p *= uDigitSize;
    
    float px5 = p.x * 5.0;
    float py5 = (1.0 - p.y) * 5.0;
    float x = fract(px5);
    float y = fract(py5);
    
    float i = floor(py5) - 2.0;
    float j = floor(px5) - 2.0;
    float n = i * i + j * j;
    float f = n * 0.0625;
    
    float isOn = step(0.1, intensity - f);
    float brightness = isOn * (0.2 + y * 0.8) * (0.75 + x * 0.25);
    
    return step(0.0, p.x) * step(p.x, 1.0) * step(0.0, p.y) * step(p.y, 1.0) * brightness;
}

float digit(vec2 p){
    float dummy1;
    float dummy2;
    return digitWithIntensity(p, dummy1, dummy2);
}

float onOff(float a, float b, float c)
{
  return step(c, sin(iTime + a * cos(iTime * b))) * uFlickerAmount;
}

float displace(vec2 look)
{
    float y = look.y - mod(iTime * 0.25, 1.0);
    float window = 1.0 / (1.0 + 50.0 * y * y);
    return sin(look.y * 20.0 + iTime) * 0.0125 * onOff(4.0, 2.0, 0.8) * (1.0 + cos(iTime * 60.0)) * window;
}

vec3 getColor(vec2 p){
    
    float bar = step(mod(p.y + time * 20.0, 1.0), 0.2) * 0.4 + 1.0;
    bar *= uScanlineIntensity;
    
    float displacement = displace(p);
    p.x += displacement;

    if (uGlitchAmount != 1.0) {
      float extra = displacement * (uGlitchAmount - 1.0);
      p.x += extra;
    }

    float cellIntensity;
    float isLogo;
    float middle = digitWithIntensity(p, cellIntensity, isLogo);
    
    const float off = 0.002;
    float sum = digit(p + vec2(-off, -off)) + digit(p + vec2(0.0, -off)) + digit(p + vec2(off, -off)) +
                digit(p + vec2(-off, 0.0)) + digit(p + vec2(0.0, 0.0)) + digit(p + vec2(off, 0.0)) +
                digit(p + vec2(-off, off)) + digit(p + vec2(0.0, off)) + digit(p + vec2(off, off));
    
    float luma = 0.9 * middle + sum * 0.1 * bar;
    
    /* Blend between threat (red) and protect (cyan/green) based on cell intensity for noise,
       and assign the reddish pink threat tint directly to the logo cells. */
    float t = smoothstep(0.15, 0.55, cellIntensity);
    vec3 noiseColor = mix(uTintThreat, uTint, t);
    vec3 tintColor = mix(noiseColor, uTintThreat, smoothstep(0.15, 0.5, isLogo));
    
    vec3 baseColor = vec3(luma) * tintColor;
    return baseColor;
}

vec2 barrel(vec2 uv){
  vec2 c = uv * 2.0 - 1.0;
  float r2 = dot(c, c);
  c *= 1.0 + uCurvature * r2;
  return c * 0.5 + 0.5;
}

void main() {
    time = iTime * 0.333333;
    vec2 uv = vUv;

    if(uCurvature != 0.0){
      uv = barrel(uv);
    }
    
    vec2 p = uv * uScale;
    vec3 col = getColor(p);

    if(uChromaticAberration != 0.0){
      vec2 ca = vec2(uChromaticAberration) / iResolution.xy;
      col.r = getColor(p + ca).r;
      col.b = getColor(p - ca).b;
    }

    col *= uBrightness;

    if(uDither > 0.0){
      float rnd = hash21(gl_FragCoord.xy);
      col += (rnd - 0.5) * (uDither * 0.003922);
    }

    if (uLightMode > 0.5) {
      float energy = max(max(col.r, col.g), col.b);
      float coverage = clamp(smoothstep(0.0, 0.72, energy) * 0.9, 0.0, 0.9);
      vec3 ink = clamp(col * 0.42, 0.0, 0.76);
      gl_FragColor = vec4(ink, coverage);
    } else {
      gl_FragColor = vec4(col, 1.0);
    }
}
`

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace('#', '').trim()
  if (h.length === 3)
    h = h
      .split('')
      .map((c: string) => c + c)
      .join('')
  const num = parseInt(h.slice(0, 6), 16)
  return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255]
}

interface FaultyTerminalProps {
  scale?: number
  gridMul?: [number, number]
  digitSize?: number
  timeScale?: number
  pause?: boolean
  scanlineIntensity?: number
  glitchAmount?: number
  flickerAmount?: number
  noiseAmp?: number
  chromaticAberration?: number
  dither?: number | boolean
  curvature?: number
  tint?: string
  tintThreat?: string
  mouseReact?: boolean
  mouseStrength?: number
  dpr?: number
  pageLoadAnimation?: boolean
  brightness?: number
  lightMode?: boolean
  useLogo?: boolean
  className?: string
  style?: React.CSSProperties
}

export default function FaultyTerminal({
  scale = 1,
  gridMul = [2, 1],
  digitSize = 1.5,
  timeScale = 0.3,
  pause = false,
  scanlineIntensity = 0.3,
  glitchAmount = 0.2,
  flickerAmount = 0.1,
  noiseAmp = 1,
  chromaticAberration = 0,
  dither = 0,
  curvature = 0,
  tint = '#ffffff',
  tintThreat = '#ff1a1a',
  mouseReact = true,
  mouseStrength = 0.2,
  dpr = Math.min(window.devicePixelRatio || 1, 2),
  pageLoadAnimation = true,
  brightness = 3,
  lightMode = true,
  useLogo = true,
  className,
  style,
}: FaultyTerminalProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 })
  const frozenTimeRef = useRef(0)
  const rafRef = useRef(0)
  const loadAnimationStartRef = useRef(0)
  const timeOffsetRef = useRef(Math.random() * 100)

  // Stable serialised key to avoid object-identity churn on gridMul
  const gridMulX = gridMul[0]
  const gridMulY = gridMul[1]

  const tintVec = useMemo(() => hexToRgb(tint), [tint])
  const tintThreatVec = useMemo(() => hexToRgb(tintThreat), [tintThreat])
  const ditherValue = useMemo(
    () => (typeof dither === 'boolean' ? (dither ? 1 : 0) : dither),
    [dither]
  )

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const ctn = containerRef.current
    if (!ctn) return
    const rect = ctn.getBoundingClientRect()
    mouseRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: 1 - (e.clientY - rect.top) / rect.height,
    }
  }, [])

  useEffect(() => {
    const ctn = containerRef.current
    if (!ctn) return

    let renderer: Renderer | null = null
    let gl: Renderer['gl'] | null = null
    let canvas: HTMLCanvasElement | null = null
    let isContextLost = false

    try {
      renderer = new Renderer({ dpr, alpha: true })
      gl = renderer.gl
    } catch {
      // Fallback if WebGL is unavailable
    }

    if (!renderer || !gl) {
      // Render animated 2D phosphor canvas fallback
      const fallbackCanvas = document.createElement('canvas')
      fallbackCanvas.style.display = 'block'
      fallbackCanvas.style.width = '100%'
      fallbackCanvas.style.height = '100%'
      fallbackCanvas.style.position = 'absolute'
      fallbackCanvas.style.top = '0'
      fallbackCanvas.style.left = '0'
      ctn.appendChild(fallbackCanvas)

      const ctx = fallbackCanvas.getContext('2d')
      let frameId = 0
      const resizeFallback = () => {
        if (!ctn || !ctx) return
        fallbackCanvas.width = ctn.offsetWidth
        fallbackCanvas.height = ctn.offsetHeight
      }
      const roFb = new ResizeObserver(() => resizeFallback())
      roFb.observe(ctn)
      resizeFallback()

      let fbTime = 0
      const drawFallback = () => {
        frameId = requestAnimationFrame(drawFallback)
        if (!ctx) return
        fbTime += 0.03 * timeScale
        const w = fallbackCanvas.width
        const h = fallbackCanvas.height
        if (w === 0 || h === 0) return

        if (lightMode) {
          ctx.clearRect(0, 0, w, h)
        } else {
          ctx.fillStyle = '#08090d'
          ctx.fillRect(0, 0, w, h)
        }

        ctx.font = '10px monospace'
        ctx.fillStyle = tint
        ctx.globalAlpha = 0.4
        const chars = '0123456789ABCDEF'
        const cols = Math.floor(w / 18)
        const rows = Math.floor(h / 14)

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const ch =
              chars[Math.floor(Math.abs(Math.sin(r * 3 + c * 7 + fbTime) * 16)) % chars.length]
            ctx.fillText(ch, c * 18 + 4, r * 14 + 10)
          }
        }
        ctx.globalAlpha = 1.0
      }
      frameId = requestAnimationFrame(drawFallback)

      return () => {
        cancelAnimationFrame(frameId)
        roFb.disconnect()
        if (fallbackCanvas.parentElement === ctn) ctn.removeChild(fallbackCanvas)
      }
    }

    gl.clearColor(0, 0, 0, 0)

    // Make the canvas fill its parent container
    canvas = gl.canvas as HTMLCanvasElement
    canvas.style.display = 'block'
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.style.position = 'absolute'
    canvas.style.top = '0'
    canvas.style.left = '0'

    const handleContextLost = (e: Event) => {
      e.preventDefault()
      isContextLost = true
      cancelAnimationFrame(rafRef.current)
    }

    const handleContextRestored = () => {
      isContextLost = false
      rafRef.current = requestAnimationFrame(update)
    }

    canvas.addEventListener('webglcontextlost', handleContextLost, false)
    canvas.addEventListener('webglcontextrestored', handleContextRestored, false)

    const geometry = new Triangle(gl)
    const logoTexture = createLogoTexture(gl)

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: {
          value: new Color(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height),
        },
        uScale: { value: scale },
        uGridMul: { value: new Float32Array([gridMulX, gridMulY]) },
        uDigitSize: { value: digitSize },
        uScanlineIntensity: { value: scanlineIntensity },
        uGlitchAmount: { value: glitchAmount },
        uFlickerAmount: { value: flickerAmount },
        uNoiseAmp: { value: noiseAmp },
        uChromaticAberration: { value: chromaticAberration },
        uDither: { value: ditherValue },
        uCurvature: { value: curvature },
        uTint: { value: new Color(tintVec[0], tintVec[1], tintVec[2]) },
        uTintThreat: { value: new Color(tintThreatVec[0], tintThreatVec[1], tintThreatVec[2]) },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
        uMouseStrength: { value: mouseStrength },
        uUseMouse: { value: mouseReact ? 1 : 0 },
        uPageLoadProgress: { value: pageLoadAnimation ? 0 : 1 },
        uUsePageLoadAnimation: { value: pageLoadAnimation ? 1 : 0 },
        uBrightness: { value: brightness },
        uLightMode: { value: lightMode ? 1 : 0 },
        uUseLogo: { value: useLogo ? 1 : 0 },
        uLogo: { value: logoTexture || new Texture(gl) },
      },
    })

    const mesh = new Mesh(gl, { geometry, program })

    // ── Resize ────────────────────────────────────────────
    function resize() {
      if (!ctn || !renderer || !gl || isContextLost) return
      const w = ctn.offsetWidth
      const h = ctn.offsetHeight
      if (w === 0 || h === 0) return
      renderer.setSize(w, h)
      program.uniforms.iResolution.value = new Color(
        gl.canvas.width,
        gl.canvas.height,
        gl.canvas.width / gl.canvas.height
      )
    }

    const ro = new ResizeObserver(() => resize())
    ro.observe(ctn)
    resize()

    ctn.appendChild(canvas)

    // ── Animation loop ────────────────────────────────────
    const update = (t: number) => {
      rafRef.current = requestAnimationFrame(update)
      if (isContextLost || !gl || gl.isContextLost()) return

      if (pageLoadAnimation && loadAnimationStartRef.current === 0) {
        loadAnimationStartRef.current = t
      }

      if (!pause) {
        const elapsed = (t * 0.001 + timeOffsetRef.current) * timeScale
        program.uniforms.iTime.value = elapsed
        frozenTimeRef.current = elapsed
      } else {
        program.uniforms.iTime.value = frozenTimeRef.current
      }

      if (pageLoadAnimation && loadAnimationStartRef.current > 0) {
        const progress = Math.min((t - loadAnimationStartRef.current) / 2000, 1)
        program.uniforms.uPageLoadProgress.value = progress
      }

      if (mouseReact) {
        const sm = smoothMouseRef.current
        const m = mouseRef.current
        sm.x += (m.x - sm.x) * 0.08
        sm.y += (m.y - sm.y) * 0.08
        const mu = program.uniforms.uMouse.value as Float32Array
        mu[0] = sm.x
        mu[1] = sm.y
      }

      try {
        renderer.render({ scene: mesh })
      } catch {
        // Guard against render errors if context was evicted
      }
    }

    rafRef.current = requestAnimationFrame(update)

    if (mouseReact) ctn.addEventListener('mousemove', handleMouseMove)

    // ── Cleanup ───────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
      if (canvas) {
        canvas.removeEventListener('webglcontextlost', handleContextLost)
        canvas.removeEventListener('webglcontextrestored', handleContextRestored)
      }
      if (mouseReact) ctn.removeEventListener('mousemove', handleMouseMove)
      if (canvas && canvas.parentElement === ctn) ctn.removeChild(canvas)
      if (logoTexture?.texture && gl) {
        try {
          gl.deleteTexture(logoTexture.texture)
        } catch {}
      }
      if (gl) gl.getExtension('WEBGL_lose_context')?.loseContext()
      loadAnimationStartRef.current = 0
      timeOffsetRef.current = Math.random() * 100
    }
  }, [
    dpr,
    lightMode,
    scale,
    gridMulX,
    gridMulY,
    digitSize,
    scanlineIntensity,
    glitchAmount,
    flickerAmount,
    noiseAmp,
    chromaticAberration,
    ditherValue,
    curvature,
    tintVec,
    tintThreatVec,
    mouseStrength,
    mouseReact,
    pageLoadAnimation,
    brightness,
    pause,
    timeScale,
    useLogo,
    handleMouseMove,
  ])

  return (
    <div
      ref={containerRef}
      className={`faulty-terminal-container${className ? ` ${className}` : ''}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: lightMode ? '#ffffff' : '#08090d',
        ...style,
      }}
    />
  )
}
