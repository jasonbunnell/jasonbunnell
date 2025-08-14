<template>
<!-- NEW Projects Section-->
 <section class="">
    <h2 class="text-3xl px-10 py-10">Business Projects</h2>

    <div class="grid relative grid-cols-3 gap-6">
        <!-- CARD #1 -->
        <div v-for="project in projects" :key="project.id" class="flex flex-col flex-grow px-10 py-10">
            <div class="max-w-sm relative rounded overflow-hidden shadow-lg flex flex-grow flex-col h-full">
                <img class="w-full" :src="`/img/${project.img}`" alt="Finger Lakes entertainment app">
                <div class="px-6 py-4 flex-grow">
                    <div class="font-bold text-xl mb-2">{{ project.name }}</div>
                    <p class="text-gray-700 text-base flex-grow h-full"> 
                        {{ project.description }}
                    </p>
                </div>
                <div class="px-16 py-4 absolute bottom-0 w-full bg-slate-200 flex justify-between">
                    <span class="inline-block text-lg font-semibold text-blue-600 mr-2"><a href="flxcompass.com">flxcompass.com</a></span>
                    <span class="inline-block text-lg font-semibold text-blue-600 mr-2">FB</span>
                    <span class="inline-block text-lg font-semibold text-blue-600">YT</span>
                    <span class="inline-block text-lg font-semibold text-blue-600">G</span>
                </div>
            </div>
        </div>

    </div>

   <div id="skills">
      <h2 class="text-2xl text-gray-900">Web Projects</h2>
      <ul>
         <li><a href="https://flxcompass.com/">FLXcompass</a></li>
         <li><a href="https://flxradio.co">FLX radio</a></li>
      </ul>
   </div>

</section>

</template>

<script setup>
// import { createClient } from '@supabase/supabase-js'

// if (!supabaseUrl || !supabaseKey) {
//   throw new Error('Your project\'s URL and API key are required to create a Supabase client! Check your Supabase project\'s API settings to find these values https://supabase.com/dashboard/project/_/settings/api')
// }

// const supabase = createClient(supabaseUrl, supabaseKey)
// const projects = ref([])

// async function getProjects() {
//   const { data } = await supabase.from('projects').select()
//   projects.value = data
// }
// onMounted(() => {
//   getProjects()
// })

useSeoMeta({
  title: 'Jason Bunnell',  
  description: 'Jason Bunnell\'s Projects',
  ogTitle: 'Jason Bunnell\'s Projects',
  ogDescription: 'Jason Bunnell\'s Projects',
  ogImage: '/img/jason-bunnell.jpg',
  ogUrl: 'jasonbunnell.com/projects',
  twitterTitle: 'Jason Bunnell',
  twitterDescription: 'Jason Bunnell\'s Projects.  Find my Tweets @jasonbunnell',
  twitterImage: '/img/jason-bunnell.jpg',
  twitterCard: 'summary'
})

</script>
