<template>
  <section id="security" class="wai-section">
    <div class="wai-section-head">
      <h2 class="wai-h2">Security</h2>
      <span class="wai-chip" :style="{ color: r.band.color, background: r.band.chip }">{{ r.score }}/100 &middot; {{ r.band.name }}</span>
    </div>
    <p class="wai-lede">
      Eight checks, all measured by probes that already ran. Three are worth 25 points, five are
      worth 5, and together they come to 100. Nothing is inferred &mdash; if a probe cannot run, the
      check is skipped rather than assumed.
    </p>

    <div class="wai-grid wai-grid--sec" style="margin-top: 14px">
      <div class="wai-card wai-card--clip">
        <div style="padding: 14px 20px; border-bottom: 1px solid var(--divide); display: flex; gap: 10px; flex-wrap: wrap; align-items: center">
          <span style="font-size: 12px; color: var(--ink-3)">View:</span>
          <button v-for="t in r.bandTabs" :key="t.value" type="button"
            class="wai-band-btn" :class="{ 'is-on': t.on }" @click="r.setBand(t.value)">{{ t.label }}</button>
        </div>
        <div v-for="c in r.checks" :key="c.label" class="wai-check" :style="{ background: c.tint }">
          <span class="wai-check-mark" :style="{ background: c.color }">{{ c.mark }}</span>
          <span class="wai-check-label">{{ c.label }}</span>
          <span class="wai-check-pts wai-mono" :style="{ color: c.color }">{{ c.ptsLabel }}</span>
        </div>
      </div>

      <div class="wai-grid">
        <div class="wai-card" style="padding: 18px 20px; border-left: 3px solid var(--ink-4)">
          <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap">
            <div style="font-size: 15px; font-weight: 500; color: var(--ink)">Do Not Track</div>
            <span class="wai-mono" style="font-size: 12px; color: var(--ink-2); background: var(--canvas); border-radius: 4px; padding: 3px 9px">{{ r.dnt }}</span>
            <span style="font-size: 12px; color: var(--ink-4)">worth 0 points</span>
          </div>
          <p style="margin: 8px 0 0; font-size: 13px; line-height: 1.55; color: var(--ink-3); font-weight: 300; max-width: 80ch">
            A request with no enforcement behind it, honoured by almost nobody, and abandoned by the
            standards body that wrote it. It is here because it is the clearest example on the page
            of a setting people believe is protecting them.
          </p>
        </div>

        <div class="wai-card" style="padding: 18px 20px">
          <div style="font-size: 16px; font-weight: 500; color: var(--ink)">What I can't see</div>
          <p style="margin: 6px 0 12px; font-size: 13px; line-height: 1.55; color: var(--ink-3); font-weight: 300; max-width: 80ch">
            Before the advice, the limits of my own scare story. Four things this page cannot do,
            and people regularly think it can.
          </p>
          <div class="wai-grid wai-grid--panel">
            <div v-for="p in limits" :key="p.title" class="wai-panel wai-panel--teal">
              <div class="wai-panel-title">{{ p.title }}</div>
              <div class="wai-panel-body">{{ p.body }}</div>
            </div>
          </div>
          <div class="wai-callout wai-callout--red" style="margin-top: 12px">
            <div class="wai-callout-label" style="color: var(--red-deep)">And yet</div>
            <p style="margin: 6px 0 0; font-size: 14px; line-height: 1.55; font-weight: 300; max-width: 80ch; text-wrap: pretty">
              Meta and Google do not need your history, because they are on the sites where you make
              it. The identifiers above are the same ones on a few million other pages. Nobody had to
              break the rules &mdash; they just had to be present everywhere, which they are.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({ r: { type: Object, required: true } })

const limits = [
  { title: 'Your browsing history', body: 'The CSS trick that leaked visited links was closed in 2010. There is no replacement.' },
  { title: "Other sites' cookies", body: 'Same-origin policy is real and it holds. I see cookies set on this domain, and nothing else.' },
  { title: 'Your files, or your name', body: 'No filesystem access, no address book, no identity — unless you type it into a form.' },
  { title: 'Turn on your camera silently', body: 'The prompt is not decoration. It is why two buttons on this page did nothing until you pressed them.' }
]
</script>
