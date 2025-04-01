<script setup>
import { onBeforeMount, watch, computed, onMounted, onUnmounted, ref } from "vue";
import Cookies from "js-cookie"
import { toast } from "vue3-toastify"
import { useUsers } from "@/repositories/users-repository.js";
import AlertCookies from "./use-cases/marketplace/components/ui/AlertCookies.vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";

const { refreshToken, loading } = useUsers()
const { googleAuth, loading: loadingAuthGoogle } = useUsers()
loading.value = true

const sessionId = Cookies.get("session_id")
const store = useStore()
const router = useRouter()
const route = useRoute()
const sessionChecked = ref(false);
const promptShown = ref(false);
const googleInitialized = ref(false)

// Configurações do Google (use o mesmo Client ID do seu componente de login)
const CLIENT_ID = '702425334809-n2jb1uf6kal86sg9ucg59dc6f76df7m6.apps.googleusercontent.com';
const hasLogged = computed(() => {
    return store.getters.hasLogged
})
const initializeGoogleAuth = () => {
    if (!window.google?.accounts?.id || googleInitialized.value) return;

    try {
        window.google.accounts.id.initialize({
            client_id: CLIENT_ID,
            callback: handleGoogleResponse
        });
        googleInitialized.value = true;
        showGooglePrompt();
    } catch (e) {
        console.error('Erro ao inicializar Google Auth:', e);
    }
};

// Função melhorada para decodificar JWT
const parseJwt = (token) => {
    if (!token || typeof token !== 'string') {
        console.error('Token inválido fornecido para decodificação');
        return null;
    }

    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Token JWT malformado');
        }

        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decodedData = atob(base64);

        // Método mais moderno para decodificação
        const jsonPayload = new TextDecoder().decode(
            Uint8Array.from(decodedData, c => c.charCodeAt(0))
        );

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Erro ao decodificar JWT:', e);
        return null;
    }
};

const handleGoogleResponse = async (response) => {
    if (hasLogged.value) {
        toast("O usuário já se encontra logado no sistema!", {
            theme: "colored",
            autoClose: 3000,  // Tempo maior para erros
            position: "top-right",
            transition: "bounce",
            type: 'error'
        });
    }

    if (!response?.credential) {
        toast('Resposta do Google inválida', {
            theme: "colored",
            autoClose: 2000,
            position: "top-right",
            type: 'error'
        });
        return;
    }

    try {
        const userData = parseJwt(response.credential);

        if (!userData) {
            throw new Error('Falha ao decodificar dados do usuário');
        }

        // Adiciona verificação básica dos dados do usuário
        if (!userData.email || !userData.name) {
            throw new Error('Dados do usuário incompletos');
        }

        // Mostra feedback visual do carregamento
        loadingAuthGoogle.value = true;

        const result = await googleAuth(userData);

        toast(result.data.message, {
            theme: "colored",
            autoClose: 2000,
            position: "top-right",
            transition: "bounce",
            type: 'success'
        });

        // Limpa o estado antes de redirecionar
        store.dispatch("resetStaffs");
        store.dispatch("resetMyEvents");

        // Usa replace para evitar voltar para a página de login
        if (route.meta.routeAuth) {
            await router.replace("/");
        }


    } catch (err) {
        console.error('Erro na autenticação Google:', err);

        const errorMessage = err?.response?.data?.message ||
            err.message ||
            'Falha na autenticação com Google';

        toast(errorMessage, {
            theme: "colored",
            autoClose: 3000,  // Tempo maior para erros
            position: "top-right",
            transition: "bounce",
            type: 'error'
        });
    } finally {
        loadingAuthGoogle.value = false;
    }
};

const showGooglePrompt = () => {
    if (googleInitialized.value) {
        window.google.accounts.id.prompt(notification => {
            if (notification.isNotDisplayed()) {
                console.log('Prompt não mostrado:', notification.getNotDisplayedReason());
            } else if (notification.isSkippedMoment()) {
                console.log('Usuário ignorou o prompt');
            }
        });
    }
};

// Verifica periodicamente se a API do Google está carregada
const checkGoogleAPI = () => {
    if (window.google?.accounts?.id) {
        initializeGoogleAuth();
    } else {
        setTimeout(checkGoogleAPI, 300);
    }
};

const initializeAuthFlow = async () => {
    try {
        if (sessionId) {
            await refreshToken(sessionId);
        } else {
            checkGoogleAPI();
        }
    } catch (error) {
        console.error('Auth error:', error);
    } finally {
        loading.value = false;
        sessionChecked.value = true;
    }
};

const showGooglePromptWithCheck = () => {
    if (!promptShown.value && !hasLogged.value && sessionChecked.value) {
        promptShown.value = true;
        showGooglePrompt();
    }
};

onBeforeMount(async () => {
    await initializeAuthFlow();
});

onMounted(() => {
    // Mostra o prompt imediatamente se já tiver verificado a sessão
    showGooglePromptWithCheck();

    // Configura observador para mostrar quando a sessão for verificada
    const unwatch = watch(sessionChecked, (checked) => {
        if (checked) showGooglePromptWithCheck();
    });

    // Tenta novamente após 5s de forma não intrusiva
    const retryTimer = setTimeout(() => {
        showGooglePromptWithCheck();
    }, 5000);

    // Limpeza
    onUnmounted(() => {
        unwatch();
        clearTimeout(retryTimer);
    });
});

</script>

<template>
    <!-- start main app area-->
    <div class="app text-[#212529]">
        <div v-if="!loading">
            <router-view></router-view>
            <AlertCookies />
        </div>
        <div v-else>
        </div>
    </div>
    <!-- end main app area-->
</template>
