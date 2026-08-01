<template>
  <div>
    <section class="py-12">
      <h2 class="text-4xl text-gray-900 mb-6">Artificial Intelligence</h2>

      <p class="text-xl text-gray-800 mb-6">
        I build with AI every day &mdash; not as a novelty, but as a working part of the toolchain.
        Agents write and review code alongside me, run test cycles, ingest and normalize data, and
        handle the repetitive analysis that used to eat a week.
      </p>

      <p class="text-xl text-gray-800 mb-6">
        Most of what I have to say about it is practical rather than philosophical: what actually
        holds up in production, where the tooling still falls down, and what changes when a small
        team can operate like a much larger one.
      </p>

      <p class="text-lg text-gray-600 italic">
        More here soon. In the meantime, see
        <NuxtLink to="/projects" class="underline">projects</NuxtLink> for what I've been building, or
        <NuxtLink to="/browser-privacy-report" class="underline">the browser privacy report</NuxtLink> for a look at what your browser
        gives away before you type a word.
      </p>
    </section>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'Artificial Intelligence | Jason Bunnell',
  description: 'How Jason Bunnell uses AI agents in day-to-day development, marketing, and data work.',
  ogTitle: 'Artificial Intelligence | Jason Bunnell',
  ogDescription: 'How Jason Bunnell uses AI agents in day-to-day development, marketing, and data work.',
  ogImage: '/img/jason-bunnell.jpg',
  ogUrl: 'https://jasonbunnell.com/artificial-intelligence',
  twitterCard: 'summary'
})
</script>
