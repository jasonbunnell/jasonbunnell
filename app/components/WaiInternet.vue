<template>
  <section id="internet" class="wai-section">
    <div class="wai-section-head">
      <h2 class="wai-h2">Internet</h2>
    </div>
    <p class="wai-lede">
      Before this page rendered, before any script ran, your browser volunteered all of this just
      by asking for the page. Turning off JavaScript does not prevent it. There is no setting that
      prevents it.
    </p>

    <div class="wai-card wai-card--clip" style="margin-top: 14px">
      <div v-for="row in r.net" :key="row.label" class="wai-row">
        <div class="wai-row-label">{{ row.label }}</div>
        <div style="min-width: 0">
          <div class="wai-mono wai-row-value">{{ row.value }}</div>
          <div v-if="row.note" class="wai-row-note">{{ row.note }}</div>
        </div>
      </div>

      <div style="padding: 16px clamp(16px, 2.2vw, 24px); display: flex; gap: 14px; align-items: center; flex-wrap: wrap">
        <button type="button" class="wai-btn" @click="r.probeLan">Probe my local network</button>
        <div v-if="r.lanResult" class="wai-mono" style="font-size: 13px; color: var(--teal-deep); overflow-wrap: anywhere">{{ r.lanResult }}</div>
      </div>

      <div v-if="r.lanResult" class="wai-callout wai-callout--teal"
        style="margin: 0 clamp(16px, 2.2vw, 24px) 18px; font-size: 13.5px; line-height: 1.6; font-weight: 300; max-width: 88ch">
        A rare win for your side. Browsers used to hand out the real LAN address here; now they
        return a random <span class="wai-mono">.local</span> name that changes per site and per
        session. The defence works, and it is worth knowing that some of them do.
      </div>
    </div>

    <WaiDisclosure title="The raw headers your browser sent" :count="`${r.headerCount} rows`" style="margin-top: 12px">
      <div style="padding: 8px 0">
        <div v-for="h in r.headers" :key="h.label"
          style="display: grid; grid-template-columns: minmax(130px, .6fr) 2fr; gap: clamp(10px, 2vw, 20px); padding: 8px clamp(16px, 2.2vw, 24px)">
          <div class="wai-mono" style="font-size: 12px; color: var(--ink-4); overflow-wrap: anywhere">{{ h.label }}</div>
          <div class="wai-mono" style="font-size: 12px; color: var(--ink-2); overflow-wrap: anywhere; line-height: 1.55">{{ h.value }}</div>
        </div>
      </div>
    </WaiDisclosure>

  </section>
</template>

<script setup>
defineProps({ r: { type: Object, required: true } })
</script>
