// Client-side probes. Every one of these runs with zero permission prompts
// unless it lives in the "gated" section at the bottom.
// Nothing here is transmitted anywhere — it is computed and rendered locally.

const FONT_PROBES = [
  'Arial', 'Arial Black', 'Bahnschrift', 'Calibri', 'Cambria', 'Candara', 'Comic Sans MS',
  'Consolas', 'Constantia', 'Corbel', 'Courier New', 'Ebrima', 'Franklin Gothic', 'Gabriola',
  'Gadugi', 'Georgia', 'Impact', 'Ink Free', 'Leelawadee UI', 'Lucida Console', 'Malgun Gothic',
  'Marlett', 'MS Gothic', 'MV Boli', 'Nirmala UI', 'Palatino Linotype', 'Segoe UI', 'SimSun',
  'Sylfaen', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana', 'Webdings', 'Wingdings',
  'Yu Gothic', 'Helvetica', 'Helvetica Neue', 'Menlo', 'Monaco', 'Geneva', 'Optima', 'Futura',
  'Baskerville', 'Zapfino', 'American Typewriter', 'Andale Mono', 'Apple Chancery', 'Chalkboard',
  'Cochin', 'Copperplate', 'Courier', 'Didot', 'Hoefler Text', 'Papyrus', 'Skia', 'Ubuntu',
  'Cantarell', 'DejaVu Sans', 'Liberation Sans', 'Noto Sans', 'Roboto', 'Oxygen', 'FreeSans'
]

// hostname fragment -> who it is and what it takes
const TRACKERS = [
  ['google-analytics.com', 'Google Analytics 4', 'Google', 'Page views, events, referrer, device, coarse location, and a persistent client ID.'],
  ['analytics.google.com', 'Google Analytics 4', 'Google', 'Server-side collection endpoint for GA4.'],
  ['googletagmanager.com', 'Google Tag Manager', 'Google', 'Loader that can inject any number of additional trackers without a code change.'],
  ['connect.facebook.net', 'Meta Pixel', 'Meta', 'Page views and conversions, tied to a browser ID Meta joins with your Facebook/Instagram account.'],
  ['facebook.com/tr', 'Meta Pixel beacon', 'Meta', 'The actual event ping. Fires on load and on every tracked action.'],
  ['doubleclick.net', 'Google Ads / DoubleClick', 'Google', 'Ad targeting and retargeting across the display network.'],
  ['googlesyndication.com', 'Google AdSense', 'Google', 'Ad serving and audience measurement.'],
  ['googleadservices.com', 'Google Ads conversions', 'Google', 'Conversion attribution for paid search.'],
  ['google.com/ads', 'Google Ads', 'Google', 'Remarketing tag.'],
  ['fonts.googleapis.com', 'Google Fonts', 'Google', 'Stylesheet request — leaks your IP, user agent, and referring page to Google.'],
  ['fonts.gstatic.com', 'Google Fonts (files)', 'Google', 'Font file delivery — same IP and referrer leak.'],
  ['matomo', 'Matomo Analytics', 'self-hosted', 'Full analytics suite, but the data stays on the operator’s own server.'],
  ['hotjar', 'Hotjar', 'Hotjar', 'Session replay — records mouse movement, scrolling, and clicks as playable video.'],
  ['clarity.ms', 'Microsoft Clarity', 'Microsoft', 'Session replay and heatmaps.'],
  ['fullstory', 'FullStory', 'FullStory', 'Session replay and DOM capture.'],
  ['segment.', 'Segment', 'Twilio', 'Customer data pipeline — fans your events out to dozens of downstream tools.'],
  ['hubspot', 'HubSpot', 'HubSpot', 'CRM tracking — ties anonymous page views to a contact record once you submit any form.'],
  ['hs-scripts', 'HubSpot', 'HubSpot', 'CRM tracking script.'],
  ['linkedin.com', 'LinkedIn Insight', 'Microsoft', 'B2B audience matching against LinkedIn profiles and employers.'],
  ['licdn.com', 'LinkedIn Insight', 'Microsoft', 'B2B audience matching.'],
  ['tiktok', 'TikTok Pixel', 'ByteDance', 'Conversion tracking and audience building.'],
  ['bing.com', 'Microsoft Advertising', 'Microsoft', 'Conversion tracking.'],
  ['cloudflareinsights', 'Cloudflare Analytics', 'Cloudflare', 'Privacy-oriented page performance metrics.'],
  ['sentry', 'Sentry', 'Sentry', 'Error monitoring — captures URLs and, if misconfigured, form contents.']
]

