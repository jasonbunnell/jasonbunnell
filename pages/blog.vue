<template>
    <div>
        <h2 class="text-xl font-semibold mb-10">Blog Posts</h2>
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
