<script setup>
import { ref, onMounted } from "vue";
import Cookies from "js-cookie"
import { useUsers } from "@/repositories/users-repository.js";
import AlertCookies from "./use-cases/marketplace/components/ui/AlertCookies.vue";
import SplashScreen from "./use-cases/checkout/components/ui/SplashScreen.vue";
import { useRoute } from "vue-router";

const { refreshToken, loading } = useUsers()

loading.value = true

const sessionId = Cookies.get("session_id")
const sessionChecked = ref(false);
const route = useRoute()
let cleverContainer = null;

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

const injectCleverScript = () => {
    const script = document.createElement("script");
    script.id = "clever-core";
    script.setAttribute("data-cfasync", "true");
    script.type = "text/javascript";
    script.src = "https://scripts.cleverwebserver.com/2881999dd0432b611c83cc80f626c3d1.js";
    script.async = true;
    script.setAttribute("data-target", window.name || null);
    script.setAttribute("data-callback", "put-your-callback-function-here");
    script.setAttribute("data-callback-url-click", "put-your-click-macro-here");
    script.setAttribute("data-callback-url-view", "put-your-view-macro-here");

    cleverContainer.appendChild(script);
}
onMounted(async () => {
    await initializeAuthFlow();
    cleverContainer = document.querySelector(".clever-core-ads");
    
    if (cleverContainer) {
        setTimeout(() => {
            injectCleverScript();
        }, 15000);
    }
});

</script>

<template>
    <!-- start main app area-->
    <div class="app font-primary text-brand-black-text">
        <div v-if="!loading">
            <div class="clever-core-ads"></div>
            <router-view></router-view>
            <AlertCookies />
        </div>
        <div v-else>
            <SplashScreen />
        </div>
    </div>
    <!-- end main app area-->
</template>
