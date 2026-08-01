<template>
  <section class="mb-16 scroll-mt-32" :id="anchor">
    <div class="flex flex-wrap items-baseline gap-x-4 gap-y-2 mb-2">
      <span class="font-mono text-sm text-slate-600">{{ index }}</span>
      <h2 class="text-2xl md:text-3xl font-semibold text-white">{{ title }}</h2>
      <span v-if="source" :class="sourceClass">{{ source }}</span>
    </div>
    <p v-if="lede" class="text-slate-400 mb-6 max-w-3xl leading-relaxed">{{ lede }}</p>
    <div class="rounded-lg border border-slate-800 bg-slate-900/50 overflow-hidden">
      <slot />
    </div>
    <slot name="after" />
  </section>
</template>

<script setup>
const props = defineProps({
  index: String,
  title: String,
  source: String,
  lede: String,
  tone: { type: String, default: 'neutral' }   // neutral | warn | alarm
})

const anchor = computed(() => String(props.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'))

const sourceClass = computed(() => {
  const base = 'font-mono text-[11px] uppercase tracking-widest px-2 py-1 rounded border'
  if (props.tone === 'alarm') return `${base} text-rose-300 border-rose-900 bg-rose-950/40`
  if (props.tone === 'warn') return `${base} text-amber-300 border-amber-900 bg-amber-950/40`
  return `${base} text-cyan-300 border-cyan-900 bg-cyan-950/40`
})
</script>
