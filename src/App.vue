<script setup>
import { onBeforeMount } from "vue";
import Cookies from "js-cookie"
import { useUsers } from "@/repositories/users-repository.js";
import AlertCookies from "./use-cases/marketplace/components/ui/AlertCookies.vue";

const { refreshToken, loading } = useUsers()
loading.value = true

const sessionId = Cookies.get("session_id")

onBeforeMount(async () => {
    if (sessionId) {
       await refreshToken(sessionId)
    } else {
        loading.value = false
    }
})

</script>

<template>
    <!-- start main app area-->
    <div class="app text-[#212529]">
        <div v-if="!loading">
            <router-view></router-view>
            <AlertCookies/>
        </div>
        <div v-else>
        </div>
    </div>
    <!-- end main app area-->
</template>
