<template>
  <section id="social" class="wai-section">
    <div class="wai-section-head">
      <h2 class="wai-h2">Social</h2>
    </div>
    <p class="wai-lede">
      Everything above described your machine. This describes your file &mdash; who is holding a
      number that means you, and what left this page while you were reading it.
    </p>

    <div class="wai-grid" style="margin-top: 14px">
      <div v-for="row in r.ids" :key="row.label" class="wai-card"
        style="padding: 18px 20px; border-left: 3px solid" :style="{ borderLeftColor: row.found ? 'var(--red)' : 'var(--teal)' }">
        <div style="display: flex; justify-content: space-between; gap: 12px; align-items: baseline; flex-wrap: wrap">
          <div style="font-size: 14px; font-weight: 500; color: var(--ink)">{{ row.label }}</div>
          <span style="font-size: 11px; font-weight: 500; letter-spacing: .05em; text-transform: uppercase; padding: 4px 9px; border-radius: 4px"
            :style="row.found
              ? { color: 'var(--red)', background: 'var(--red-tint)' }
              : { color: 'var(--teal)', background: 'var(--teal-tint)' }">
            {{ row.found ? 'Active' : 'Not set' }}
          </span>
        </div>
        <div class="wai-mono" style="font-size: 14px; color: var(--ink); overflow-wrap: anywhere; margin-top: 8px; line-height: 1.5">{{ row.value }}</div>
        <div style="font-size: 12.5px; color: var(--ink-3); margin-top: 8px; line-height: 1.55; font-weight: 300">{{ row.note }}</div>
      </div>

      <WaiDisclosure title="Sitting on your disk" :count="r.cookieGap">
        <div v-for="d in r.diskRows" :key="d.key"
          style="display: flex; justify-content: space-between; gap: 14px; padding: 11px 20px; border-bottom: 1px solid var(--divide-row); align-items: baseline">
          <div style="min-width: 0">
            <div class="wai-mono" style="font-size: 12.5px; color: var(--ink); overflow-wrap: anywhere">{{ d.key }}</div>
            <div v-if="d.note" style="font-size: 12px; color: var(--ink-4); margin-top: 3px; line-height: 1.5; font-weight: 300">{{ d.note }}</div>
          </div>
          <div class="wai-mono" style="font-size: 12px; color: var(--ink-3); white-space: nowrap">{{ d.size }}</div>
        </div>
      </WaiDisclosure>
    </div>
  </section>
</template>

<script setup>
defineProps({ r: { type: Object, required: true } })
</script>