const COOKIE_DECODER = [
  [/^_ga$/, 'Google Analytics client ID. This is the number that follows you across every GA4 site.'],
  [/^_ga_/, 'Google Analytics session state for a specific property.'],
  [/^_gid$/, 'Google Analytics 24-hour visitor ID.'],
  [/^_gcl_/, 'Google Ads conversion linker — bridges an ad click to a conversion on this site.'],
  [/^_fbp$/, 'Meta browser ID. Meta uses this to join your activity here with your Facebook account.'],
  [/^_fbc$/, 'Meta click ID — proof you arrived from a Facebook or Instagram ad.'],
  [/^_pk_id/, 'Matomo visitor ID.'],
  [/^_pk_ses/, 'Matomo session marker.'],
  [/^_hj/, 'Hotjar session-replay identifier.'],
  [/^hubspotutk$/, 'HubSpot visitor token — becomes your identity the moment you fill out a form.'],
  [/^__hs/, 'HubSpot analytics state.'],
  [/^_clck|^_clsk/, 'Microsoft Clarity session-replay identifier.'],
  [/^_uet/, 'Microsoft Advertising tag.'],
  [/^__cf/, 'Cloudflare bot-management token.'],
  [/^sb_/, 'This page’s own return-visit counter. Local only — see the note at the bottom.']
]

/* ---------------------------------------------------------------- helpers */

export async function sha256Hex(str) {
  try {
    const buf = new TextEncoder().encode(str)
    const digest = await crypto.subtle.digest('SHA-256', buf)
    return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('')
  } catch {
    // Non-secure context (plain http): fall back to a cheap non-crypto hash.
    let h = 0x811c9dc5
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i)
      h = Math.imul(h, 0x01000193) >>> 0
    }
    return h.toString(16).padStart(8, '0').repeat(4)
  }
}

const safe = (fn, fallback = null) => { try { const v = fn(); return v === undefined ? fallback : v } catch { return fallback } }
const safeAsync = async (fn, fallback = null) => { try { const v = await fn(); return v === undefined ? fallback : v } catch { return fallback } }

export function describeCookie(name) {
  for (const [re, note] of COOKIE_DECODER) if (re.test(name)) return note
  return null
}

/* ------------------------------------------------------------ fingerprint */

function canvasFingerprint() {
  const c = document.createElement('canvas')
  c.width = 300; c.height = 70
  const ctx = c.getContext('2d')
  ctx.textBaseline = 'top'
  ctx.font = '16px "Arial"'
  ctx.fillStyle = '#f60'
  ctx.fillRect(0, 0, 300, 22)
  ctx.fillStyle = '#069'
  ctx.fillText('Who am I? \u{1F5FA}\u{FE0F} 0123456789', 2, 2)
  ctx.fillStyle = 'rgba(102, 204, 0, 0.7)'
  ctx.fillText('Who am I? \u{1F5FA}\u{FE0F} 0123456789', 4, 25)
  ctx.globalCompositeOperation = 'multiply'
  for (const [color, x] of [['#f2f', 50], ['#2ff', 100], ['#ff2', 75]]) {
    ctx.fillStyle = color
    ctx.beginPath(); ctx.arc(x, 50, 40, 0, Math.PI * 2, true); ctx.closePath(); ctx.fill()
  }
  return { data: c.toDataURL(), image: c.toDataURL() }
}

