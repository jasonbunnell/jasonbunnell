// WAI-1 — the report's probe, scoring and recommendation logic.
// Ported from Desi's design-file logic class; the IP/GeoIP values she stubbed as
// static examples are wired to /api/whoami here.

const SECTIONS = [
  { id: 'overview',        name: 'Overview' },
  { id: 'internet',        name: 'Internet' },
  { id: 'equipment',       name: 'Equipment' },
  { id: 'location',        name: 'Location' },
  { id: 'social',          name: 'Social' },
  { id: 'security',        name: 'Security' },
  { id: 'recommendations', name: 'Recommendations' }
]

const HIGH = 25, LOW = 5

// Two point values only. Three high checks + five low: 3(25) + 5(5) = 100 exactly.
const CHECK_DEFS = [
  { id: 'blocker',   label: 'Content blocker refusing requests', pts: HIGH },
  { id: 'ip',        label: 'VPN or proxy masking IP address',   pts: HIGH },
  { id: 'browser',   label: 'Privacy-respecting browser',        pts: HIGH },
  { id: 'canvas',    label: 'Canvas fingerprint blocked',        pts: LOW },
  { id: 'cookies3p', label: 'Third-party cookies blocked',       pts: LOW },
  { id: 'gpu',       label: 'GPU model masked',                  pts: LOW },
  { id: 'entropy',   label: 'Low fingerprint entropy',           pts: LOW },
  { id: 'perms',     label: 'Clean permission grants',           pts: LOW }
]

// Affiliate link. Swap for the real NordVPN affiliate URL once the program is live.
const NORDVPN_URL = 'https://nordvpn.com/'

const RECS = {
  blocker: {
    name: 'uBlock Origin', logo: 'ublock', link: 'https://ublockorigin.com/',
    cost: 'uBlock Origin is a free, open-source ad blocker extension. It is also a wide-spectrum content blocker and browser extension designed for efficient ad, tracker, and malicious-domain filtering with low CPU and memory usage.',
    fixes: 'Most of the Social section stops existing. Tracker requests are refused before they leave your machine, so there is nothing to correlate and no pixel to fire.',
    doesnt: 'Your IP, your ISP and your city are all sent before any script runs. A blocker never sees them.'
  },
  ip: {
    name: 'Nord VPN', logo: 'nord', link: NORDVPN_URL, sponsored: true,
    cost: 'There are several options, but my recommendation is Nord VPN. Lightweight and easy to use. <strong>Do not use a free VPN</strong>. There are costs to having a VPN and if it\u2019s free, they are likely not protecting you. Nord VPN has over 8,800 servers over 224 locations. They offer a dedicated IP and a ton of features. Use my link for 10% off.',
    fixes: 'Every site sees the VPN’s IP instead of yours — zeroing out the Internet section and most of Location, which this page just spent two sections proving are accurate about you. Your ISP stops logging and selling where you go.',
    doesnt: 'The fingerprint in Equipment. That works exactly as well through a VPN, and can make you more distinctive, because your timezone stops matching your IP — which this page detects, and so does everyone else.'
  },
  canvas: {
    name: 'Brave Shields, or CanvasBlocker for Firefox', cost: 'Free · built in, or one extension',
    fixes: 'The canvas and WebGL measurements become randomised per site and per session, which breaks the composite ID into a different ID everywhere.',
    doesnt: 'Randomisation is itself unusual. Very few people do it, so in a small way it makes you rarer while making you unlinkable.'
  },
  browser: {
    name: 'Brave Browser', logo: 'brave', link: 'https://brave.com/',
    cost: 'Brave Browser is a privacy first browser built by Brendan Eich, the creator of the JavaScript programming language and co-founder of Mozilla, which makes Firefox. It has built in features like ad blocking, protections against browser fingerprinting, and a private browsing mode that integrates with the Tor anonymity network.',
    fixes: 'Third-party cookies off by default, tracker blocking on by default, and fingerprint randomisation — several rows of this report change at once.',
    doesnt: 'Your IP, your ISP, your screen and your hardware. The browser is a better tenant; the machine is the same machine.'
  },
  cookies3p: {
    name: 'Block third-party cookies', cost: 'Free · a browser setting',
    fixes: 'The Meta and Google identifiers in Social stop following you between sites.',
    doesnt: 'First-party tracking, server-side tagging, and the fingerprint — all of which exist precisely because this setting became common.'
  },
  gpu: {
    name: 'Disable WebGL on sites that don’t need it', cost: 'Free · extension or browser flag',
    fixes: 'Removes the single most distinctive string in this report — your exact GPU model — and everything derived from it.',
    doesnt: 'Breaks maps, games and some video players. This one has a real cost and I would not blame you for skipping it.'
  },
  entropy: {
    name: 'Look ordinary', cost: 'Free · and the hardest thing on this list',
    fixes: 'Default window size, default fonts, default language, no exotic extensions. Fingerprinting works on rarity, so being boring is the whole defence.',
    doesnt: 'Almost nobody sustains it, and the Tor Browser is the only thing that enforces it for you. Treat this as context rather than a task.'
  },
  perms: {
    name: 'Revoke stale permissions', cost: 'Free · site settings, five minutes',
    fixes: 'Old camera, microphone and location grants from sites you visited once and forgot. They do not expire on their own.',
    doesnt: 'Anything about this visit. It is housekeeping, which is why it is last and worth the fewest points.'
  }
}

