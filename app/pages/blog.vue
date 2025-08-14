<template>
    <div>
        <h1 class="text-2xl font-semibold py-8">Blog Posts</h1>
        <p class="text-lg">My wordpress blog can be found at <a href="https://blog.jasonbunnell.com" class="text-blue-700">blog.jasonbunnell.com</a></p>
        <BlogArticles />
    </div>
</template>

<script setup>
useSeoMeta({
  title: 'Jason Bunnell',  
  description: 'Jason Bunnell\'s Blog',
  ogTitle: 'Jason Bunnell\'s Blog',
  ogDescription: 'Jason Bunnell\'s Blog',
  ogImage: '/img/jason-bunnell.jpg',
  ogUrl: 'blog.jasonbunnell.com',
  twitterTitle: 'Jason Bunnell',
  twitterDescription: 'Jason Bunnell\'s Blog.  Find my Tweets @jasonbunnell',
  twitterImage: '/img/jason-bunnell.jpg',
  twitterCard: 'summary'
})

</script>