function webglInfo() {
  const c = document.createElement('canvas')
  const gl = c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl')
  if (!gl) return null
  const dbg = gl.getExtension('WEBGL_debug_renderer_info')
  const vendor = dbg ? gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR)
  const renderer = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)
  const params = [
    gl.getParameter(gl.MAX_TEXTURE_SIZE),
    gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
    gl.getParameter(gl.MAX_VIEWPORT_DIMS)?.join?.('x'),
    gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
    gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
    gl.getParameter(gl.VERSION),
    (gl.getSupportedExtensions() || []).join(',')
  ].join('|')
  return { vendor, renderer, params, extensionCount: (gl.getSupportedExtensions() || []).length }
}

async function audioFingerprint() {
  const Ctx = window.OfflineAudioContext || window.webkitOfflineAudioContext
  if (!Ctx) return null
  const ctx = new Ctx(1, 44100, 44100)
  const osc = ctx.createOscillator()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(10000, ctx.currentTime)
  const comp = ctx.createDynamicsCompressor()
  comp.threshold.setValueAtTime(-50, ctx.currentTime)
  comp.knee.setValueAtTime(40, ctx.currentTime)
  comp.ratio.setValueAtTime(12, ctx.currentTime)
  comp.attack.setValueAtTime(0, ctx.currentTime)
  comp.release.setValueAtTime(0.25, ctx.currentTime)
  osc.connect(comp); comp.connect(ctx.destination)
  osc.start(0)
  const buf = await ctx.startRendering()
  const ch = buf.getChannelData(0)
  let sum = 0
  for (let i = 4500; i < 5000; i++) sum += Math.abs(ch[i])
  return sum.toString()
}

function detectFonts() {
  const ctx = document.createElement('canvas').getContext('2d')
  if (!ctx) return []
  const test = 'mmmmmmmmmmlliWWWWWWWWWW'
  const bases = ['monospace', 'sans-serif', 'serif']
  const baseline = {}
  for (const b of bases) { ctx.font = `72px ${b}`; baseline[b] = ctx.measureText(test).width }
  const found = []
  for (const f of FONT_PROBES) {
    for (const b of bases) {
      ctx.font = `72px "${f}", ${b}`
      if (ctx.measureText(test).width !== baseline[b]) { found.push(f); break }
    }
  }
  return found
}

/* --------------------------------------------------------- the big collect */