const BANDS = [
  { min: 0,  max: 29,  name: 'Exposed',  color: '#ef5350', chip: '#fdecea', blurb: 'A stock browser with no additions. This is where most people are, and it is not a failing — nothing here was your decision, it was the default.' },
  { min: 30, max: 54,  name: 'Typical',  color: '#f5a623', chip: '#fff3df', blurb: 'You have some of this already, mostly by accident. The gap between you and the top band is two free downloads, not a lifestyle.' },
  { min: 55, max: 79,  name: 'Guarded',  color: '#4a90d9', chip: '#e8f1fb', blurb: 'These are deliberate choices, and they show. What is left is the harder half — the parts that cost convenience rather than five minutes.' },
  { min: 80, max: 100, name: 'Hardened', color: '#26c6a2', chip: '#e7f7f3', blurb: 'You know exactly what you are doing, and this page told you very little you had not already accounted for.' }
]

// Representative pass-sets so every band can be reviewed from the band switcher.
const DEMO = {
  Exposed:  {},
  Typical:  { browser: true, entropy: true, cookies3p: true, gpu: true },
  Guarded:  { blocker: true, browser: true, cookies3p: true, gpu: true, perms: true },
  Hardened: { blocker: true, ip: true, browser: true, canvas: true, cookies3p: true, gpu: true, entropy: true, perms: true }
}

const MAP_STYLES = { Light: 'light_all', Muted: 'rastertiles/voyager', Dark: 'dark_all' }

const FONTS = ['Arial', 'Arial Black', 'Arial Narrow', 'Bahnschrift', 'Baskerville', 'Bodoni MT', 'Book Antiqua', 'Bookman Old Style', 'Calibri', 'Cambria', 'Candara', 'Century Gothic', 'Comic Sans MS', 'Consolas', 'Constantia', 'Copperplate', 'Corbel', 'Courier New', 'Didot', 'Franklin Gothic', 'Futura', 'Garamond', 'Geneva', 'Georgia', 'Gill Sans', 'Helvetica', 'Helvetica Neue', 'Hoefler Text', 'Impact', 'Lucida Bright', 'Lucida Console', 'Lucida Grande', 'Lucida Sans', 'Marlett', 'Menlo', 'Monaco', 'MS Gothic', 'MS PGothic', 'MS Sans Serif', 'MS Serif', 'Optima', 'Palatino', 'Papyrus', 'Perpetua', 'PT Sans', 'Rockwell', 'Segoe Print', 'Segoe Script', 'Segoe UI', 'SimSun', 'Sitka', 'Skia', 'Snell Roundhand', 'Sylfaen', 'Tahoma', 'Times', 'Times New Roman', 'Trebuchet MS', 'Verdana', 'Wingdings', 'Zapfino', 'Andale Mono', 'Avenir', 'Baghdad']

const TEAL = '#26c6a2', RED = '#ef5350', ORANGE = '#f5a623', BLUE = '#4a90d9'

/* ------------------------------------------------------------------ util */

function fnv(str) {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0 }
  return h >>> 0
}

// crypto.subtle needs a secure context; plain http falls back to this.
function synthHex(str, len) {
  let out = ''
  for (let i = 0; out.length < len; i++) out += fnv(`${str}#${i}`).toString(16).padStart(8, '0')
  return out.slice(0, len)
}

async function sha(str, len) {
  try {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, len)
  } catch {
    return synthHex(str, len)
  }
}

