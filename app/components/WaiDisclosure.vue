<template>
  <div class="wai-card wai-card--clip">
    <div class="wai-disc-head">
      <span class="wai-disc-title">{{ title }}</span>
      <div class="wai-disc-actions">
        <span class="wai-disc-count">{{ count }}</span>
        <button type="button" class="wai-disc-btn" :disabled="open" aria-label="Expand" @click="open = true">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
        </button>
        <button type="button" class="wai-disc-btn" :disabled="!open" aria-label="Collapse" @click="open = false">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
        </button>
      </div>
    </div>
    <div v-if="open" class="wai-disc-body">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  count: { type: String, default: '' },
  startOpen: { type: Boolean, default: false }
})

const open = ref(false)
</script>
