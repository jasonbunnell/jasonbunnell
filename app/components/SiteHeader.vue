<template>
  <header class="bg-slate-700">
    <nav class="container mx-auto p-4 flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
      <NuxtLink to="/"><h1 class="text-2xl sm:text-3xl md:text-4xl text-white">Jason Bunnell</h1></NuxtLink>
      <ul class="flex gap-6 md:gap-8">
        <li><NuxtLink to="/about"><span class="text-lg md:text-2xl text-white">about</span></NuxtLink></li>
        <li><NuxtLink to="/blog"><span class="text-lg md:text-2xl text-white">blog</span></NuxtLink></li>
        <li><NuxtLink to="/projects"><span class="text-lg md:text-2xl text-white">projects</span></NuxtLink></li>
      </ul>
      <ul class="flex gap-4">
        <li><a href="https://www.facebook.com/jason.bunnell"><img src="/img/facebook.png" alt="facebook" class="size-6 md:size-7"></a></li>
        <li><a href="https://www.linkedin.com/in/jasonbunnell/"><img src="/img/linkedin.png" alt="linkedin" class="size-6 md:size-7"></a></li>
        <li><a href="https://www.youtube.com/@JasonBunnell"><img src="/img/youtube.png" alt="youtube" class="size-6 md:size-7"></a></li>
        <li><a href="https://x.com/jasonbunnell"><img src="/img/twitter.png" alt="twitter" class="size-6 md:size-7"></a></li>
      </ul>
    </nav>
  </header>
</template>