function canvasSeed() {
  try {
    const c = document.createElement('canvas')
    c.width = 300; c.height = 70
    const x = c.getContext('2d')
    if (!x) return 'no-canvas'
    x.textBaseline = 'top'
    x.font = '18px "Roboto Mono", monospace'
    x.fillStyle = '#4a90d9'; x.fillRect(8, 8, 62, 20)
    x.fillStyle = '#f5a623'; x.fillText('⊕ jasonbunnell 0x1f', 10, 32)
    x.globalCompositeOperation = 'multiply'
    x.fillStyle = 'rgba(239,83,80,0.7)'; x.beginPath(); x.arc(240, 34, 22, 0, Math.PI * 2); x.fill()
    return c.toDataURL()
  } catch { return 'no-canvas' }
}

function detectFonts() {
  const base = ['monospace', 'serif', 'sans-serif']
  const c = document.createElement('canvas').getContext('2d')
  if (!c) return 0
  const probe = 'mmmmmmmmmmlli WWW @#$%'
  const w = {}
  base.forEach(b => { c.font = `72px ${b}`; w[b] = c.measureText(probe).width })
  let hit = 0
  FONTS.forEach(f => {
    for (const b of base) {
      c.font = `72px "${f}",${b}`
      if (Math.abs(c.measureText(probe).width - w[b]) > 0.5) { hit++; return }
    }
  })
  return hit
}

/* -------------------------------------------------------------- the report */