export async function collectStatic() {
  const n = navigator
  const out = {}

  // --- identity of the software
  const uaData = await safeAsync(() =>
    n.userAgentData?.getHighEntropyValues([
      'architecture', 'bitness', 'model', 'platformVersion', 'uaFullVersion', 'fullVersionList', 'wow64'
    ]))

  out.browser = {
    userAgent: n.userAgent,
    brands: uaData?.fullVersionList?.map(b => `${b.brand} ${b.version}`).join(', ') || safe(() => n.userAgentData?.brands?.map(b => `${b.brand} ${b.version}`).join(', ')),
    platform: uaData?.platform || n.platform,
    platformVersion: uaData?.platformVersion || null,
    architecture: uaData ? [uaData.architecture, uaData.bitness && uaData.bitness + '-bit'].filter(Boolean).join(' ') : null,
    model: uaData?.model || null,
    mobile: safe(() => n.userAgentData?.mobile),
    languages: (n.languages || [n.language]).join(', '),
    language: n.language,
    cookieEnabled: n.cookieEnabled,
    doNotTrack: n.doNotTrack ?? window.doNotTrack ?? null,
    globalPrivacyControl: safe(() => n.globalPrivacyControl, null),
    pdfViewerEnabled: safe(() => n.pdfViewerEnabled),
    webdriver: safe(() => n.webdriver),
    plugins: safe(() => Array.from(n.plugins).map(p => p.name), []),
    vendor: n.vendor || null,
    referrer: document.referrer || null,
    url: location.href
  }

  // --- the physical machine
  out.screen = {
    resolution: `${screen.width} × ${screen.height}`,
    available: `${screen.availWidth} × ${screen.availHeight}`,
    physical: `${Math.round(screen.width * devicePixelRatio)} × ${Math.round(screen.height * devicePixelRatio)}`,
    pixelRatio: devicePixelRatio,
    colorDepth: `${screen.colorDepth}-bit`,
    orientation: safe(() => screen.orientation?.type),
    multipleMonitors: safe(() => screen.isExtended, null),
    viewport: `${innerWidth} × ${innerHeight}`,
    hdr: safe(() => matchMedia('(dynamic-range: high)').matches),
    colorGamut: ['rec2020', 'p3', 'srgb'].find(g => safe(() => matchMedia(`(color-gamut: ${g})`).matches)) || null
  }

  out.hardware = {
    cpuCores: n.hardwareConcurrency ?? null,
    deviceMemory: n.deviceMemory ? `${n.deviceMemory} GB or more` : null,
    maxTouchPoints: n.maxTouchPoints ?? 0,
    pointer: safe(() => matchMedia('(pointer: fine)').matches ? 'fine (mouse or trackpad)' : matchMedia('(pointer: coarse)').matches ? 'coarse (touch)' : 'none'),
    hover: safe(() => matchMedia('(hover: hover)').matches ? 'yes' : 'no'),
    gamepads: safe(() => (n.getGamepads?.() || []).filter(Boolean).length, 0),
    bluetooth: 'bluetooth' in n,
    usb: 'usb' in n,
    serial: 'serial' in n,
    hid: 'hid' in n
  }

  const battery = await safeAsync(() => n.getBattery?.())
  out.battery = battery ? {
    level: `${Math.round(battery.level * 100)}%`,
    charging: battery.charging ? 'plugged in' : 'on battery',
    timeRemaining: Number.isFinite(battery.dischargingTime) && battery.dischargingTime > 0
      ? `${Math.round(battery.dischargingTime / 60)} min left` : null
  } : null

  const conn = n.connection || n.mozConnection || n.webkitConnection
  out.network = conn ? {
    effectiveType: conn.effectiveType,
    downlink: conn.downlink ? `${conn.downlink} Mbps (estimated)` : null,
    rtt: conn.rtt ? `${conn.rtt} ms round trip` : null,
    saveData: conn.saveData ? 'data saver is ON' : 'data saver off',
    type: conn.type || null
  } : null

  // --- locale and settings
  const dt = safe(() => Intl.DateTimeFormat().resolvedOptions(), {})
  out.locale = {
    timeZone: dt.timeZone || null,
    utcOffset: `UTC${new Date().getTimezoneOffset() > 0 ? '-' : '+'}${Math.abs(new Date().getTimezoneOffset() / 60)}`,
    locale: dt.locale || null,
    calendar: dt.calendar || null,
    numberingSystem: dt.numberingSystem || null,
    hourCycle: dt.hourCycle || null,
    currency: safe(() => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).resolvedOptions().currency),
    clock: new Date().toString()
  }

  out.prefs = {
    colorScheme: safe(() => matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
    reducedMotion: safe(() => matchMedia('(prefers-reduced-motion: reduce)').matches ? 'reduced motion requested' : 'no preference'),
    reducedTransparency: safe(() => matchMedia('(prefers-reduced-transparency: reduce)').matches ? 'yes' : 'no'),
    contrast: safe(() => matchMedia('(prefers-contrast: more)').matches ? 'more contrast requested' : matchMedia('(prefers-contrast: less)').matches ? 'less contrast' : 'no preference'),
    forcedColors: safe(() => matchMedia('(forced-colors: active)').matches ? 'high-contrast mode ON' : 'off'),
    invertedColors: safe(() => matchMedia('(inverted-colors: inverted)').matches ? 'yes' : 'no')
  }

  // --- devices and capabilities
  const devices = await safeAsync(() => n.mediaDevices?.enumerateDevices(), [])
  out.devices = {
    cameras: (devices || []).filter(d => d.kind === 'videoinput').length,
    microphones: (devices || []).filter(d => d.kind === 'audioinput').length,
    speakers: (devices || []).filter(d => d.kind === 'audiooutput').length,
    labelsVisible: (devices || []).some(d => d.label)
  }

  out.drm = {}
  for (const [key, label] of [['com.widevine.alpha', 'Widevine'], ['com.microsoft.playready', 'PlayReady'], ['com.apple.fps', 'FairPlay'], ['org.w3.clearkey', 'ClearKey']]) {
    out.drm[label] = await safeAsync(async () => {
      await n.requestMediaKeySystemAccess(key, [{
        initDataTypes: ['cenc'],
        videoCapabilities: [{ contentType: 'video/mp4;codecs="avc1.42E01E"' }]
      }])
      return true
    }, false)
  }

  const est = await safeAsync(() => n.storage?.estimate())
  out.storageQuota = est ? {
    quota: `${(est.quota / 1024 / 1024 / 1024).toFixed(2)} GB available to this site`,
    usage: `${(est.usage / 1024).toFixed(1)} KB currently used`,
    persisted: await safeAsync(() => n.storage?.persisted?.(), false)
  } : null

  // --- permissions already granted, checked without prompting
  out.permissions = {}
  const names = ['geolocation', 'notifications', 'camera', 'microphone', 'clipboard-read', 'persistent-storage', 'midi', 'background-sync', 'accelerometer', 'local-fonts']
  for (const name of names) {
    const state = await safeAsync(async () => (await n.permissions.query({ name })).state)
    if (state) out.permissions[name] = state
  }

  out.voices = safe(() => {
    const v = speechSynthesis.getVoices()
    return v.length ? { count: v.length, sample: v.slice(0, 4).map(x => x.name).join(', ') } : null
  })

  // --- the fingerprint
  const canvas = safe(() => canvasFingerprint())
  const gl = safe(() => webglInfo())
  const audio = await safeAsync(() => audioFingerprint())
  const fonts = safe(() => detectFonts(), [])

  out.fingerprint = {
    canvasHash: canvas ? (await sha256Hex(canvas.data)).slice(0, 32) : null,
    canvasImage: canvas?.image || null,
    webglVendor: gl?.vendor || null,
    webglRenderer: gl?.renderer || null,
    webglHash: gl ? (await sha256Hex(gl.params)).slice(0, 32) : null,
    webglExtensions: gl?.extensionCount ?? null,
    audioHash: audio ? (await sha256Hex(audio)).slice(0, 32) : null,
    fonts,
    fontCount: fonts.length,
    fontsProbed: FONT_PROBES.length
  }

  // Stable inputs only — nothing that changes between page loads.
  const stable = [
    out.browser.userAgent, out.browser.languages, out.browser.platform,
    out.screen.resolution, out.screen.colorDepth, out.screen.pixelRatio,
    out.hardware.cpuCores, out.hardware.deviceMemory, out.hardware.maxTouchPoints,
    out.locale.timeZone, out.fingerprint.canvasHash, out.fingerprint.webglRenderer,
    out.fingerprint.webglHash, out.fingerprint.audioHash, fonts.join(',')
  ].join('~')
  out.fingerprint.composite = await sha256Hex(stable)

  // Rough entropy accounting. Only signals we actually got are counted, so a
  // browser that blocks canvas/WebGL genuinely scores lower here.
  const bits = [
    [out.browser.userAgent, 6], [out.browser.languages, 3], [out.locale.timeZone, 4],
    [out.screen.resolution, 4], [out.screen.pixelRatio, 1], [out.hardware.cpuCores, 2],
    [out.hardware.deviceMemory, 1], [out.fingerprint.canvasHash, 8],
    [out.fingerprint.webglRenderer, 6], [out.fingerprint.audioHash, 5],
    [fonts.length ? fonts : null, 8]
  ].reduce((sum, [v, b]) => sum + (v ? b : 0), 0)
  out.fingerprint.bits = bits

  return out
}

