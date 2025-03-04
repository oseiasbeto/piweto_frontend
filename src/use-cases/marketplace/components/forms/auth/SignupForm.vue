<script setup>
import { ref, computed, onMounted, } from "vue"
import { toast } from "vue3-toastify"
import { useStore } from "vuex";
import BtnSpinner from "../../spinners/BtnSpinner.vue";
import { useUsers } from "../../../../../repositories/users-repository";

import intlTelInput from 'intl-tel-input';
const { register, loading, error } = useUsers()

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

const intl = ref({})
const store = useStore()

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
    },
    reCaptcha: {
        show: false,
        message: "",
        data: ""
    }
})

const modal = computed(() => {
    return store.getters.currentModalMarketplace
})

function validateFirstName() {
    if (!form.value.first_name) {
        errors.value.first_name.show = true
        errors.value.first_name.message = "Por favor, digite o seu primeiro nome."
    } else if (form.value.first_name.length < 3) {
        errors.value.first_name.show = true
        errors.value.first_name.message = "Por favor, digite um nome válido."
    } else {
        errors.value.first_name.show = ""
        errors.value.first_name.message = ""
    }
}
function validateLastName() {
    if (!form.value.last_name) {
        errors.value.last_name.show = true
        errors.value.last_name.message = "Por favor, digite o seu ultimo nome."
    } else if (form.value.last_name.length < 3) {
        errors.value.last_name.show = true
        errors.value.last_name.message = "Por favor, digite um nome válido."
    } else {
        errors.value.last_name.show = ""
        errors.value.last_name.message = ""
    }
}
function validateEmail() {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    if (!form.value.email) {
        errors.value.email.show = true
        errors.value.email.message = "Por favor, digite o seu e-mail."
    }
    else if (!regex.test(form.value.email)) {
        errors.value.email.show = true
        errors.value.email.message = "Por favor, digite um e-mail no formato correto."
    } else if (form.value.email == errors.value.email.data) {
        errors.value.email.show = true
        errors.value.email.message = "Por favor, digite um e-mail válido."
    } else {
        errors.value.email.show = false
        errors.value.email.message = ""
    }
}

function validatePassword() {
    if (form.value.password == "") {
        form.value.strength = "Fraca";
        errors.value.password = {
            show: true,
            message: "Por favor, digite a tua senha."
        }
    }
    if (form.value.password.length && form.value.password.length <= 6) {
        form.value.strength = "Fraca";
        errors.value.password = {
            show: true,
            message: "Adicione mais caracteres e combine letras e números."
        }
    }

    // Média: Pelo menos 8 caracteres com letras e números
    if (
        form.value.password.length >= 8 &&
        /[a-zA-Z]/.test(form.value.password) &&
        /\d/.test(form.value.password)
    ) {
        form.value.strength = "Média";
        errors.value.password = {
            show: false,
            message: "Para mais segurança, use letras maiúsculas, minúsculas e símbolos."
        }
    }

    // Forte: Pelo menos 10 caracteres com letras, números e caracteres especiais
    if (
        form.value.password.length >= 10 &&
        /[a-z]/.test(form.value.password) &&
        /[A-Z]/.test(form.value.password) &&
        /\d/.test(form.value.password) &&
        /[!@#$%^&*(),.?":{}|<>]/.test(form.value.password)
    ) {
        form.value.strength = "Forte";
        errors.value.password = {
            show: false,
            message: "Parabéns! Sua senha atende aos requisitos de segurança."
        }
    }
}

function validateReCaptcha() {
    if (!form.value.reCaptchaCheck) {
        errors.value.reCaptcha = {
            show: true,
            message: "Confirmação necessária: complete o reCAPTCHA."
        }
    } else {
        errors.value.reCaptcha = {
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
    if (!form.value.first_name || !form.value.last_name || !form.value.email || !form.value.phone || !form.value.password || errors.value.email.show || errors.value.phone.show || errors.value.password.show) return true
    else return false
})

function close(name) {
    store.dispatch("setModal", {
        name,
        show: false,
        data: {}
    })
}
async function submit() {
    validateFirstName()
    validateLastName()
    validateEmail()
    validatePhone()
    validatePassword()
    validateReCaptcha()

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
                    toast("Já existe um usuário com este email.", {
                        theme: "colored",
                        autoClose: 2000,
                        position: "top-right",
                        transition: "bounce",
                        type: 'error'
                    })
                    errors.value.email = {
                        show: true,
                        data: form.value.email,
                        message: "Insira um e-mail válido."
                    }
                }
            })
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
    } else {
        errors.value.phone.show = false
        errors.value.phone.message = ""
    }
}

