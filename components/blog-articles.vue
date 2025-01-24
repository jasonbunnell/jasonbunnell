<template>
    <section v-if="data">
      <ul>
        <li v-for="post in data" :key="post.id">
          <a :href="post.link" target="_blank">
            <div>
              <div>{{ post.title.rendered }} </div>
              <div>{{ formatDate(post.date) }}</div>
            </div>
            <p>{{ stripHtmlTags(post.content.rendered) }}</p>
          </a>
        </li>
      </ul>
    </section>
    <section v-else>Loading...</section>
  </template>
  
  <script setup>
  const { data } = await useFetch('https://blog.jasonbunnell.com/wp-json/wp/v2/posts?per_page=100', { lazy: true });

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