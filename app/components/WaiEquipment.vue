<template>
  <section id="equipment" class="wai-section">
    <div class="wai-section-head">
      <h2 class="wai-h2">Equipment</h2>
    </div>
    <p class="wai-lede">
      Now JavaScript is running. It measured your machine &mdash; not by asking permission, but by
      drawing shapes, playing a silent tone and timing how long your hardware took. Every answer is
      boring on its own. Together they are the composite ID at the top of this page.
    </p>

    <div class="wai-grid wai-grid--equip" style="margin-top: 14px">
      <div v-for="g in r.equipGroups" :key="g.title" class="wai-card wai-card--clip">
        <div class="wai-eq-head">
          <div class="wai-eq-title">{{ g.title }}</div>
          <div class="wai-eq-count">{{ g.count }}</div>
        </div>
        <div v-for="row in g.rows" :key="row.label" class="wai-eq-row">
          <div class="wai-eq-row-top">
            <div class="wai-eq-label">{{ row.label }}</div>
            <div class="wai-mono wai-eq-value">{{ row.value }}</div>
          </div>
          <div v-if="row.note" class="wai-eq-note">{{ row.note }}</div>
        </div>
      </div>
    </div>

  </section>
</template>

<script setup>
defineProps({ r: { type: Object, required: true } })
</script>
