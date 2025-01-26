<template>
    <div>
        <header class="bg-slate-700">
            <nav class="container mx-auto p-4 flex justify-between">
                <NuxtLink to="/"><h1 class="text-4xl text-white">Jason Bunnell</h1></NuxtLink>
                        <ul class="flex gap-8">
                            <li><NuxtLink to="/about"><span class="text-2xl text-white">about</span></NuxtLink></li>
                            <li><NuxtLink to="/blog"><span class="text-2xl text-white">blog</span></NuxtLink></li>
                            <li><NuxtLink to="/projects"><span class="text-2xl text-white">projects</span></NuxtLink></li>
                            <!-- <li><NuxtLink to="/notes"><span class="text-2xl text-white">notes</span></NuxtLink></li> -->
                        </ul>
                        <ul class="flex gap-4">
                            <li><a href="https://www.facebook.com/jason.bunnell"><img src="/public/img/facebook.png" alt="facebook" class="size-6"></a></li>
                            <li><a href="https://www.linkedin.com/in/jasonbunnell/"><img src="/public/img/linkedin.png" alt="linkedin" class="size-6"></a></li>
                            <li><a href="https://www.youtube.com/@JasonBunnell"><img src="/public/img/youtube.png" alt="youtube" class="size-6"></a></li>
                            <li><a href="https://x.com/jasonbunnell"><img src="/public/img/twitter.png" alt="twitter" class="size-6"></a></li>
                        </ul>
            </nav>
        </header>

        <!-- PAGE CONTENT -->
         <div class="container mx-auto">
            <slot />
         </div>
    </div>
</template>

<style>
.router-link-exact-active 
{
    color: #fff;
}
</style>