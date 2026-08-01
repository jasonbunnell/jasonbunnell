// Bait endpoint for the content-blocker check on /browser-privacy-report.
// The URL is deliberately shaped like an ad script so that filter lists match it.
// Nothing is served and nothing is logged — if the request completes, there is no
// blocker; if it never arrives, there is. Keeping the bait on our own origin means
// the check does not contact an actual ad network to find out.
export default defineEventHandler((event) => {
  setResponseHeader(event, 'Content-Type', 'application/javascript')
  setResponseHeader(event, 'Cache-Control', 'no-store')
  return '/* bait */'
})
