<script setup>
import { onBeforeMount, computed, ref } from "vue";
import Cookies from "js-cookie"
import { useUsers } from "@/repositories/users-repository.js";
import AlertCookies from "./use-cases/marketplace/components/ui/AlertCookies.vue";
import SplashScreen from "./use-cases/checkout/components/ui/SplashScreen.vue";

const { refreshToken, loading } = useUsers()

loading.value = true

const sessionId = Cookies.get("session_id")
const sessionChecked = ref(false);

const initializeAuthFlow = async () => {
    try {
        if (sessionId) {
            await refreshToken(sessionId);
        } else {
            loading.value = false;
            sessionChecked.value = false;
        }
    } catch (error) {
        console.error('Auth error:', error);
    } finally {
        loading.value = false;
        sessionChecked.value = true;
    }
};

onBeforeMount(async () => {
    await initializeAuthFlow();
});

</script>

<template>
    <!-- start main app area-->
    <div class="app font-primary text-black-text">
        <div v-if="!loading">
            <router-view></router-view>
            <AlertCookies />
        </div>
        <div v-else>
            <SplashScreen />
        </div>
    </div>
    <!-- end main app area-->
</template>
