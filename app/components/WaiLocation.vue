<template>
  <section id="location" class="wai-section">
    <div class="wai-section-head">
      <h2 class="wai-h2">Location</h2>
    </div>

    <div class="wai-grid wai-grid--loc" style="margin-top: 14px">
      <div class="wai-card wai-card--clip">
        <div v-for="row in r.loc" :key="row.label"
          style="display: grid; grid-template-columns: minmax(130px, 1fr) 1.4fr; gap: 16px; padding: 13px 20px; border-bottom: 1px solid var(--divide)">
          <div class="wai-row-label">{{ row.label }}</div>
          <div style="min-width: 0">
            <div class="wai-mono" style="font-size: 13px; color: var(--ink); overflow-wrap: anywhere">{{ row.value }}</div>
            <div v-if="row.note" class="wai-row-note">{{ row.note }}</div>
          </div>
        </div>

        <div style="padding: 16px 20px">
          <span class="wai-tag wai-tag--red">Permission required</span>
          <button type="button" class="wai-btn wai-btn--primary wai-btn--block" style="margin-top: 12px" @click="r.getGps">
            Show my exact location
          </button>
          <div v-if="r.gps" class="wai-mono" style="margin-top: 12px; font-size: 13.5px; color: var(--red); overflow-wrap: anywhere; line-height: 1.6">{{ r.gps }}</div>
          <div v-if="r.gps" class="wai-note" style="margin-top: 6px">
            The map has re-drawn at street zoom. Everything above it was a guess from your IP,
            accurate to a neighbourhood. This is the building.
          </div>
        </div>
      </div>

      <div class="wai-card wai-card--clip">
        <div class="wai-map">
          <!-- Painted as background-image, and only once the URLs exist, so the preload
               scanner cannot fire a request against an unresolved tile. -->
          <div v-if="r.tilesReady" class="wai-map-tiles">
            <div v-for="(t, i) in r.tiles" :key="i" :style="{ backgroundImage: t.css }" />
          </div>
          <div class="wai-map-acc" />
          <div class="wai-map-pin" />
          <div class="wai-map-label">{{ r.mapLabel }}</div>
          <div class="wai-map-attr">&copy; OpenStreetMap &middot; CARTO</div>
        </div>
        <div class="wai-note" style="padding: 13px 18px">
          Loading this map told the tile server your IP address too. I could have hosted the tiles
          myself. Most sites don't, and neither did I.
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({ r: { type: Object, required: true } })
</script>
