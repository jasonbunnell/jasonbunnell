<template>
    <section v-if="data" class="flex flex-col justify-center px-4 py-10 sm:px-6">
      <div class="grid grid-cols-1 gap-4 px-10">
        <ul>
        <li class="p-8 flex flex-col justify-between mb-8 gap-1 border rounded-lg shadow-md bg-white" v-for="post in data" :key="post.id">
              <div class="text-2xl font-semibold text-blue-700"><a :href="post.link" target="_blank">{{ post.title.rendered }}</a></div>
              <div class="text-md font-semibold text-gray-800">{{ formatDate(post.date) }}</div>
              <p class="text-gray-800 line-clamp-3">{{ stripHtmlTags(post.content.rendered) }}</p>
        </li>
      </ul>
      </div>
    </section>

    <section v-else>Loading...</section>
  </template>
  
  <script setup>
  const { data } = await useFetch('https://blog.jasonbunnell.com/wp-json/wp/v2/posts?per_page=20', { lazy: true });

  // Function to format the date
  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  // Function to strip HTML tags from a string
  function stripHtmlTags(str) {
    return str.replace(/<[^>]*>?/gm, '');
  }
  </script>