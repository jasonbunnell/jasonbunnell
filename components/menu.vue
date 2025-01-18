<template>
            <nav class="font-mono">
                
                <ul class="flex space-x-4">
                    <li><NuxtLink to="/" class="link">Main</NuxtLink></li>
                    <li><NuxtLink to="/about" class="link">About</NuxtLink></li>
                    <li><NuxtLink to="/blog" class="link">Blog</NuxtLink></li>
                    <li><NuxtLink to="/projects" class="link">Projects</NuxtLink></li>
                    <li><NuxtLink to="/notes" class="link">Notes</NuxtLink></li>
                </ul>
            </nav>
</template>

<style scoped>
    .link {
        @apply p-3 hover:bg-gray-200 dark:hover:bg-gray-800 text-2xl md:text-base;
    }
</style>