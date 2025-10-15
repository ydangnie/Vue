<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore()
const demo = computed(() => store.getters.count)
console.log('demo', demo)

const handlebuttonIncrease = () => {
    store.dispatch('incrementAsync')
}
</script>

<template>
    <h1>demo VueX</h1>
    <h2>demo here, {{ demo }}</h2>
</template>

<style scoped></style>