/* --------------------------------------------------- live / re-readable  */

export function readCookies() {
  if (!document.cookie) return []
  return document.cookie.split(';').map(c => {
    const i = c.indexOf('=')
    const name = c.slice(0, i).trim()
    const value = c.slice(i + 1).trim()
    return { name, value, note: describeCookie(name) }
  }).filter(c => c.name)
}

export function readStorage() {
  const grab = (store) => safe(() => Object.keys(store).map(k => ({
    key: k,
    size: `${(store.getItem(k) || '').length} bytes`
  })), [])
  return { local: grab(localStorage), session: grab(sessionStorage) }
}

export async function readIndexedDb() {
  return await safeAsync(async () => (await indexedDB.databases()).map(d => d.name).filter(Boolean), [])
}

export function scanTrackers() {
  const entries = safe(() => performance.getEntriesByType('resource'), []) || []
  const hits = new Map()
  for (const e of entries) {
    for (const [frag, name, owner, collects] of TRACKERS) {
      if (!e.name.includes(frag)) continue
      const key = name
      const prev = hits.get(key) || { name, owner, collects, requests: 0, bytes: 0, host: safe(() => new URL(e.name).hostname, frag) }
      prev.requests++
      prev.bytes += e.transferSize || 0
      hits.set(key, prev)
    }
  }
  return [...hits.values()].sort((a, b) => b.requests - a.requests)
}

