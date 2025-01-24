<template>
    <div>
        <h2>{{ id }}</h2>
        <p>Product details for {{ id }}</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis eaque, nihil repudiandae error voluptas unde exercitationem. Suscipit, neque nisi! Doloremque?</p>
    </div>
</template>

<script setup>
 const { id } = useRoute().params
 definePageMeta({
    layout: 'notes'
})
</script>

<style scoped>
h2  {
    margin-bottom: 20px;
    font-size: 36px;
}
p {
    margin: 20px 0;
}
</style>