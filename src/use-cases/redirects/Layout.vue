<script setup>
import { useRoute } from "vue-router"
import CheckEmail from "./views/CheckEmail.vue";

const route = useRoute()

</script>

<template>
    <div class="fixed bg-white w-screen h-screen top-0 z-10">
        <!--start views redirect pages-->
        <div class="mt-0">
            <CheckEmail v-if="route.name == 'Check account'"/>
        </div>
        <!--end views redirect pages-->
    </div>
</template>