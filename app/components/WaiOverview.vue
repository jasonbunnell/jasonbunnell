<template>
  <section id="overview" class="wai-section">
    <h1 class="wai-h1">Browser Security Report</h1>
    <p class="wai-lede wai-lede--hero">
      Want to know what information I can get about you from your browser and IP address?
      People don't take internet privacy very seriously. Most people think, &ldquo;I have nothing
      to hide.&rdquo; The problem is they don't understand
      how this information is being used against you. It is not to monitor your
      activities looking for illegal actions.
      <strong>You are being tracked so that you can be manipulated on a deep psychological level.</strong>
    </p>

    <div class="wai-card wai-card--pad" style="margin-top: 18px">
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap">
        <div class="wai-overline">Your composite ID</div>
        <span class="wai-chip" style="color: var(--red); background: var(--red-tint)">Survives cookie clearing</span>
      </div>
      <div class="wai-mono wai-composite">{{ r.composite }}</div>
      <p style="margin: 12px 0 0; font-size: 13.5px; line-height: 1.55; color: var(--ink-3); font-weight: 300; max-width: 96ch">
        A browser composite ID is a unique tracking identifier formed by combining multiple distinct
        data points or identifiers. It merges separate tracking data points into a SHA-256 hash that
        then gets reduced to 64 hex characters to identify a specific user or browser session across
        a website. Data points tracked are GPU model, user agent, screen resolution, device pixel
        ratio, CPU cores, device memory, timezone, languages, how many fonts are installed, canvas
        render, audio fingerprint, camera / microphone counts. This value is not stored, it is
        calculated on every visit and the same machine produces the same twelve answers, so it
        produces the same hash.
        <strong>That's the trick: identity without storage!</strong>
      </p>
    </div>

    <div class="wai-grid wai-grid--stat" style="margin-top: 16px">
      <div class="wai-card wai-card--pad">
        <div class="wai-overline">Privacy score</div>
        <div style="display: flex; align-items: center; gap: 18px; margin-top: 14px; flex-wrap: wrap">
          <div class="wai-donut-wrap">
            <svg width="104" height="104" viewBox="0 0 104 104" class="wai-donut">
              <circle cx="52" cy="52" r="44" fill="none" stroke="#eef0f4" stroke-width="11" />
              <circle cx="52" cy="52" r="44" fill="none" :stroke="r.band.color" stroke-width="11"
                stroke-linecap="round" stroke-dasharray="276.46" :stroke-dashoffset="r.dashOffset" />
            </svg>
            <div class="wai-donut-num">{{ r.score }}</div>
          </div>
          <div style="flex: 1 1 130px; min-width: 0">
            <div style="font-size: 22px" :style="{ color: r.band.color }">{{ r.band.name }}</div>
            <div style="font-size: 13px; color: var(--ink-3); margin-top: 2px">out of 100</div>
          </div>
        </div>
        <p style="margin: 14px 0 0; font-size: 13px; line-height: 1.55; color: var(--ink-3); font-weight: 300">{{ r.band.blurb }}</p>
      </div>

      <div class="wai-card wai-card--pad">
        <div class="wai-overline">Naive entropy</div>
        <div style="display: flex; align-items: baseline; gap: 8px; margin-top: 12px">
          <div class="wai-numeral" style="color: var(--amber)">{{ r.entropy }}</div>
          <div style="font-size: 16px; color: var(--ink-3)">bits</div>
        </div>
        <div class="wai-track"><div style="background: var(--amber)" :style="{ width: r.entropyPct }" /></div>
        <p style="margin: 12px 0 0; font-size: 13px; line-height: 1.55; color: var(--ink-3); font-weight: 300">
          Overstated on purpose, and here is the correction: it sums each signal as if they were
          independent, and they are not. The honest figure is closer to
          <span class="wai-mono" style="color: var(--ink-2)">18&ndash;20 bits</span>
          &mdash; one in a quarter of a million, not one in a trillion.
        </p>
      </div>

      <div class="wai-card wai-card--pad">
        <div class="wai-overline">Things I know about you</div>
        <div style="display: flex; align-items: baseline; gap: 10px; margin-top: 12px">
          <div class="wai-numeral" style="color: var(--ink)">{{ r.known }}</div>
          <div style="font-size: 13px; font-weight: 500; color: var(--blue)">{{ r.probeState }}</div>
        </div>
        <div class="wai-track"><div style="background: var(--blue)" :style="{ width: r.probePct }" /></div>
        <p style="margin: 12px 0 0; font-size: 13px; line-height: 1.55; color: var(--ink-3); font-weight: 300">
          {{ r.probeNote }} &mdash; read from network headers, hardware probes, your location block
          and the trackers this page loaded.
        </p>
      </div>
    </div>

    <div v-if="r.reduced" class="wai-callout wai-callout--amber" style="margin-top: 16px; display: flex; gap: 14px; align-items: flex-start">
      <span class="wai-callout-label" style="color: var(--amber-deep); flex: 0 0 auto; margin-top: 2px">Noticed</span>
      <p style="margin: 0; font-size: 14px; line-height: 1.55; font-weight: 300; max-width: 90ch">
        You asked your operating system for reduced motion, and your browser told me before you
        clicked anything. That is one of the {{ r.known }} &mdash; and it is also an instruction, so
        nothing here animates for you.
      </p>
    </div>
  </section>
</template>

<script setup>
defineProps({ r: { type: Object, required: true } })
</script>
