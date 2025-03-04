<script setup>
import { ref } from "vue"
import { toast } from "vue3-toastify"
import { useStore } from "vuex"
import { useRoute, useRouter } from "vue-router"
import BtnSpinner from "../../spinners/BtnSpinner.vue";
import { useUsers } from "../../../../../repositories/users-repository.js";

const { auth, loading, error } = useUsers()

const emit = defineEmits(["onclose"])

const store = useStore()
const route = useRoute()
const router = useRouter()

const form = ref({
    email: "",
    password: ""
})

const errors = ref({
    email: {
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

const resetForm = () => {
    form.value = {
        email: "",
        password: "",
        viewPassword: false
    }
}
function validateEmail() {
    if (form.value.email == "") {
        errors.value.email = {
            show: true,
            message: "Este campo é obrigatório."
        }
    } else {
        errors.value.email = {
            show: false,
            message: ""
        }
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

function openModal(name) {
    store.dispatch("setModal", {
        name,
        show: true,
        data: {
        }
    })
}

async function submit() {
    const email = form.value.email.length
    const password = form.value.password.length

    validateEmail()
    validatePassword()

    if (email && password) {
        await auth(form.value)
            .then(() => {
                store.dispatch("resetStaffs")
                store.dispatch("resetMyEvents")

                const redirect = route.query.r
                if (redirect) {
                    router.push(redirect);
                } else {
                    router.push('/')
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
</script>

<template>
    <div class="w-auto">
        <div class="flex items-center mb-8 justify-center">
            <h1 class="font-bold text-gray-800 text-xl">Fazer login</h1>
        </div>

        <div class="flex flex-col">
            <label class="text-xs text-gray-500 mb-2 font-bold" for="email">E-mail <span
                    class="text-brand-danger">*</span></label>
            <input :readonly="loading" @input="validateEmail" autocomplete="off"
                class="outline-none h-10 focus:border-brand-info text-sm border border-gray-300 rounded p-4" type="text"
                id="email" v-model="form.email" :class="{ '!border-brand-danger': errors.email.show }">
            <span class="text-brand-danger text-xs mt-1" v-show="errors.email.show">
                {{ errors.email.message }}
            </span>
        </div>
        <div class="flex my-1 items-center justify-between">
            <div></div>
            <div>
                <button @click="openModal('forgot-password')" class="text-brand-info text-xs font-semibold">Esqueci a
                    senha</button>
            </div>
        </div>
        <div class="flex flex-col mb-4">
            <label class="text-xs text-gray-500 mb-2 font-bold" for="password">Palavra-passe <span
                    class="text-brand-danger">*</span></label>
            <div class="relative flex items-center">
                <input :readonly="loading" @input="validatePassword"
                    class="w-full outline-none h-10 focus:border-brand-info text-sm border border-gray-300 rounded p-4 pr-12"
                    :class="{ '!border-brand-danger': errors.password.show }" autocomplete="new-password"
                    :type="form.viewPassword ? 'text' : 'password'" id="password" v-model="form.password">
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
            <span v-show="!form.password.length && errors.password.show" class="text-brand-danger text-xs mt-1">
                {{ errors.password.message }}
            </span>
        </div>
        <div class="w-full mb-6">
            <button :disabled="loading"
                class="bg-brand-primary flex justify-center gap-2 items-center text-white hover:opacity-[0.8] font-bold text-sm rounded w-full h-10 p-2 uppercase disabled:bg-gray-200"
                @click="submit">
                <BtnSpinner v-if="loading" />
                <p v-else>Login</p>
            </button>
        </div>
        <div
            class="relative text-sm mt-3 justify-center w-full pt-4 border-t border-gray-300 left-0 flex items-center gap-1">
            <p>Não tens uma conta?</p>
            <router-link to="/conta/registrar-se" class="text-brand-primary font-semibold">Cadastra-se</router-link>
        </div>
    </div>
</template>