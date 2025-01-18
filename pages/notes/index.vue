<template>
<section>
    <h1>Notes Index</h1>
    <ul>
        <li v-for="note in notes" :key="note._path">{{ note.title }}</li>
    </ul>
</section>
</template>
<script setup>
// import { queryContent } from '@nuxt/content'
// const notes = await queryContent('notes').find()
// console.log(notes)
const notes = await queryContent('content/notes')
    .only(['_path', 'title'])
    .find()

if (error) {
  console.error(error)
}
</script>