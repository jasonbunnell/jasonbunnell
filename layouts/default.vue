<template>
    <div class="container mx-auto max-w-6xl">
        <header class="flex justify-between items-center">
            <div class="flex items-center space-x-40">
                <div>
                    <NuxtLink to="/" class="text-xl font-semibold p-2 hover:bg-gray-200 dark:hover:bg-gray-800">Jason Bunnell</NuxtLink>
                </div>

                <Menu />
                
            </div>
            <ColorModeSelector />
        </header>

        <main class="p-4 mt-10">
            <slot />
        </main>
    </div>
</template>

<script setup>
useHead({
  titleTemplate: '%s - Jason Bunnell',
  link: [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com'
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap',
      crossorigin: ''
    }
  ],  
  htmlAttrs: {
    lang: 'en'
  },
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon.png'
    }
  ]
})
</script>

<style>
body {
    font-family: 'Open Sans', sans-serif;
}

body {
    @apply bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200;
}
</style>