export async function detectBlocker() {
  // Two independent signals: a bait element, and a bait network request.
  const bait = document.createElement('div')
  bait.className = 'pub_300x250 pub_300x250m text-ad textAd text_ad ad-banner ads adsbox doubleclick ad-placement carbon-ads'
  bait.style.cssText = 'position:absolute;left:-9999px;top:-9999px;width:300px;height:250px;'
  document.body.appendChild(bait)
  await new Promise(r => setTimeout(r, 120))
  const elementBlocked = bait.offsetHeight === 0 || bait.offsetParent === null ||
    getComputedStyle(bait).display === 'none'
  bait.remove()

  // Second signal: an ad-shaped URL on our OWN origin. Filter lists match generic
  // path patterns, so a blocker refuses this outright. Nothing third-party is
  // contacted. It 404s, which is fine — fetch still resolves, and that is the tell.
  const netBlocked = await safeAsync(async () => {
    await fetch('/ads/adserver/banner-ad.js?ad_box_=1', { cache: 'no-store' })
    return false
  }, true)

  // Reported separately, never used to infer blocking: these load asynchronously,
  // so "not there yet" and "blocked" are indistinguishable early on.
  const analyticsLoaded = Array.isArray(window.dataLayer)
  const pixelLoaded = typeof window.fbq === 'function' && !!window.fbq.callMethod

  return {
    elementBlocked,
    netBlocked,
    analyticsLoaded,
    pixelLoaded,
    knownTrackers: scanTrackers().length,
    blocking: elementBlocked || netBlocked
  }
}

/* -------------------------------------------- return-visitor demonstration */

export function trackReturnVisit(fingerprint) {
  return safe(() => {
    const KEY = 'sb_whoami_visits'
    const prev = JSON.parse(localStorage.getItem(KEY) || 'null')
    const now = new Date().toISOString()
    const record = prev && prev.fp === fingerprint
      ? { fp: fingerprint, first: prev.first, last: now, count: (prev.count || 1) + 1 }
      : { fp: fingerprint, first: prev?.first || now, last: now, count: (prev?.count || 0) + 1, fpChanged: !!prev && prev.fp !== fingerprint }
    localStorage.setItem(KEY, JSON.stringify(record))
    return { ...record, isReturning: !!prev }
  }, null)
}

export function forgetMe() {
  return safe(() => {
    localStorage.removeItem('sb_whoami_visits')
    return true
  }, false)
}

/* ------------------------------------------------ behavioral, live-updating */

