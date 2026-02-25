<script setup>
import Container from "./Container";
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore()

const hasLogged = computed(() => {
    return store.getters.hasLogged
})
</script>

<template>
    <Container>
     
    </Container>
</template>