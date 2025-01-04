<template>
    <div>
        Blog page
    </div>
    <div>
        Post ID is: {{ route.params.id }}
    </div>
</template>

<script setup>
    const route = useRoute()
    console.log(route)
</script>