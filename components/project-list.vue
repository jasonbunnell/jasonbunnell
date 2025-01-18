<template>
    <p class="mb-10">
      GitHub Projects
    </p>
  
    <section v-if="error">Problem loading page...</section>
    <section v-else-if="data">
      <ul class="grid grid-cols-1 gap-4">
        <li v-for="repository in repos" :key="repository.id" class="border border-grey-200 rounded-md p-4 hover:bg-gray-200 hover:dark:bg-gray-800 font-mono">
          <a :href="repository.html_url" target="_blank">
            <div class="flex items-center justify-between">
              <div class="text-xl font-semibold">{{ repository.name }} </div>
              <div>{{ repository.stargazers_count }} *</div>
            </div>
            <p class="text-small">{{ repository.description }}</p>
          </a>
        </li>
      </ul>
    </section>
    <section v-else>Loading...</section>
  </template>
  
  <script setup>
  const { data, error } = await useFetch('https://api.github.com/users/jasonbunnell/repos', { lazy: true });
  const repos = computed(
    () => data.value.filter(repo => repo.description)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
  )
  </script>