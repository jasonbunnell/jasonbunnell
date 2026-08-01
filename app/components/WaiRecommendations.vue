<template>
  <section id="recommendations" class="wai-section">
    <div class="wai-section-head">
      <h2 class="wai-h2">Recommendations</h2>
      <span class="wai-tag wai-tag--teal">{{ r.recCount }}</span>
    </div>
    <p class="wai-lede">
      One card for each check you did not pass, worth exactly the points you did not earn, ordered
      by how much of your score it returns &mdash; not by what it costs.
    </p>

    <div style="margin-top: 14px; display: flex; flex-direction: column; gap: 12px">
      <component
        :is="rec.link ? 'a' : 'div'"
        v-for="rec in r.recs" :key="rec.id"
        class="wai-card wai-rec-card"
        :class="{ 'is-link': rec.link }"
        :href="rec.link || undefined"
        :target="rec.link ? '_blank' : undefined"
        :rel="rec.link ? (rec.sponsored ? 'sponsored nofollow noopener' : 'noopener') : undefined"
        @mouseenter="r.hover(rec.id)" @mouseleave="r.hover(null)">
        <div style="display: flex; gap: 16px; justify-content: space-between; align-items: flex-start; flex-wrap: wrap">
          <div style="min-width: 0">
            <div class="wai-rec-title">
              <WaiBrandLogo v-if="rec.logo" :name="rec.logo" />
              <span class="wai-rec-name" :class="{ 'is-link': rec.link }">{{ rec.name }}</span>
            </div>
            <!-- Static author-written copy; carries <strong> emphasis. -->
            <div class="wai-rec-cost" v-html="rec.cost" />
          </div>
          <div style="flex: 0 0 auto; text-align: right">
            <div class="wai-mono wai-rec-pts">+{{ rec.pts }}</div>
            <div class="wai-mono wai-rec-prev">{{ rec.preview }}</div>
          </div>
        </div>
        <div class="wai-grid wai-grid--split" style="margin-top: 14px">
          <div class="wai-panel wai-panel--teal">
            <div class="wai-split-label" style="color: var(--teal-deep)">Fixes</div>
            <div class="wai-split-body" style="color: #2c6157">{{ rec.fixes }}</div>
          </div>
          <div class="wai-panel wai-panel--red">
            <div class="wai-split-label" style="color: var(--red-deep)">Doesn't fix</div>
            <div class="wai-split-body" style="color: #7a3a34">{{ rec.doesnt }}</div>
          </div>
        </div>
      </component>

      <div v-if="!r.recs.length" class="wai-callout wai-callout--teal" style="border-radius: 6px; padding: 22px 24px">
        <div class="wai-callout-label" style="color: var(--teal-deep)">No cards</div>
        <p style="margin: 8px 0 0; font-size: 18px; line-height: 1.5; font-weight: 300; max-width: 60ch">
          You passed every check I can run. There is nothing to sell you, so this is where the page
          stops. Whatever you already did, keep doing it.
        </p>
      </div>
    </div>

    <div class="wai-card" style="margin-top: 20px; padding: 22px 24px">
      <div class="wai-callout-label" style="color: var(--blue)">Take the report with you</div>
      <h3 style="font-size: 20px; font-weight: 400; margin: 8px 0 0; color: var(--ink)">Everything above, as a file you can keep.</h3>
      <p style="margin: 8px 0 0; max-width: 80ch; font-size: 13.5px; line-height: 1.6; color: var(--ink-3); font-weight: 300; text-wrap: pretty">
        There is an obvious joke here and I will make it explicitly rather than let you notice it
        later: this is a form, on a privacy page, asking for three things I could not otherwise
        learn about you. Everything above was taken. This is the part you get to decline &mdash; the
        report downloads either way.
      </p>

      <div v-if="r.leadOpen" class="wai-grid wai-grid--field" style="margin-top: 16px">
        <input v-model="r.lead.name" type="text" class="wai-input" placeholder="Name" aria-label="Name">
        <input v-model="r.lead.email" type="email" class="wai-input" placeholder="Email" aria-label="Email">
        <input v-model="r.lead.phone" type="tel" class="wai-input" placeholder="Phone (optional)" aria-label="Phone (optional)">
      </div>

      <div style="margin-top: 14px; display: flex; gap: 12px; flex-wrap: wrap; align-items: center">
        <button type="button" class="wai-btn wai-btn--primary" @click="r.downloadReport">Download my report</button>
        <button v-if="r.leadOpen" type="button" class="wai-btn wai-btn--ghost" @click="r.skipLead">Skip the form</button>
        <div v-if="r.leadMsg" style="font-size: 13.5px; color: var(--teal-deep)">{{ r.leadMsg }}</div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({ r: { type: Object, required: true } })
</script>
