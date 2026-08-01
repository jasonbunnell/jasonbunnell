<template>
  <div class="min-h-screen bg-slate-950 text-slate-200">
    <header class="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
      <nav class="container mx-auto p-4 flex flex-wrap items-center justify-between gap-4">
        <NuxtLink to="/"><span class="text-2xl md:text-3xl text-white font-semibold">Jason Bunnell</span></NuxtLink>
        <ul class="flex gap-6 text-slate-400">
          <li><NuxtLink to="/about" class="hover:text-white">about</NuxtLink></li>
          <li><NuxtLink to="/blog" class="hover:text-white">blog</NuxtLink></li>
          <li><NuxtLink to="/projects" class="hover:text-white">projects</NuxtLink></li>
        </ul>
      </nav>
    </header>

    <div class="container mx-auto px-4">
      <slot />
    </div>

    <footer class="border-t border-slate-800 mt-20">
      <div class="container mx-auto p-6 text-sm text-slate-500">
        &copy; Jason Bunnell &middot; <NuxtLink to="/" class="hover:text-slate-300">jasonbunnell.com</NuxtLink>
      </div>
    </footer>
  </div>
</template>
