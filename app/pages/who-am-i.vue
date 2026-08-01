<template>
  <div class="wai">
    <!-- The site's own menu, at the top, unchanged. This replaces the "SITE MENU"
         placeholder in the design bundle. -->
    <SiteHeader />

    <div class="wai-shell">
      <aside v-if="r.wide" class="wai-rail">
        <a href="#overview" class="wai-rail-brand">Jason Bunnell</a>
        <div class="wai-rail-items">
          <a v-for="s in r.rail" :key="s.id" :href="s.href" class="wai-rail-item" :class="{ 'is-active': s.on }">{{ s.name }}</a>
        </div>
      </aside>

      <div class="wai-body">


        <div v-if="r.navOpen" class="wai-sheet" :style="{ top: sheetTop + 'px' }">
          <a v-for="s in r.rail" :key="s.id" :href="s.href" class="wai-rail-item" :class="{ 'is-active': s.on }" @click="r.closeNav">{{ s.name }}</a>
        </div>

        <main class="wai-main">
          <WaiOverview :r="r" />
          <WaiInternet :r="r" />
          <WaiEquipment :r="r" />
          <WaiLocation :r="r" />
          <WaiSocial :r="r" />
          <WaiSecurity :r="r" />
          <WaiRecommendations :r="r" />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: false })

useSeoMeta({
  title: 'Browser Security Report | Jason Bunnell',
  description: 'A live privacy report on your browser, your network, your machine, your location, the identifiers following you — scored out of 100, with what to do about it.',
  ogTitle: 'Browser Security Report | Jason Bunnell',
  ogDescription: 'Everything this page can read about you before you type a word, scored out of 100.',
  ogImage: '/img/jason-bunnell.jpg',
  ogUrl: 'https://jasonbunnell.com/who-am-i',
  twitterCard: 'summary_large_image',
  robots: 'index, follow'
})

useHead({
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500&family=Roboto:wght@300;400;500;700&display=swap' }
  ]
})

const r = useReport()

// The sheet sits under the sticky topbar, whose offset depends on how far the
// site header has scrolled away.
const topbar = ref(null)
const sheetTop = ref(64)

function openNav() {
  sheetTop.value = topbar.value ? Math.round(topbar.value.getBoundingClientRect().bottom) : 64
  r.toggleNav()
}
</script>
