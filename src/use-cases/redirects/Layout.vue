<script setup>
import { useRoute } from "vue-router"
import ActiveEmail from "./views/ActiveEmail.vue";

const route = useRoute()

</script>

<template>
    <div class="fixed bg-white w-screen h-screen top-0 z-10">
        <!--start views redirect pages-->
        <div class="mt-0">
            <ActiveEmail v-if="route.name == 'Active email'"/>
        </div>
        <!--end views redirect pages-->
    </div>
</template>