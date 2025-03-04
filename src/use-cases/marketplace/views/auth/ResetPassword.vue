<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { useUsers } from "@/repositories/users-repository.js";
import Alert from "../../components/ui/Alert.vue";

const { resetPassword, loading: resetPasswordLoading } = useUsers()
const { auth, loading: authLoading } = useUsers()

const route = useRoute()
const router = useRouter()
const store = useStore()

const alert = ref({
    show: false,
    type: "",
    showBtnClose: true,
    message: ""
})

const form = ref({
    newPassword: "",
    confirmPassword: ""
})

const token = computed(() => {
    return route.query.token
})

const validateNewPassword = () => {
    if (form.value.newPassword == "") {
        errors.value.newPassword = {
            show: true,
            message: "Este campo é obrigatório."
        }
    } else if (form.value.newPassword.length < 8) {
        errors.value.newPassword = {
            show: true,
            message: "A tua nova palavra-passe deve ter no minimo 8 caracteres."
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
            message: "A nova palavra-passe e a confirmação não são iguais."
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

const closeAlert = () => {
    alert.value = {
        show: false,
        type: "",
        showBtnClose: true,
        message: ""
    }
}

const submit = async () => {
    const newPassword = form.value.newPassword
    const confirmPassword = form.value.confirmPassword
    const errorNewPassword = errors.value.newPassword.show
    const errorConfirmPassword = errors.value.confirmPassword.show

    validateNewPassword()
    validateConfirmPassword()

    if (newPassword.length && confirmPassword.length && !errorNewPassword && !errorConfirmPassword) {
        await resetPassword({
            new_password: newPassword,
            token: token.value
        })
            .then(async (res) => {
                await auth({
                    email: res.data.user.email,
                    password: form.value.newPassword
                }).then(() => {
                    store.dispatch("setToast", {
                        show: true,
                        message: "Senha redefinida com sucesso!",
                        type: "success",
                        timeout: 1000
                    })
                    router.push('/')
                })
            })
            .catch(error => {
                console.log(error)
                alert.value = {
                    show: true,
                    showBtnClose: true,
                    type: "error",
                    message: "O link para redefinição de senha é inválido ou expirou. Solicite uma nova redefinição."
                }
                resetForm()
            })
    } else return
}

onMounted(() => {
    if (!token.value) {
        router.replace('/404')
    } else return
})
</script>

<template>
    <div class="lg:w-80 p-4 bg-white lg:shadow-lg my-6 lg:my-12 mx-auto">


        <div class="flex items-center mb-8 justify-between">
            <h1 class="font-bold text-gray-800 text-xl">
                Redefinir uma nova senha
            </h1>
        </div>

        <!--start alert area-->
        <div class="mb-3">
            <alert @onclose="closeAlert" :show-btn-close="alert.showBtnClose" :show="alert.show"
                :message="alert.message" :type="alert.type" />
        </div>
        <!--end alert area-->
        <!--start new password field area-->
        <div class="flex flex-col mb-4">
            <label class="text-xs text-gray-500 mb-2 font-bold" for="newPassword">
                Nova senha

                <span class="text-brand-danger">*</span>
            </label>

            <input autocomplete="new-password"
                class="w-full outline-none h-10 focus:border-brand-info text-sm border border-gray-300 rounded p-4 pr-12"
                :readonly="resetPasswordLoading || authLoading" @input="validateNewPassword" type="password"
                id="newPassword" v-model="form.newPassword" :class="{ '!border-brand-danger': errors.newPassword.show }
                    ">

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

            <input autocomplete="new-password" :readonly="resetPasswordLoading || authLoading"
                @input="validateConfirmPassword"
                class="w-full outline-none h-10 focus:border-brand-info text-sm border border-gray-300 rounded p-4 pr-12"
                type="password" id="confirmPassword" v-model="form.confirmPassword" :class="{ '!border-brand-danger': errors.confirmPassword.show }
                    ">

            <span class="text-brand-danger text-xs mt-1" v-show="errors.confirmPassword.show">
                {{ errors.confirmPassword.message }}
            </span>
        </div>
        <!--end confirm password field area-->

        <!--start btn submit area-->
        <button
            class="bg-brand-primary mb-6 flex justify-center gap-2 items-center text-white hover:opacity-[0.8] font-bold text-sm rounded w-full h-10 py-1 p-2 uppercase disabled:bg-gray-300 disabled:text-gray-500"
            :disabled="resetPasswordLoading || authLoading" @click="submit()">
            {{ resetPasswordLoading || authLoading ? 'Processando...' : 'Redefinir senha' }}
        </button>
        <!--end btn submit area-->

        <div
            class="relative text-sm mt-3 justify-center w-full pt-4 border-t border-gray-300 left-0 flex items-center gap-1">
            <router-link to="/conta/login" class="text-brand-primary font-semibold">Fazer login</router-link>
        </div>
    </div>
</template>