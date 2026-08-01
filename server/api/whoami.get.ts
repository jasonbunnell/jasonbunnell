// /api/whoami — everything the server learns from the raw HTTP request,
// before a single line of JavaScript runs in the browser.

type GeoCache = { at: number; data: any }
const geoCache = new Map<string, GeoCache>()
const GEO_TTL = 10 * 60 * 1000

const PRIVATE_IP = /^(::1|::ffff:127\.|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|fc|fd|fe80:)/i

// Headers worth surfacing, with a plain-English explanation of each.
const HEADER_NOTES: Record<string, string> = {
  'user-agent': 'Browser, engine, and OS family — sent on every single request.',
  'accept-language': 'Your language preferences, in ranked order. Often reveals country or heritage.',
  'accept': 'Which content types your browser will take.',
  'accept-encoding': 'Which compression formats you support.',
  'referer': 'The page you were on immediately before this one.',
  'dnt': 'Do Not Track. Legally meaningless in the US; almost universally ignored.',
  'sec-gpc': 'Global Privacy Control. Legally binding in California, Colorado, and Connecticut.',
  'sec-ch-ua': 'Client Hints: browser brand and major version.',
  'sec-ch-ua-platform': 'Client Hints: your operating system.',
  'sec-ch-ua-mobile': 'Client Hints: phone or not.',
  'sec-fetch-site': 'Whether this request came from another site, your own bookmark, or a link.',
  'sec-fetch-mode': 'How the request was initiated.',
  'sec-fetch-dest': 'What the response will be used for.',
  'upgrade-insecure-requests': 'Whether you prefer HTTPS.',
  'priority': 'How urgently your browser wants this response.',
  'cookie': 'Every cookie this domain has ever set on you, replayed automatically.'
}

async function lookupGeo(ip: string) {
  const cached = geoCache.get(ip)
  if (cached && Date.now() - cached.at < GEO_TTL) return cached.data

  const fields = [
    'status', 'message', 'continent', 'country', 'countryCode', 'region', 'regionName',
    'city', 'district', 'zip', 'lat', 'lon', 'timezone', 'offset', 'currency',
    'isp', 'org', 'as', 'asname', 'reverse', 'mobile', 'proxy', 'hosting', 'query'
  ].join(',')

  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 3000)
  try {
    const res: any = await $fetch(`http://ip-api.com/json/${encodeURIComponent(ip)}`, {
      query: { fields },
      signal: ctrl.signal
    })
    if (res?.status !== 'success') throw new Error(res?.message || 'lookup failed')
    geoCache.set(ip, { at: Date.now(), data: res })
    return res
  } catch (e: any) {
    return { status: 'fail', message: e?.message || 'geo lookup unavailable' }
  } finally {
    clearTimeout(timer)
  }
}

export default defineEventHandler(async (event) => {
  const headers = getRequestHeaders(event)

  const forwarded = String(headers['x-forwarded-for'] || '')
  const chain = forwarded.split(',').map(s => s.trim()).filter(Boolean)
  const ip = (
    chain[0] ||
    String(headers['cf-connecting-ip'] || '') ||
    String(headers['x-real-ip'] || '') ||
    getRequestIP(event, { xForwardedFor: true }) ||
    ''
  ).replace(/^::ffff:/, '')

  const isPrivate = !ip || PRIVATE_IP.test(ip)
  const geo = isPrivate ? { status: 'local' } : await lookupGeo(ip)

  // Cookie NAMES the server received — including HttpOnly ones the page's own
  // JavaScript is forbidden from reading.
  const rawCookie = String(headers['cookie'] || '')
  const cookieNames = rawCookie
    ? rawCookie.split(';').map(c => c.split('=')[0].trim()).filter(Boolean)
    : []

  const interesting: Array<{ name: string; value: string; note: string }> = []
  for (const [name, note] of Object.entries(HEADER_NOTES)) {
    const v = headers[name]
    if (v) interesting.push({ name, value: String(v), note })
  }

  const allHeaders: Record<string, string> = {}
  for (const [k, v] of Object.entries(headers)) {
    if (k === 'cookie') { allHeaders[k] = `[${cookieNames.length} cookies — see below]`; continue }
    allHeaders[k] = String(v)
  }

  return {
    ip,
    ipVersion: ip.includes(':') ? 'IPv6' : ip ? 'IPv4' : null,
    isPrivate,
    proxyChain: chain,
    geo,
    headers: interesting,
    allHeaders,
    cookieNames,
    cookieBytes: rawCookie.length,
    protocol: (event.node?.req as any)?.httpVersion || null,
    method: event.method,
    serverTime: Date.now()
  }
})