export function useBehavior() {
  const state = reactive({
    seconds: 0, mouseMoves: 0, mousePixels: 0, clicks: 0, keys: 0,
    scrollDepth: 0, tabSwitches: 0, copies: 0, selections: 0, idleSeconds: 0
  })

  let last = null, lastActivity = Date.now(), timer = null
  const cleanup = []
  const on = (target, ev, fn, opts) => {
    target.addEventListener(ev, fn, opts)
    cleanup.push(() => target.removeEventListener(ev, fn, opts))
  }

  onMounted(() => {
    const start = Date.now()
    timer = setInterval(() => {
      state.seconds = Math.floor((Date.now() - start) / 1000)
      state.idleSeconds = Math.floor((Date.now() - lastActivity) / 1000)
    }, 1000)

    on(window, 'mousemove', (e) => {
      state.mouseMoves++
      if (last) state.mousePixels += Math.round(Math.hypot(e.clientX - last.x, e.clientY - last.y))
      last = { x: e.clientX, y: e.clientY }
      lastActivity = Date.now()
    }, { passive: true })

    on(window, 'click', () => { state.clicks++; lastActivity = Date.now() })
    // Count only. The key itself is never read, stored, or transmitted.
    on(window, 'keydown', () => { state.keys++; lastActivity = Date.now() })
    on(window, 'scroll', () => {
      const max = document.documentElement.scrollHeight - innerHeight
      if (max > 0) state.scrollDepth = Math.max(state.scrollDepth, Math.min(100, Math.round((scrollY / max) * 100)))
      lastActivity = Date.now()
    }, { passive: true })
    on(document, 'visibilitychange', () => { if (document.hidden) state.tabSwitches++ })
    on(document, 'copy', () => state.copies++)
    on(document, 'selectionchange', () => {
      if (safe(() => String(getSelection()).length, 0) > 0) state.selections++
    })
  })

  onBeforeUnmount(() => {
    clearInterval(timer)
    cleanup.forEach(fn => fn())
  })

  return state
}

/* ------------------------------------------------------ permission-gated  */

export function askLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve({ error: 'Geolocation API not available.' })
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({
        lat: p.coords.latitude, lon: p.coords.longitude,
        accuracy: `± ${Math.round(p.coords.accuracy)} meters`,
        altitude: p.coords.altitude != null ? `${Math.round(p.coords.altitude)} m` : null,
        heading: p.coords.heading, speed: p.coords.speed
      }),
      (e) => resolve({ error: e.message || 'Permission denied.' }),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  })
}

export async function askDeviceLabels() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    const devices = await navigator.mediaDevices.enumerateDevices()
    stream.getTracks().forEach(t => t.stop())   // released immediately
    return devices.filter(d => d.label).map(d => ({ kind: d.kind, label: d.label }))
  } catch (e) {
    return { error: e?.message || 'Permission denied.' }
  }
}

export async function inspectClipboard() {
  // Deliberately reports the SHAPE of the clipboard, never the contents —
  // people keep passwords in there.
  try {
    const text = await navigator.clipboard.readText()
    if (!text) return { empty: true }
    const shape = /^https?:\/\//i.test(text) ? 'a URL'
      : /^[\w.+-]+@[\w-]+\.[\w.]+$/.test(text.trim()) ? 'an email address'
      : /^[\d\s()+-]{7,}$/.test(text.trim()) ? 'a phone number'
      : /^[\d.,$\s]+$/.test(text.trim()) ? 'a number or dollar amount'
      : text.includes('\n') ? 'multiple lines of text'
      : 'a line of text'
    return {
      length: text.length,
      shape,
      preview: text.slice(0, 3).replace(/./g, '•') + '…'
    }
  } catch (e) {
    return { error: e?.message || 'Permission denied.' }
  }
}

export function probeLocalNetwork() {
  return new Promise((resolve) => {
    const found = new Set()
    let pc
    try {
      pc = new RTCPeerConnection({ iceServers: [] })
    } catch {
      return resolve({ error: 'WebRTC unavailable.' })
    }
    pc.createDataChannel('probe')
    pc.onicecandidate = (e) => {
      if (!e.candidate) return
      const m = e.candidate.candidate.match(/([0-9a-f]{1,4}(:[0-9a-f]{1,4}){7}|(\d{1,3}\.){3}\d{1,3}|[\w-]+\.local)/i)
      if (m) found.add(m[0])
    }
    pc.createOffer().then(o => pc.setLocalDescription(o)).catch(() => {})
    setTimeout(() => {
      try { pc.close() } catch {}
      resolve({ candidates: [...found] })
    }, 2000)
  })
}
