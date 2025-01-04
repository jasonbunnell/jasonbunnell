<template>
    <section v-if="error">Problem loading page...</section>
    <section v-else-if="data">
      <ul class="grid grid-cols-1 gap-4">
        <li v-for="post in data" :key="post.id" class="border border-grey-200 rounded-md p-4 hover:bg-gray-200 hover:dark:bg-gray-800 font-mono">
          <a :href="post.link" target="_blank">
            <div class="flex items-center justify-between">
              <div class="font-semibold text-xl">{{ post.title.rendered }} </div>
              <div>{{ formatDate(post.date) }}</div>
            </div>
            <p class="text-small line-clamp-3">{{ stripHtmlTags(post.content.rendered) }}</p>
          </a>
        </li>
      </ul>
    </section>
    <section v-else>Loading...</section>
  </template>
  
  <script setup>
  const { data, error } = await useFetch('https://blog.jasonbunnell.com/wp-json/wp/v2/posts?per_page=100', { lazy: true });

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

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 3;
  line-clamp: 3;
}
</style>