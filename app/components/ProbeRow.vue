<template>
  <div class="grid grid-cols-1 sm:grid-cols-[minmax(0,14rem)_1fr] gap-1 sm:gap-6 px-4 py-3 border-b border-slate-800/70 last:border-b-0 hover:bg-slate-800/30">
    <div class="text-sm text-slate-400 sm:pt-0.5">{{ label }}</div>
    <div>
      <div :class="valueClass">
        <template v-if="value === null || value === undefined || value === ''">
          <span class="text-slate-600 italic font-sans">not available &mdash; blocked, unsupported, or off</span>
        </template>
        <template v-else>{{ display }}</template>
      </div>
      <p v-if="note" :class="noteClass">{{ note }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  label: String,
  value: [String, Number, Boolean, Array, Object],
  note: String,
  tone: { type: String, default: 'normal' }   // normal | warn | alarm | good
})

const display = computed(() => {
  const v = props.value
  if (Array.isArray(v)) return v.join(', ')
  if (typeof v === 'boolean') return v ? 'yes' : 'no'
  return v
})

const valueClass = computed(() => {
  const base = 'font-mono text-sm break-words'
  if (props.tone === 'alarm') return `${base} text-rose-300`
  if (props.tone === 'warn') return `${base} text-amber-300`
  if (props.tone === 'good') return `${base} text-emerald-300`
  return `${base} text-slate-100`
})

const noteClass = computed(() => {
  const base = 'text-xs mt-1 leading-relaxed max-w-2xl'
  if (props.tone === 'alarm') return `${base} text-rose-400/80`
  if (props.tone === 'warn') return `${base} text-amber-400/80`
  if (props.tone === 'good') return `${base} text-emerald-400/80`
  return `${base} text-slate-500`
})
</script>