export function useReport(options = {}) {
  const mapTheme = options.mapTheme || 'Light'

  const s = reactive({
    navOpen: false, w: 1280, active: 'overview',
    known: 0, knownTarget: 0, probeDone: false, sec: 0,
    net: [], headers: [], equipGroups: [], loc: [], ids: [], trackers: [], diskRows: [],
    composite: 'computing…', entropy: 0, reduced: false,
    lanResult: '', deviceNames: '', clipText: '', gps: null, gpsCoords: null,
    center: { lat: 40.6462, lon: -73.9559 },
    passes: {}, bandView: 'live', hoverRec: null,
    lead: { name: '', email: '', phone: '' }, leadOpen: true, leadMsg: '',
    cookieGap: '', dnt: 'not set'
  })

  let tick, countTimer, onResize, onScroll, alive = false

  /* ---------------------------------------------------------- derived */

  const passSet = computed(() => (s.bandView === 'live' ? s.passes : (DEMO[s.bandView] || {})))
  const score = computed(() => CHECK_DEFS.reduce((a, c) => a + (passSet.value[c.id] ? c.pts : 0), 0))
  const band = computed(() => BANDS.find(b => score.value >= b.min && score.value <= b.max) || BANDS[0])

  const recList = computed(() =>
    CHECK_DEFS.filter(c => !passSet.value[c.id]).map(c => ({ ...RECS[c.id], pts: c.pts, id: c.id })))

  const r = reactive({
    sections: SECTIONS,

    // shell
    wide: computed(() => s.w >= 1000),
    navOpen: computed(() => s.navOpen),
    active: computed(() => s.active),
    rail: computed(() => SECTIONS.map(x => ({ ...x, href: `#${x.id}`, on: s.active === x.id }))),

    // overview
    sec: computed(() => s.sec),
    known: computed(() => s.known),
    reduced: computed(() => s.reduced),
    composite: computed(() => s.composite),
    entropy: computed(() => s.entropy),
    entropyPct: computed(() => `${Math.round(Math.min(100, s.entropy / 62 * 100))}%`),
    probeState: computed(() => (s.probeDone ? 'confirmed' : 'probing…')),
    probePct: computed(() => (s.knownTarget ? `${Math.round(s.known / s.knownTarget * 100)}%` : '6%')),
    probeNote: computed(() => (s.probeDone ? 'Every one of them is listed below' : 'Reading your machine')),

    // score
    score, band,
    dashOffset: computed(() => 276.46 * (1 - score.value / 100)),
    checks: computed(() => CHECK_DEFS.map(c => {
      const pass = !!passSet.value[c.id]
      const high = c.pts === HIGH
      return {
        label: c.label,
        mark: pass ? '✓' : (high ? '✕' : '!'),
        color: pass ? TEAL : (high ? RED : ORANGE),
        tint: pass ? '#f2fbf8' : (high ? '#fef6f5' : '#fffaf1'),
        ptsLabel: `${pass ? '+' : '−'}${c.pts}`
      }
    })),
    bandTabs: computed(() => ['live', 'Exposed', 'Typical', 'Guarded', 'Hardened'].map(v => ({
      value: v, label: v === 'live' ? 'Yours' : v, on: s.bandView === v
    }))),
    dnt: computed(() => s.dnt),

    // recommendations
    recs: computed(() => {
      const hovered = recList.value.find(x => x.id === s.hoverRec)
      return recList.value.map(x => ({
        ...x,
        preview: hovered && hovered.id === x.id ? `${score.value} → ${score.value + x.pts}` : 'of 100'
      }))
    }),
    recCount: computed(() => {
      const n = recList.value.length
      return `${n} card${n === 1 ? '' : 's'} for you`
    }),

    // section data
    net: computed(() => s.net),
    headers: computed(() => s.headers),
    headerCount: computed(() => s.headers.length),
    equipGroups: computed(() => s.equipGroups),
    loc: computed(() => s.loc),
    ids: computed(() => s.ids),
    diskRows: computed(() => s.diskRows),
    cookieGap: computed(() => s.cookieGap),

    // interactive results
    lanResult: computed(() => s.lanResult),
    deviceNames: computed(() => s.deviceNames),
    clipText: computed(() => s.clipText),
    gps: computed(() => s.gps),
    tilesReady: computed(() => s.probeDone),
    mapLabel: computed(() => (s.gpsCoords ? 'GPS · street level' : 'From your IP · neighbourhood')),
    tiles: computed(() => {
      const g = s.gpsCoords
      const style = MAP_STYLES[mapTheme] || MAP_STYLES.Light
      const lat = g ? g.lat : s.center.lat
      const lon = g ? g.lon : s.center.lon
      const z = g ? 16 : 13
      const n = Math.pow(2, z)
      const cx = Math.floor((lon + 180) / 360 * n)
      const cy = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * n)
      const out = []
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const tx = (cx + dx + n) % n
          const ty = Math.min(n - 1, Math.max(0, cy + dy))
          out.push({ css: `url("https://basemaps.cartocdn.com/${style}/${z}/${tx}/${ty}@2x.png")` })
        }
      }
      return out
    }),

    // lead form
    lead: s.lead,
    leadOpen: computed(() => s.leadOpen),
    leadMsg: computed(() => s.leadMsg),

    /* -------------------------------------------------------- actions */

    toggleNav: () => { s.navOpen = !s.navOpen },
    closeNav: () => { s.navOpen = false },
    setBand: (v) => { s.bandView = v },
    hover: (id) => { s.hoverRec = id },
    skipLead: () => { s.leadOpen = false; s.leadMsg = 'Fine by me.' },

    probeLan() {
      try {
        const pc = new RTCPeerConnection({ iceServers: [] })
        pc.createDataChannel('x')
        let found = false
        pc.onicecandidate = (e) => {
          if (!e.candidate || found) return
          const m = e.candidate.candidate.match(/([0-9a-f-]+\.local|\d+\.\d+\.\d+\.\d+)/i)
          if (m) { found = true; s.lanResult = m[1]; pc.close() }
        }
        pc.createOffer().then(o => pc.setLocalDescription(o)).catch(() => {})
        setTimeout(() => { if (!found) s.lanResult = 'no candidate returned — your browser refused outright' }, 2500)
      } catch {
        s.lanResult = 'WebRTC unavailable in this context'
      }
    },

    async nameDevices() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        stream.getTracks().forEach(t => t.stop())
        const devs = await navigator.mediaDevices.enumerateDevices()
        s.deviceNames = devs.filter(d => d.label).map(d => `${d.kind} · ${d.label}`).join('\n') || 'granted, but no labels returned'
      } catch {
        s.deviceNames = 'declined — and that is the correct answer. The count needed no permission; the names did.'
      }
    },

    async readClipboard() {
      try {
        const t = await navigator.clipboard.readText()
        const kind = /^https?:\/\//.test(t) ? 'looks like a URL'
          : /^[\w.+-]+@[\w-]+\.\w+$/.test(t) ? 'looks like an email address'
          : /^\d[\d\s-]{6,}$/.test(t) ? 'looks like a number'
          : 'plain text'
        // The content is never shown past the first three characters, and never sent anywhere.
        s.clipText = `${t.length} characters — ${kind} — ${t.slice(0, 3)}${'•'.repeat(Math.min(24, Math.max(0, t.length - 3)))}`
      } catch {
        s.clipText = 'declined or unavailable — the prompt is the protection'
      }
    },

    getGps() {
      if (!navigator.geolocation) { s.gps = 'geolocation unavailable'; return }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          s.gps = `${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)} · ± ${Math.round(pos.coords.accuracy)} meters`
          s.gpsCoords = { lat: pos.coords.latitude, lon: pos.coords.longitude }
        },
        () => { s.gps = 'declined — the map stays a guess' },
        { enableHighAccuracy: true, timeout: 8000 }
      )
    },

    downloadReport() {
      const line = (row) => `  ${String(row.label || row.key || '').padEnd(28)} ${String(row.value || row.size || '')}`
      const parts = [
        'BROWSER PRIVACY REPORT', `Generated ${new Date().toString()}`, '',
        `PRIVACY SCORE: ${score.value}/100 (${band.value.name})`,
        `COMPOSITE ID: ${s.composite}`, `NAIVE ENTROPY: ${s.entropy} bits`, '',
        'INTERNET', ...s.net.map(line), '',
        ...s.equipGroups.flatMap(g => [g.title.toUpperCase(), ...g.rows.map(line), '']),
        'LOCATION', ...s.loc.map(line), '',
        'SOCIAL', ...s.ids.map(line), ...s.diskRows.map(line), '',
        'RECOMMENDATIONS', ...recList.value.map(x => `  +${x.pts}  ${x.name}`), '',
        'Computed in your browser. Nothing in this file was uploaded.'
      ]
      const a = document.createElement('a')
      a.href = URL.createObjectURL(new Blob([parts.join('\n')], { type: 'text/plain' }))
      a.download = 'browser-privacy-report.txt'
      a.click()
      setTimeout(() => URL.revokeObjectURL(a.href), 4000)
      const nm = s.lead.name.trim()
      s.leadMsg = nm ? `Downloaded. Thanks, ${nm.split(' ')[0]}.` : 'Downloaded.'
    }
  })

  /* ---------------------------------------------------------- the probe */

  async function probe() {
    const n = navigator
    const sc = screen
    const ua = n.userAgent || ''
    const tzOS = Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown'
    const conn = n.connection || {}
    const dpr = window.devicePixelRatio || 1

    let browser = 'Chrome'
    if (/Firefox\//.test(ua)) browser = 'Firefox'
    else if (n.brave) browser = 'Brave'
    else if (/Safari\//.test(ua) && !/Chrom/.test(ua)) browser = 'Safari'
    else if (/Edg\//.test(ua)) browser = 'Edge'
    const privBrowser = ['Firefox', 'Brave', 'Safari', 'Tor'].includes(browser)
    const bm = ua.match(/(Firefox|Edg|Chrome|Version)\/([\d.]+)/)
    const bver = bm ? bm[2] : ''

    const plat = (n.userAgentData && n.userAgentData.platform) || n.platform || ''
    let os = 'unknown'
    if (/Mac/i.test(plat)) os = 'macOS'
    else if (/Win/i.test(plat)) os = 'Windows'
    else if (/Linux/i.test(plat)) os = 'Linux'
    else if (/iPhone|iPad/i.test(ua)) os = 'iOS'
    else if (/Android/i.test(ua)) os = 'Android'
    else os = plat || 'unknown'

    let gpu = 'unavailable', vendor = 'unavailable'
    try {
      const gl = document.createElement('canvas').getContext('webgl')
      const dbg = gl && gl.getExtension('WEBGL_debug_renderer_info')
      if (dbg) {
        gpu = gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || 'masked'
        vendor = gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) || 'masked'
      } else if (gl) { gpu = 'masked by your browser'; vendor = 'masked' }
    } catch {}
    const gpuMasked = /masked|unavailable|generic|swiftshader/i.test(gpu)

    let audioSeed = 'no-audio-context'
    try {
      const AC = window.OfflineAudioContext || window.webkitOfflineAudioContext
      if (AC) {
        const ctx = new AC(1, 4410, 44100)
        const osc = ctx.createOscillator()
        osc.type = 'triangle'; osc.frequency.value = 10000
        const comp = ctx.createDynamicsCompressor()
        osc.connect(comp); comp.connect(ctx.destination); osc.start(0)
        const buf = await ctx.startRendering()
        const d = buf.getChannelData(0)
        let sum = 0
        for (let i = 2000; i < 3000; i++) sum += Math.abs(d[i])
        audioSeed = String(sum)
      }
    } catch {}

    const seed = canvasSeed()
    const fontsFound = detectFonts()

    let storageStr = 'not reported'
    try {
      const est = await navigator.storage.estimate()
      if (est && est.quota) storageStr = `${(est.quota / 1073741824).toFixed(2)} GB`
    } catch {}

    let battery = 'no battery API'
    try {
      const bt = await n.getBattery()
      const mins = isFinite(bt.dischargingTime) ? `${Math.round(bt.dischargingTime / 60)} min left` : 'time unknown'
      battery = `${Math.round(bt.level * 100)}%, ${bt.charging ? 'charging' : 'on battery'}, ${mins}`
    } catch {}

    let cams = 0, mics = 0, speakers = 0
    try {
      const devs = await n.mediaDevices.enumerateDevices()
      cams = devs.filter(d => d.kind === 'videoinput').length
      mics = devs.filter(d => d.kind === 'audioinput').length
      speakers = devs.filter(d => d.kind === 'audiooutput').length
    } catch {}

    const perms = []
    let stale = 0
    for (const pn of ['camera', 'microphone', 'geolocation', 'notifications', 'clipboard-read', 'persistent-storage', 'midi']) {
      try {
        const q = await navigator.permissions.query({ name: pn })
        perms.push(`${pn}: ${q.state}`)
        if (q.state === 'granted' && ['camera', 'microphone', 'geolocation'].includes(pn)) stale++
      } catch {}
    }

    let voices = []
    try { voices = speechSynthesis.getVoices() } catch {}

    // --- what is sitting on the disk
    const raw = document.cookie ? document.cookie.split('; ').filter(Boolean) : []
    const decodeCookie = (nm) => {
      if (/^_ga/.test(nm)) return 'Google Analytics — the client ID that stitches your visits together.'
      if (/^_fb/.test(nm)) return 'Meta Pixel — the browser ID Facebook matches to your account.'
      if (/session|sid/i.test(nm)) return 'A session token for this site.'
      return 'Set by this site.'
    }
    const diskRows = raw.map(c => {
      const i = c.indexOf('=')
      return { key: `cookie · ${c.slice(0, i)}`, size: `${c.slice(i + 1).length} B`, note: decodeCookie(c.slice(0, i)) }
    })
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i)
        diskRows.push({ key: `localStorage · ${k}`, size: `${(localStorage.getItem(k) || '').length} B`, note: '' })
      }
    } catch {}
    try {
      if (indexedDB.databases) {
        const dbs = await indexedDB.databases()
        dbs.forEach(d => diskRows.push({ key: `IndexedDB · ${d.name || 'unnamed'}`, size: `v${d.version || 1}`, note: '' }))
      }
    } catch {}
    try { diskRows.push({ key: 'sessionStorage', size: `${sessionStorage.length} keys`, note: '' }) } catch {}
    if (!diskRows.length) {
      diskRows.push({ key: 'nothing readable', size: '0 B', note: 'A very clean browser, or a very good blocker. Either way the composite ID did not need it.' })
    }

    // --- who else this page contacted
    const KNOWN = [
      { m: /connect\.facebook|facebook\.net/, name: 'Meta Pixel' },
      { m: /google-analytics|analytics\.google|googletagmanager/, name: 'Google Analytics' },
      { m: /fonts\.g(oogle|static)/, name: 'Google Fonts' },
      { m: /doubleclick|googlesynd|googleads/, name: 'Google Ads' },
      { m: /cartocdn|openstreetmap/, name: 'Map tiles' },
      { m: /hotjar|clarity\.ms|fullstory/, name: 'Session recording' }
    ]
    const trackers = []
    try {
      const seen = {}
      performance.getEntriesByType('resource').forEach(e => {
        let host = ''
        try { host = new URL(e.name).hostname } catch { return }
        if (host === location.hostname) return
        const k = KNOWN.find(x => x.m.test(e.name))
        const name = k ? k.name : host
        if (!seen[name]) seen[name] = { name, host, n: 0 }
        seen[name].n++
      })
      Object.values(seen).forEach(t => trackers.push(t))
    } catch {}
    trackers.sort((a, b) => b.n - a.n)

    // --- the two identifiers
    const cookie = (nm) => {
      const m = document.cookie.match(new RegExp(`(?:^|; )${nm}=([^;]*)`))
      return m ? decodeURIComponent(m[1]) : null
    }
    const ga = cookie('_ga'), fbp = cookie('_fbp')
    const ids = [
      {
        label: 'Google Analytics client ID', value: ga || 'not present on this domain', found: !!ga,
        note: ga
          ? 'Two years by default. It is how a first-party analytics install still recognises you next February.'
          : 'Either you are blocking it, or this is a first visit. On a live commercial page it reads like GA1.1.16610110.1785529749.'
      },
      {
        label: 'Meta browser ID (_fbp)', value: fbp || 'not present on this domain', found: !!fbp,
        note: fbp
          ? 'Meta matches this to your logged-in account the next time you load anything with a Like button in it.'
          : 'Nothing set. On most commercial pages this reads fb.0.1785529748058.932828835809002807 and follows you off the site.'
      }
    ]

    // --- the request itself, from the server
    const srv = await $fetch('/api/whoami').catch(() => null)
    const g = srv && srv.geo && srv.geo.status === 'success' ? srv.geo : null
    const local = !!(srv && srv.isPrivate)

    const net = [
      {
        label: 'Your IP address',
        value: srv?.ip || 'unavailable',
        note: local
          ? 'You are on the same machine as the server, so this is a local address. On the live site it is your public IP — read from the connection itself, before this page existed.'
          : 'Read server-side from the connection itself, before this page existed. No script was involved and none could have prevented it.'
      },
      { label: 'ISP Provider', value: g?.isp || (local ? 'skipped — local address' : 'unavailable'), note: 'Whoever sells you the connection also holds the log of everywhere it went.' },
      { label: 'Registered organization', value: g?.org || g?.asname || '—' },
      { label: 'Network (ASN)', value: g?.as || '—' },
      { label: 'Reverse DNS', value: g?.reverse || '—' },
      { label: 'Connection quality', value: `${conn.effectiveType || '4g'} · ${conn.downlink || 10} Mbps · ${conn.rtt || 50} ms round trip`, note: 'Read live from your browser. Precise enough to tell a phone on cellular from a laptop on fibre.' },
      { label: 'VPN / proxy detected', value: g ? (g.proxy ? 'yes' : 'no') : '—', note: 'Feeds the privacy score at the top of this page.' },
      { label: 'Datacenter / hosting IP', value: g ? (g.hosting ? 'yes' : 'no') : '—' }
    ]

    const gpc = n.globalPrivacyControl === true
    const dnt = n.doNotTrack === '1' || window.doNotTrack === '1'

    const headers = srv?.allHeaders
      ? Object.entries(srv.allHeaders).map(([label, value]) => ({ label, value }))
      : [{ label: 'user-agent', value: ua }]

    // --- the machine
    const osRows = [
      { label: 'Operating system', value: os },
      { label: 'CPU architecture', value: `${/arm|Mac/i.test(plat) ? 'arm ' : 'x86 '}${/64/.test(ua) || /arm/i.test(plat) ? '64-bit' : '32-bit'}` },
      { label: 'Languages', value: (n.languages || ['en-US']).join(', ') },
      { label: 'Appearance', value: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark mode' : 'light mode' },
      { label: 'Reduced motion', value: s.reduced ? 'requested' : 'not requested' },
      { label: 'Fonts detected', value: `${fontsFound} of ${FONTS.length} probed`, note: 'Measured by drawing text and comparing widths. Design software and language packs make this list unusually personal.' },
      { label: 'Speech voices', value: voices.length ? `${voices.length} installed` : 'none reported' }
    ]
    const browserRows = [
      { label: 'Browser', value: browser + (bver ? ` ${bver}` : '') },
      { label: 'Window', value: `${window.innerWidth} × ${window.innerHeight}`, note: 'Changes when you resize. One of the few rows here you control directly.' },
      { label: 'Touch points', value: String(n.maxTouchPoints || 0) },
      { label: 'Cookies enabled', value: n.cookieEnabled ? 'yes' : 'no' },
      { label: 'Global Privacy Control', value: gpc ? 'on' : 'off' },
      { label: 'Available storage', value: storageStr, note: 'Not free disk space — the share of it this one site could quietly fill without asking.' },
      { label: 'Permissions', value: perms.length ? `${perms.filter(x => /granted/.test(x)).length} granted of ${perms.length}` : 'API unavailable', note: perms.join(', ') }
    ]
    const computerRows = [
      { label: 'CPU cores', value: String(n.hardwareConcurrency || 'not reported') },
      { label: 'Memory', value: n.deviceMemory ? `${n.deviceMemory} GB or more` : 'not reported', note: n.deviceMemory ? 'Rounded by the browser on purpose — it is a fingerprinting signal and they know it.' : '' },
      { label: 'Screen', value: `${sc.width} × ${sc.height} at ${dpr}×` },
      { label: 'Actual pixels', value: `${Math.round(sc.width * dpr)} × ${Math.round(sc.height * dpr)}` },
      { label: 'Battery', value: battery },
      { label: 'Cameras / mics', value: `${cams} / ${mics}`, note: 'A count, with no permission. Names require one.' },
      { label: 'Audio outputs', value: String(speakers) },
      { label: 'Graphics', value: gpu, note: vendor !== 'unavailable' ? `Vendor: ${vendor}` : '' }
    ]
    const equipGroups = [
      { title: 'Operating system', count: `${osRows.length} signals`, rows: osRows },
      { title: 'Browser', count: `${browserRows.length} signals`, rows: browserRows },
      { title: 'Computer', count: `${computerRows.length} signals`, rows: computerRows }
    ]

    // --- where
    const tzIP = g?.timezone || null
    const tzMismatch = !!tzIP && tzIP !== tzOS
    const loc = [
      { label: 'Timezone (from IP)', value: tzIP || (local ? 'skipped — local address' : 'unavailable') },
      {
        label: 'Machine timezone', value: tzOS,
        note: !tzIP ? 'Nothing to compare it against here.'
          : tzMismatch
            ? 'These disagree. That mismatch is itself a signal — it usually means a VPN, and it makes you more distinctive, not less.'
            : 'They match, which is what the absence of a VPN looks like.'
      },
      { label: 'City', value: g?.city || '—' },
      { label: 'State', value: g ? `${g.regionName} (${g.region})` : '—' },
      { label: 'Postal code', value: g?.zip || '—' },
      { label: 'Coordinates', value: g ? `${g.lat}, ${g.lon}` : '—', note: 'Derived from the IP block, not from you. Accurate to a neighbourhood on a good day.' }
    ]
    if (g?.lat) s.center = { lat: g.lat, lon: g.lon }

    // --- score inputs
    const signals = [gpu, ua, `${sc.width}x${sc.height}`, dpr, n.hardwareConcurrency, n.deviceMemory, tzOS, (n.languages || []).join(','), fontsFound, seed, audioSeed, `${cams}/${mics}`]
    const entropy = Math.min(62, 18 + Math.round(signals.filter(Boolean).length * 2.6))
    const composite = await sha(signals.join('|'), 64)

    let thirdPartyBlocked = false
    try { thirdPartyBlocked = (n.cookieDeprecationLabel != null) || ['Firefox', 'Brave', 'Safari'].includes(browser) } catch {}

    const passes = {
      blocker: trackers.length === 0,
      ip: !!(g && (g.proxy || g.hosting)) || tzMismatch,
      canvas: seed === 'no-canvas',
      gpc,
      browser: privBrowser,
      cookies3p: thirdPartyBlocked,
      gpu: gpuMasked,
      entropy: entropy < 33,
      perms: stale === 0
    }

    const target = net.length + headers.length + osRows.length + browserRows.length +
      computerRows.length + loc.length + ids.length + diskRows.length + trackers.length + perms.length + 6

    if (!alive) return

    Object.assign(s, {
      net, headers, equipGroups, loc, ids, trackers, diskRows,
      composite, entropy, passes, probeDone: true, knownTarget: target,
      cookieGap: (() => {
        const n = srv?.cookieNames?.length ?? raw.length
        return `${n} cookie${n === 1 ? '' : 's'}`
      })(),
      dnt: dnt ? 'enabled' : 'not set'
    })

    if (s.reduced) { s.known = target; return }
    countTimer = setInterval(() => {
      if (!alive || s.known >= s.knownTarget) { clearInterval(countTimer); return }
      s.known = Math.min(s.knownTarget, s.known + Math.max(1, Math.round((s.knownTarget - s.known) / 9)))
    }, 55)
  }

  /* ---------------------------------------------------------- lifecycle */

  onMounted(() => {
    alive = true
    s.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    s.w = window.innerWidth

    onResize = () => { s.w = window.innerWidth }
    window.addEventListener('resize', onResize)

    onScroll = () => {
      let cur = 'overview'
      for (const x of SECTIONS) {
        const el = document.getElementById(x.id)
        if (el && el.getBoundingClientRect().top <= 140) cur = x.id
      }
      if (cur !== s.active) s.active = cur
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const t0 = Date.now()
    tick = setInterval(() => { s.sec = Math.round((Date.now() - t0) / 1000) }, 1000)

    probe()
  })

  onBeforeUnmount(() => {
    alive = false
    clearInterval(tick)
    clearInterval(countTimer)
    window.removeEventListener('resize', onResize)
    window.removeEventListener('scroll', onScroll)
  })

  return r
}
