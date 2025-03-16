<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { toast } from "vue3-toastify"
import { useUsers } from "@/repositories/users-repository.js";

const { resetPassword, loading: resetPasswordLoading } = useUsers()
const { auth } = useUsers()

const route = useRoute()
const router = useRouter()
const store = useStore()

const loading = ref(false)

const form = ref({
    newPassword: "",
    confirmPassword: "",
    viewNewPassword: false,
    viewConfirmPassword: false
})

const otp = computed(() => {
    return route.query.otp
})

const validateNewPassword = () => {
    if (form.value.newPassword == "") {
        errors.value.newPassword = {
            show: true,
            message: "Este campo é obrigatório."
        }
    } else if (form.value.newPassword.length < 6) {
        errors.value.newPassword = {
            show: true,
            message: "A tua nova senha deve ter no minimo 6 caracteres."
        }
    } else {
        errors.value.newPassword = {
            show: false,
            message: ""
        }
    }
}

const validateConfirmPassword = () => {
    if (form.value.confirmPassword == "") {
        errors.value.confirmPassword = {
            show: true,
            message: "Este campo é obrigatório."
        }
    } else if (form.value.confirmPassword !== form.value.newPassword) {
        errors.value.confirmPassword = {
            show: true,
            message: "A nova senha e a confirmação não são iguais."
        }
    } else {
        errors.value.confirmPassword = {
            show: false,
            message: ""
        }
    }
}

const resetForm = () => {
    form.value = {
        newPassword: "",
        confirmPassword: ""
    }
}

const errors = ref({
    newPassword: {
        show: false,
        message: "",
        data: ""
    },
    confirmPassword: {
        show: false,
        message: "",
        data: ""
    }
})

const submit = async () => {
    const newPassword = form.value.newPassword
    const confirmPassword = form.value.confirmPassword
    const errorNewPassword = errors.value.newPassword.show
    const errorConfirmPassword = errors.value.confirmPassword.show

    validateNewPassword()
    validateConfirmPassword()

    if (newPassword.length && confirmPassword.length && !errorNewPassword && !errorConfirmPassword) {
        loading.value = true
        await resetPassword({
            new_password: newPassword,
            otp: otp.value
        })
            .then(async (res) => {
                await auth({
                    phone: res.data.user.phone,
                    password: form.value.newPassword
                }).then(() => {
                    toast('Senha redefinida com sucesso!', {
                        theme: "colored",
                        position: "top-right",
                        autoClose: 2500,
                        type: 'success'
                    })
                    setTimeout(() => {
                        loading.value = false
                        router.push('/')
                    }, 2100)
                })
            })
            .catch(error => {
                loading.value = false
                if (error.response.status == 400) {
                    toast('Link inválido ou expirado. Solicite um novo!', {
                        theme: "colored",
                        position: "top-right",
                        autoClose: 2500,
                        type: 'error'
                    })
                }
                resetForm()
            })
    } else return
}
</script>

<template>
    <div class="flex items-center mb-8 justify-between">
        <h1 class="font-bold text-gray-800 text-xl">
            Redefinir uma nova senha
        </h1>
    </div>
    <!--start new password field area-->
    <div class="flex flex-col mb-4">
        <label class="text-xs text-gray-500 mb-2 font-bold" for="newPassword">
            Nova senha

            <span class="text-brand-danger">*</span>
        </label>

        <div class="flex relative items-center">
            <input autocomplete="new-password"
                class="w-full outline-none h-10 focus:border-brand-info text-sm border border-gray-300 rounded p-4 pr-12"
                :type="form.viewNewPassword ? 'text' : 'password'" :readonly="resetPasswordLoading || loading"
                @input="validateNewPassword" type="password" id="newPassword" v-model="form.newPassword" :class="{ '!border-brand-danger': errors.newPassword.show }
                    ">
            <button class="absolute flex justify-center items-center text-brand-primary w-[24px] h-[24px] right-[16px]"
                @click="form.viewNewPassword = !form.viewNewPassword">
                <svg v-if="!form.viewNewPassword" xmlns="http://www.w3.org/2000/svg" version="1.0" width="16px"
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



        <span class="text-brand-danger text-xs mt-1" v-show="errors.newPassword.show">
            {{ errors.newPassword.message }}
        </span>
    </div>
    <!--end new password field area-->

    <!--start confirm password field area-->
    <div class="flex flex-col mb-4">
        <label class="text-xs text-gray-500 mb-2 font-bold" for="confirmPassword">
            Confirmar senha
            <span class="text-brand-danger">*</span>
        </label>

        <div class="flex relative items-center">
            <input autocomplete="new-password" :readonly="resetPasswordLoading || loading"
                @input="validateConfirmPassword" :type="form.viewConfirmPassword ? 'text' : 'password'"
                class="w-full outline-none h-10 focus:border-brand-info text-sm border border-gray-300 rounded p-4 pr-12"
                type="password" id="confirmPassword" v-model="form.confirmPassword" :class="{ '!border-brand-danger': errors.confirmPassword.show }
                    ">
            <button class="absolute flex justify-center items-center text-brand-primary w-[24px] h-[24px] right-[16px]"
                @click="form.viewConfirmPassword = !form.viewConfirmPassword">
                <svg v-if="!form.viewConfirmPassword" xmlns="http://www.w3.org/2000/svg" version="1.0" width="16px"
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

        <span class="text-brand-danger text-xs mt-1" v-show="errors.confirmPassword.show">
            {{ errors.confirmPassword.message }}
        </span>
    </div>
    <!--end confirm password field area-->

    <!--start btn submit area-->
    <button
        class="bg-brand-primary mb-6 flex justify-center gap-2 items-center text-white hover:opacity-[0.8] font-bold text-sm rounded w-full h-10 py-1 p-2 uppercase disabled:bg-gray-300 disabled:text-gray-500"
        :disabled="resetPasswordLoading || loading" @click="submit()">
        {{ resetPasswordLoading || loading ? 'Processando...' : 'Redefinir senha' }}
    </button>
    <!--end btn submit area-->

    <div
        class="relative text-sm mt-3 justify-center w-full pt-4 border-t border-gray-300 left-0 flex items-center gap-1">
        <router-link to="/conta/login" class="text-brand-primary font-semibold">Fazer login</router-link>
    </div>
</template>