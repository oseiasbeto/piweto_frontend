<script setup>
import { ref, computed, watch, onMounted, } from "vue"
import { toast } from "vue3-toastify"
import { useStore } from "vuex";
import BtnSpinner from "../../spinners/BtnSpinner.vue";
import { useUsers } from "../../../../../repositories/users-repository";
import intlTelInput from 'intl-tel-input';
import { useRoute, useRouter } from "vue-router";

const { register, loading, error } = useUsers()
const { googleAuth, loading: loadingAuthGoogle } = useUsers()
const emits = defineEmits(['onregistred'])

const form = ref({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    viewPassword: false,
    strength: "Fraca"
})
const googleButtonRef = ref(null);
const googleApiReady = ref(null);
const googleInitialized = ref(null);
const intl = ref({})

const store = useStore()
const router = useRouter()
const route = useRoute()

const errors = ref({
    first_name: {
        show: false,
        message: "",
        data: ""
    },
    last_name: {
        show: false,
        message: "",
        data: ""
    },
    email: {
        show: false,
        message: "",
        data: ""
    },
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

function validateFirstName() {
    if (!form.value.first_name) {
        errors.value.first_name.show = true
        errors.value.first_name.message = "Por favor, digite o seu primeiro nome."
    } else if (form.value.first_name.length < 3) {
        errors.value.first_name.show = true
        errors.value.first_name.message = "Por favor, digite um nome válido."
    } else if (form.value.first_name.length > 20) {
        errors.value.first_name.show = true
        errors.value.first_name.message = "O primeiro nome deve ter no máximo 20 caracteres."
    } else {
        errors.value.first_name.show = false
        errors.value.first_name.message = ""
    }
}

function validateLastName() {
    if (!form.value.last_name) {
        errors.value.last_name.show = true
        errors.value.last_name.message = "Por favor, digite o seu último nome."
    } else if (form.value.last_name.length < 3) {
        errors.value.last_name.show = true
        errors.value.last_name.message = "Por favor, digite um nome válido."
    } else if (form.value.last_name.length > 20) {
        errors.value.last_name.show = true
        errors.value.last_name.message = "O último nome deve ter no máximo 20 caracteres."
    } else {
        errors.value.last_name.show = false
        errors.value.last_name.message = ""
    }
}


function validatePhone() {
    if (!form.value.phone) {
        errors.value.phone.show = true
        errors.value.phone.message = "Este campo é obrigatório."
    }
    else if (!intl.value.isValidNumber()) {
        errors.value.phone = {
            show: true,
            message: "Por favor, digite um número de telefone válido."
        }
    } else if (/[^\d\s]/.test(form.value.phone)) {
        errors.value.phone = {
            show: true,
            message: "O número de telefone só pode conter dígitos."
        }
    } else if (form.value.phone == errors.value.phone.data) {
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
            message: "Por favor, digite a tua senha."
        }
    }
    else if (form.value.password.length <= 6) {
        errors.value.password = {
            show: true,
            message: "A tua nova senha deve ter no minimo 6 caracteres."
        }
    }
    else {
        errors.value.password = {
            show: false,
            message: ""
        }
    }
}


function openModal(name) {
    store.dispatch("setModal", {
        show: true,
        name,
        data: {}
    })
}
const formInvalid = computed(() => {
    if (!form.value.first_name || !form.value.last_name || !form.value.phone || !form.value.password || errors.value.email.show || errors.value.phone.show || errors.value.password.show) return true
    else return false
})

async function submit() {
    validateFirstName()
    validateLastName()
    // validateEmail()
    validatePhone()
    validatePassword()

    if (formInvalid.value || loading.value) return
    else {
        await register(form.value)
            .then(() => {
                toast("Usuário registrado com sucesso!", {
                    theme: "colored",
                    autoClose: 1000,
                    position: "top-right",
                    transition: "bounce",
                    type: 'success'
                })
                emits('onregistred')
            })
            .catch(error => {
                console.log(error)
                if (error.response.status == 400) {
                    toast("Já existe um usuário cadastrado com este número de telefone.", {
                        theme: "colored",
                        autoClose: 2000,
                        position: "top-right",
                        transition: "bounce",
                        type: 'error'
                    })
                    errors.value.phone = {
                        show: true,
                        data: form.value.phone,
                        message: "Por favor, insira um número de telefone válido!"
                    }
                }
            })
    }
}

// Substitua pelo seu ID de cliente do Google
const CLIENT_ID = '702425334809-n2jb1uf6kal86sg9ucg59dc6f76df7m6.apps.googleusercontent.com';

// Configurações (substitua pelo seu Client ID)
const config = {
    client_id: CLIENT_ID,
    callback: async (response) => {
        console.log('Resposta do Google:', response);
        // Aqui você processa o token JWT
        const userData = parseJwt(response.credential);
        if (userData && !loadingAuthGoogle.value) {
            await googleAuth(userData).then(res => {
                toast(res.data.message, {
                    theme: "colored",
                    autoClose: 2000,
                    position: "top-right",
                    transition: "bounce",
                    type: 'success'
                })
                setTimeout(() => {
                    store.dispatch("resetStaffs")
                    store.dispatch("resetMyEvents")
                    router.replace("/")
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

        // === CONTROLE DO ONE TAP PROMPT ===
        if (!loadingAuthGoogle.value) {
            window.google.accounts.id.prompt(notification => {
                if (notification.isNotDisplayed()) {
                    console.log('Prompt não mostrado:', notification.getNotDisplayedReason());
                }
            });
        } else {
            // Cancela o prompt se estiver carregando
            window.google.accounts.id.cancel();
        }
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
    const input = document.querySelector("#phone");
    intl.value = intlTelInput(input, {
        loadUtilsOnInit: () => import("intl-tel-input/utils"),
        initialCountry: "ao",
        onlyCountries: ["ao"]
    });
    try {
        // Verifica se a API do Google já está carregada
        checkAndInitGoogle()
    } catch (e) {
        console.error('Erro na autenticação Google:', e);
    }
})

// Watcher para desativar/reiniciar o botão durante o loading
watch(loadingAuthGoogle, (isLoading) => {
    if (!window.google?.accounts?.id) return;

    if (isLoading) {
        window.google.accounts.id.cancel(); // Cancela o prompt
    } else {
        // Opcional: Reabre o prompt se necessário
        window.google.accounts.id.prompt(notification => {
            if (notification.isNotDisplayed()) {
                console.log('Prompt não mostrado:', notification.getNotDisplayedReason());
            }
        });
    }
});
</script>

<template>
    <div class="w-auto">
        <div class="flex items-center mb-8 justify-center">
            <h1 class="font-bold text-gray-800 text-center text-xl">Registrar-se</h1>
            
        </div>
        <div ref="googleButtonRef"></div>
        <div class="flex flex-col mt-4 mb-4">
            <label class="text-xs text-gray-500 mb-2 font-bold" for="firstName">Primeiro nome <span
                    class="text-brand-danger">*</span></label>
            <input maxlength="20" :readonly="loading" @input="validateFirstName"
                class="outline-none h-10 focus:border-brand-info text-sm border border-gray-300 rounded p-4" type="text"
                id="firstName" autocomplete="off" oncontextmenu="false" v-model="form.first_name"
                :class="{ '!border-brand-danger': errors.first_name.show }">
            <span class="text-brand-danger text-xs font-medium my-1"> {{ errors.first_name.message }}</span>
        </div>
        <div class="flex flex-col mb-4">
            <label class="text-xs text-gray-500 mb-2 font-bold" for="lastName">Ultimo nome <span
                    class="text-brand-danger">*</span></label>
            <input maxlength="20" :readonly="loading" @input="validateLastName"
                class="outline-none h-10 focus:border-brand-info text-sm border border-gray-300 rounded p-4" type="text"
                id="lastName" autocomplete="off" oncontextmenu="false" v-model="form.last_name"
                :class="{ '!border-brand-danger': errors.last_name.show }">
            <span class="text-brand-danger text-xs font-medium my-1"> {{ errors.last_name.message }}</span>
        </div>
        <div class="flex flex-col mb-4">
            <label class="text-xs text-gray-500 mb-2 font-bold" for="phone">Telefone <span
                    class="text-brand-danger">*</span></label>
            <input :readonly="loading"
                class="outline-none w-full h-10 focus:border-brand-info text-sm border border-gray-300 rounded p-4"
                @input="validatePhone" type="tel" id="phone" autocomplete="off" oncontextmenu="false"
                v-model="form.phone" :class="{ '!border-brand-danger': errors.phone.show }">
            <span class="text-brand-danger text-xs font-medium my-1" v-show="errors.phone.show">
                {{ errors.phone.message }}
            </span>
        </div>
        <div class="flex flex-col mb-4">
            <label class="text-xs text-gray-500 mb-2 font-bold" for="password">Senha <span
                    class="text-brand-danger">*</span></label>
            <div class="relative flex items-center">
                <input :readonly="loading" @input="validatePassword"
                    class="w-full outline-none h-10 focus:border-brand-info text-sm border border-gray-300 rounded p-4 pr-12"
                    :type="form.viewPassword ? 'text' : 'password'" id="password" autocomplete="new-password"
                    oncontextmenu="false" v-model="form.password"
                    :class="{ '!border-brand-danger': errors.password.show }">
                <button
                    class="absolute flex justify-center items-center text-brand-primary w-[24px] h-[24px] right-[16px]"
                    @click="form.viewPassword = !form.viewPassword">
                    <svg v-if="!form.viewPassword" xmlns="http://www.w3.org/2000/svg" version="1.0" width="16px"
                        height="16px" viewBox="0 0 982.000000 472.000000" preserveAspectRatio="xMidYMid meet">

                        <g transform="translate(0.000000,472.000000) scale(0.100000,-0.100000)" fill="currentColor"
                            stroke="none">
                            <path
                                d="M337 4710 c-269 -68 -406 -410 -276 -686 52 -111 264 -371 545 -668 90 -96 164 -177 164 -180 0 -4 -560 -797 -676 -956 l-33 -46 311 -294 c171 -162 314 -296 318 -298 3 -1 170 228 370 510 199 282 366 516 369 520 3 4 75 -42 158 -101 246 -175 505 -332 786 -476 84 -43 135 -75 132 -82 -25 -70 -404 -1297 -401 -1300 2 -2 174 -76 382 -163 363 -151 379 -157 386 -136 5 11 98 308 207 660 110 351 202 640 205 643 3 3 72 -13 153 -36 289 -80 586 -136 893 -167 l170 -18 0 -718 0 -718 410 0 410 0 0 719 0 718 78 7 c328 28 739 104 1052 195 57 17 107 27 111 23 3 -4 95 -290 203 -637 109 -346 203 -642 210 -657 l11 -27 375 159 c206 87 376 164 378 172 1 7 -89 303 -202 658 l-204 645 167 85 c258 134 596 344 816 508 l40 30 364 -519 c199 -285 366 -521 370 -524 8 -4 607 550 625 578 6 10 -89 153 -343 515 -193 275 -351 505 -351 511 0 6 11 18 26 27 34 23 311 319 439 469 218 257 290 367 314 483 47 223 -59 456 -247 545 -59 28 -77 32 -152 32 -76 0 -93 -4 -150 -32 -76 -38 -111 -72 -257 -255 -501 -629 -1213 -1201 -1938 -1558 -1705 -837 -3606 -634 -5180 554 -348 263 -791 684 -1020 970 -170 212 -209 252 -280 287 -68 33 -170 46 -238 29z" />
                        </g>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24"
                        fill="none">
                        <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M1 12C1 12 5 20 12 20C19 20 23 12 23 12" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" />
                        <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </button>
            </div>

            <span v-show="errors.password.show" class="text-brand-danger font-medium text-xs mt-1">
                {{ errors.password.message }}
            </span>
        </div>

        <div class="w-full">
            <button :disabled="loading"
                class="bg-brand-primary flex justify-center gap-2 items-center text-white hover:opacity-[0.8] font-bold text-sm rounded w-full h-10 p-2 uppercase disabled:bg-gray-200"
                @click="submit">
                <BtnSpinner v-if="loading" />
                <p v-else>Cadastrar</p>
            </button>
            
        </div>
        <div class="mx-auto my-1 p-2 text-[11px] text-center text-gray-500">
            Ao me cadastrar, concordo com os
            <a class="text-brand-info  font-semibold underline" href="/termos-de-uso">Termos
                de uso </a> e
            <a class="text-brand-info  font-semibold underline" href="/politica-de-privacidade"><!--?lit$879503936$-->
                políticas
                do Piweto </a>
        </div>
        <div
            class="relative text-sm mt-3 justify-center w-full pt-4 border-t border-gray-300 left-0 flex items-center gap-1">
            <p>Já tens uma conta?</p>
            <router-link to="/conta/login" class="text-brand-primary font-semibold">Login</router-link>
        </div>
    </div>
</template>

<style>
.iti__search-input {
    outline: none;
    padding: 12px;
}

.google-btn-wrapper {
    width: 100%;
    position: relative;
}

/* Sobrescreve o iframe do botão do Google */
::v-deep iframe[src*="accounts.google.com/gsi/button"] {
    width: 100% !important;
}

/* Cria um overlay para estilizar o texto */
.google-btn-wrapper::after {
    content: "SIGN IN WITH GOOGLE";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    font-weight: 500;
    font-size: 14px;
    letter-spacing: 0.25px;
    text-transform: uppercase;
    color: #5f6368;
    /* Cor do texto padrão do Google */
    z-index: 10;
}

/* Esconde o texto original do botão */
::v-deep span[data-text] {
    visibility: hidden !important;
}
</style>