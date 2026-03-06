<script setup>
import { computed, watch, onMounted, ref } from "vue"
import { toast } from "vue3-toastify"
import { useStore } from "vuex"
import { useRoute, useRouter } from "vue-router"
import BtnSpinner from "../../spinners/BtnSpinner.vue";
import Input from "../../ui/Input.vue";
import { useUsers } from "../../../../../repositories/users-repository.js";

const { auth, loading } = useUsers()
const { googleAuth, loading: loadingAuthGoogle } = useUsers()

const emit = defineEmits(["onclose"])
const googleButtonRef = ref(null)
const googleApiReady = ref(false)
const googleInitialized = ref(false)
const intl = ref({})

const store = useStore()
const route = useRoute()
const router = useRouter()

const cart = computed(() => {
    return store.getters.cart
})

const form = ref({
    phone: "",
    password: "",
    viewPassword: false
})

const errors = ref({
    phone: {
        show: false,
        message: "",
        data: ""
    },
    password: {
        show: false,
        message: "",
        data: ""
    }
})

const formInvalid = computed(() => {
    if (!form.value.phone || !form.value.password || errors.value.phone.show || errors.value.password.show) return true
    else return false
})

const resetForm = () => {
    form.value = {
        phone: "",
        password: "",
        viewPassword: false
    }
}
function validatePhone() {
    if (!form.value.phone) {
        errors.value.phone.show = true
        errors.value.phone.message = "Este campo é obrigatório."
    }
    else if (form.value.phone.length !== 9) {
        errors.value.phone.show = true
        errors.value.phone.message = "O número de telefone deve ter 9 dígitos!"
    }
    else if (form.value.phone == errors.value.phone.data) {
        errors.value.phone.show = true
        errors.value.phone.message = "Por favor, insira um número de telefone válido!"
    } else {
        errors.value.phone.show = false
        errors.value.phone.message = ""
    }
}

function validatePassword() {
    if (form.value.password == "") {
        errors.value.password = {
            show: true,
            message: "Este campo é obrigatório."
        }
    } else {
        errors.value.password = {
            show: false,
            message: ""
        }
    }
}

async function submit() {

    validatePhone()
    validatePassword()

    if (!formInvalid.value) {
        await auth({ phone: form.value?.phone.replace(/\s/g, ""), password: form.value?.password })
            .then(() => {
                store.dispatch("resetStaffs")
                store.dispatch("resetMyEvents")
                const redirect = route.query.r
                const regexCheckoutPath = /^checkout\/carrinho\/[a-z0-9-]+_\d+$/;

                if (regexCheckoutPath.test(redirect)) {
                    if (cart.value?.id) {
                        router.push(redirect);
                    } else {
                        const match = redirect.match(/^checkout\/carrinho\/([a-z0-9-]+_\d+)$/);
                        if (match) {
                            const slug = match[1];
                            router.push('/evento/' + slug)
                        }
                    }
                } else {
                    if (redirect) {
                        router.push(redirect);
                    } else {
                        router.push('/')
                    }
                }
            })
            .catch(error => {
                toast('Credenciais invalidas!', {
                    theme: "colored",
                    position: "top-right",
                    autoClose: 2500,
                    type: 'error'
                })
                resetForm()
                console.log(error)
            })
    } else return
}

// Substitua pelo seu ID de cliente do Google
const CLIENT_ID = '914842748542-mc9j2ltt0no88mqlu144u1q1hu19lhq1.apps.googleusercontent.com';

// Configurações (substitua pelo seu Client ID)
const config = {
    client_id: CLIENT_ID,
    callback: async (response) => {
        // Aqui você processa o token JWT
        const userData = parseJwt(response.credential);

        if (userData && !loadingAuthGoogle.value) {
            await googleAuth(userData).then(() => {
                setTimeout(() => {
                    store.dispatch("resetStaffs")
                    store.dispatch("resetMyEvents")
                    const redirect = route.query.r
                    const regexCheckoutPath = /^checkout\/carrinho\/[a-z0-9-]+_\d+$/;

                    if (regexCheckoutPath.test(redirect)) {
                        if (cart.value?.id) {
                            router.push(redirect);
                        } else {
                            const match = redirect.match(/^checkout\/carrinho\/([a-z0-9-]+_\d+)$/);
                            if (match) {
                                const slug = match[1];
                                router.push('/evento/' + slug)
                            }
                        }
                    } else {
                        if (redirect) {
                            router.push(redirect);
                        } else {
                            router.push('/')
                        }
                    }
                }, 1000)
            }).catch(err => {
                toast(err?.response?.data?.message || 'Algo deu errado!', {
                    theme: "colored",
                    autoClose: 2000,
                    position: "top-right",
                    transition: "bounce",
                    type: 'error'
                })
            })
        }
    }
};