onMounted(() => {
    const input = document.querySelector("#phone");
    intl.value = intlTelInput(input, {
        loadUtilsOnInit: () => import("intl-tel-input/utils"),
        initialCountry: "ao",
        onlyCountries: ["ao"]
    });
})
</script>

<template>
    <div class="w-auto">
        <div class="flex items-center mb-8 justify-center">
            <h1 class="font-bold text-gray-800 text-center text-xl">Registrar-se</h1>
        </div>
        <div class="flex flex-col mb-4">
            <label class="text-xs text-gray-500 mb-2 font-bold" for="firstName">Primeiro nome <span
                    class="text-brand-danger">*</span></label>
            <input :readonly="loading" @input="validateFirstName"
                class="outline-none h-10 focus:border-brand-info text-sm border border-gray-300 rounded p-4" type="text"
                id="firstName" autocomplete="off" oncontextmenu="false" v-model="form.first_name"
                :class="{ '!border-brand-danger': errors.first_name.show }">
            <span class="text-brand-danger text-xs font-medium my-1"> {{ errors.first_name.message }}</span>
        </div>
        <div class="flex flex-col mb-4">
            <label class="text-xs text-gray-500 mb-2 font-bold" for="lastName">Ultimo nome <span
                    class="text-brand-danger">*</span></label>
            <input :readonly="loading" @input="validateLastName"
                class="outline-none h-10 focus:border-brand-info text-sm border border-gray-300 rounded p-4" type="text"
                id="lastName" autocomplete="off" oncontextmenu="false" v-model="form.last_name"
                :class="{ '!border-brand-danger': errors.last_name.show }">
            <span class="text-brand-danger text-xs font-medium my-1"> {{ errors.last_name.message }}</span>
        </div>
        <div class="flex flex-col mb-4">
            <label class="text-xs text-gray-500 mb-2 font-bold" for="email">E-mail <span
                    class="text-brand-danger">*</span></label>
            <input :readonly="loading"
                class="outline-none h-10 focus:border-brand-info text-sm border border-gray-300 rounded p-4"
                @input="validateEmail" type="text" id="email" autocomplete="off" oncontextmenu="false"
                v-model="form.email" :class="{ '!border-brand-danger': errors.email.show }">
            <span class="text-brand-danger text-xs font-medium my-1" v-show="errors.email.show">
                {{ errors.email.message }}
            </span>
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
            <label class="text-xs text-gray-500 mb-2 font-bold" for="password">Palavra-passe <span
                    class="text-brand-danger">*</span></label>
            <div class="relative flex items-center">
                <input :readonly="loading" @input="validatePassword" @paste.prevent
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

            <span v-show="!form.password.length && errors.password.show"
                class="text-brand-danger font-medium text-xs mt-1">
                {{ errors.password.message }}
            </span>
        </div>
        <div class="block mb-3" v-show="form.password.length">
            <div class="flex gap-2 mb-3 justify-items-start ">
                <div class="h-1 flex-1 bg-[#d8dee4] rounded-[4px]"
                    :class="form.strength == 'Fraca' ? '!bg-brand-danger' : '!bg-brand-primary'"></div>
                <div class="h-1 flex-1 bg-[#d8dee4] rounded-[4px]"
                    :class="form.strength != 'Fraca' ? '!bg-brand-primary' : 'none'"></div>
                <div class="h-1 flex-1 bg-[#d8dee4] rounded-[4px]"
                    :class="form.strength == 'Forte' ? '!bg-brand-primary' : 'none'"></div>
            </div>
            <div class="flex gap-1.5" :class="form.strength == 'Fraca' ? 'text-brand-danger' : 'text-brand-primary'">
                <svg v-if="form.strength == 'Fraca'" class="mt-[1px]" fill="currentColor" aria-hidden="true" width="12"
                    height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M7 8.5a1.001 1.001 0 0 1-2 0 1.001 1.001 0 0 1 2 0Zm-1-5a.867.867 0 0 0-.859.99l.288 2.015a.576.576 0 0 0 1.142 0l.288-2.015A.867.867 0 0 0 6 3.5Z">
                    </path>
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M.317 7.367A3 3 0 0 0 0 8.708V9a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-.292a3 3 0 0 0-.317-1.341L8.83 1.658A3 3 0 0 0 6.146 0h-.292a3 3 0 0 0-2.683 1.658L.317 7.367ZM9 10.6A1.6 1.6 0 0 0 10.6 9v-.292a1.6 1.6 0 0 0-.169-.715L7.577 2.284A1.6 1.6 0 0 0 6.146 1.4h-.292a1.6 1.6 0 0 0-1.431.884L1.569 7.993a1.6 1.6 0 0 0-.169.715V9A1.6 1.6 0 0 0 3 10.6h6Z">
                    </path>
                </svg>

                <svg class="mr-[-1px]" v-else xmlns="http://www.w3.org/2000/svg" width="15" height="15"
                    viewBox="0 0 24 24" fill="none">
                    <rect width="13" height="13" fill="white" />
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M9.55879 3.6972C10.7552 2.02216 13.2447 2.02216 14.4412 3.6972L14.6317 3.96387C14.8422 4.25867 15.1958 4.41652 15.5558 4.37652L16.4048 4.28218C18.3156 4.06988 19.9301 5.68439 19.7178 7.59513L19.6235 8.44415C19.5835 8.8042 19.7413 9.15774 20.0361 9.36831L20.3028 9.55879C21.9778 10.7552 21.9778 13.2447 20.3028 14.4412L20.0361 14.6317C19.7413 14.8422 19.5835 15.1958 19.6235 15.5558L19.7178 16.4048C19.9301 18.3156 18.3156 19.9301 16.4048 19.7178L15.5558 19.6235C15.1958 19.5835 14.8422 19.7413 14.6317 20.0361L14.4412 20.3028C13.2447 21.9778 10.7553 21.9778 9.55879 20.3028L9.36831 20.0361C9.15774 19.7413 8.8042 19.5835 8.44414 19.6235L7.59513 19.7178C5.68439 19.9301 4.06988 18.3156 4.28218 16.4048L4.37652 15.5558C4.41652 15.1958 4.25867 14.8422 3.96387 14.6317L3.6972 14.4412C2.02216 13.2447 2.02216 10.7553 3.6972 9.55879L3.96387 9.36831C4.25867 9.15774 4.41652 8.8042 4.37652 8.44414L4.28218 7.59513C4.06988 5.68439 5.68439 4.06988 7.59513 4.28218L8.44415 4.37652C8.8042 4.41652 9.15774 4.25867 9.36831 3.96387L9.55879 3.6972ZM15.7071 9.29289C16.0976 9.68342 16.0976 10.3166 15.7071 10.7071L11.8882 14.526C11.3977 15.0166 10.6023 15.0166 10.1118 14.526L8.29289 12.7071C7.90237 12.3166 7.90237 11.6834 8.29289 11.2929C8.68342 10.9024 9.31658 10.9024 9.70711 11.2929L11 12.5858L14.2929 9.29289C14.6834 8.90237 15.3166 8.90237 15.7071 9.29289Z"
                        fill="currentColor" />
                </svg>
                <div class="text-xs flex-1">
                    <p class="text-brand-text text-gray-500">
                        <span class="font-[500]"
                            :class="form.strength == 'Fraca' ? 'text-brand-danger' : 'text-brand-primary'">{{
                                form.strength
                                    == 'Fraca' ? 'Senha fraca:' : form.strength == 'Média' ? 'Senha média:' : 'Senha forte:'
                            }}</span> {{ errors.password.message }}
                    </p>
                </div>
            </div>
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
            <a class="text-brand-info  font-semibold underline" href="/politica-de-privacidade"><!--?lit$879503936$--> políticas
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
</style>