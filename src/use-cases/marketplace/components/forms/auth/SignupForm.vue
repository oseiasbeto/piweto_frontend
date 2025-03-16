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

            <span v-show="errors.password.show"
                class="text-brand-danger font-medium text-xs mt-1">
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
</style>