// Função para decodificar o JWT
const parseJwt = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Erro ao decodificar JWT:', e);
        return null;
    }
};

// Modifique esta função para ser reutilizável
const initGoogleButton = () => {
    if (!window.google?.accounts?.id || googleInitialized.value) return;

    try {
        // Limpa qualquer botão existente
        if (googleButtonRef.value.firstChild) {
            googleButtonRef.value.removeChild(googleButtonRef.value.firstChild);
        }

        window.google.accounts.id.initialize({
            client_id: CLIENT_ID,
            callback: (response) => {
                if (!loadingAuthGoogle.value) {
                    config.callback(response);
                } else {
                    toast("Por favor aguarde...", {
                        theme: "colored",
                        autoClose: 1000,
                        position: "top-right",
                        transition: "bounce",
                        type: 'info'
                    });
                }
            }
        });

        // Adiciona um atributo para controle de estado
        const buttonConfig = {
            type: 'standard',
            size: 'large',
            theme: 'outline',
            text: 'sign_in_with',
            shape: 'rectangular',
            width: '100%',
        };

        // Se estiver carregando, desativa o botão
        if (loadingAuthGoogle.value) {
            buttonConfig.attributes = {
                'data-login_pending': 'true'
            };
        }

        window.google.accounts.id.renderButton(
            googleButtonRef.value,
            buttonConfig
        );

        googleInitialized.value = true;
    } catch (e) {
        console.error('Erro no botão Google:', e);
        return false;
    }
};

// Função para verificar e inicializar a API do Google
const checkAndInitGoogle = () => {
    if (window.google?.accounts?.id) {
        if (initGoogleButton()) {
            googleApiReady.value = true
        }
    } else {
        // Tenta novamente após um pequeno delay
        setTimeout(checkAndInitGoogle, 300)
    }
}

onMounted(async () => {
    try {
        // Verifica se a API do Google já está carregada
        checkAndInitGoogle()
    } catch (e) {
        console.error('Erro na autenticação Google:', e);
    }
})

</script>

<template>
    <div class="w-auto">
        <div class="flex items-center mb-8 justify-center">
            <h1 class="font-medium text-black text-xl">Faça o login na Piweto</h1>
        </div>
        <div ref="googleButtonRef"></div>
        <div class="flex flex-col mt-4">
            <div class="flex flex-col">
                <Input @update:model-value="validatePhone" :disabled="loading" v-model="form.phone"
                    title="Número de telefone" type="tel"
                    :error="{ show: errors.phone.show, message: errors.phone.message }" />
            </div>
        </div>
        <div class="flex my-1 items-center justify-between">
            <div></div>

        </div>
        <div class="flex flex-col">
            <Input @update:model-value="validatePassword" :disabled="loading" v-model="form.password"
                title="Palavra-passe" type="password"
                :error="{ show: errors.password.show, message: errors.password.message }" />
        </div>
        <div class="pt-2 pb-4">
            <router-link :to="{
                path: '/conta/esqueci-a-senha',
                query: { ...(route.query.r ? { r: route.query.r } : {}) }
            }" class="text-[rgba(0,0,0,.65)] border-b hover:border-black border-[rgba(0,0,0,.16)] text-xs font-semibold">Esqueci a
                senha</router-link>
        </div>
        <div class="w-full mb-6">
            <button :disabled="loading"
                class="bg-brand-primary flex justify-center gap-2 items-center text-white hover:opacity-[0.8] font-bold text-sm w-full h-10 rounded-md py-5 p-2 uppercase disabled:bg-gray-200"
                @click="submit">
                <BtnSpinner v-if="loading" />
                <p v-else>Entrar</p>
            </button>
        </div>
        <div>
            <div
                class="relative text-sm mt-1 justify-center w-full pt-4 left-0 flex items-center gap-1">
                <p>Não tens uma conta?</p>
                <router-link :to="{
                    path: '/conta/registrar-se',
                    query: { ...(route.query.r ? { r: route.query.r } : {}) }
                }" class="text-brand-primary font-semibold">Cadastra-se</router-link>
            </div>


        </div>

    </div>
</template>

<style>
.g_id_signin [data-login_pending="true"] {
    opacity: 0.7;
    cursor: not-allowed;
    pointer-events: none;
}
</style>