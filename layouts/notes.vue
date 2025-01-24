<template>
    <div>
        <!-- PAGE CONTENT -->
         <div>
            <slot />
         </div>
         <footer class="bg-gray-500">
            <nav class="container mx-auto p-4 flex justify-between">
                <NuxtLink to="/">Jason Bunnell</NuxtLink>
                <ul class="flex gap-4">
                    <li><NuxtLink to="/about">about</NuxtLink></li>
                    <li><NuxtLink to="/blog">blog</NuxtLink></li>
                    <li><NuxtLink to="/projects">projects</NuxtLink></li>
                    <li><NuxtLink to="/notes">notes</NuxtLink></li>
                </ul>
                <ul class="flex gap-4">
                    <li>F</li>
                    <li>L</li>
                    <li>X</li>
                </ul>
            </nav>
         </footer>
    </div>
</template>

<style>
.router-link-exact-active 
{
    color: #fff;
}
</style>