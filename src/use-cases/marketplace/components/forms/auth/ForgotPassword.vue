<script setup>
import { useUsers } from "@/repositories/users-repository.js";
import { ref } from "vue"
import { useStore } from "vuex"
import { useRoute, useRouter } from "vue-router"
import Alert from "../../ui/Alert.vue";

const { forgotPassword, loading } = useUsers()

const alert = ref({
    show: false,
    status: "",
    message: ""
})

const emits = defineEmits(['onclose'])

const form = ref({
    email: ""
})

const isSent = ref(false)

const errors = ref({
    email: {
        show: false,
        message: "",
        data: ""
    }
})

const route = useRoute()
const router = useRouter()

const resetForm = () => {
    form.value = {
        email: ""
    }
}

const closeModal = () => {
    emits('onclose')
}

const validateEmail = () => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (form.value.email == "") {
        errors.value.email = {
            show: true,
            message: "Este campo é obrigatório."
        }
    } else if (!regex.test(form.value.email)) {
        errors.value.email = {
            show: true,
            message: "Por favor, digite um e-mail válido."
        }
    } else {
        errors.value.email = {
            show: false,
            message: ""
        }
    }
}

const closeAlert = () => {
    alert.value = {
        show: false,
        type: "success",
        showBtnClose: true,
        message: ""
    }
}

const submit = async () => {
    const email = form.value.email.length
    const error = errors.value.email.show
    validateEmail()

    if (email && !error) {
        await forgotPassword(form.value)
            .then(() => {
                isSent.value = true
                alert.value = {
                    show: true,
                    type: "success",
                    showBtnClose: false,
                    message: "Você receberá um e-mail com as instruções para definir uma nova senha. Caso não tenha recebido, verifique sua caixa de Spam"
                }
            })
            .catch(error => {
                if (error.response.status == 400) {
                    alert.value = {
                        show: true,
                        showBtnClose: true,
                        message: error.response.data.message,
                        type: "error"
                    }
                    resetForm()
                }
            })
    } else return
}

</script>

<template>
    <div class="bg-white rounded-sm shadow-md w-full lg:w-80">
        <div class="border-b flex justify-between items-center border-[#dee2e6] p-4">
            <h1 class="font-bold"> {{ isSent ? 'E-mail enviado' : 'Recuperar senha' }}</h1>
            <button @click="closeModal"
                class="bg-transparent opacity-80 hover:opacity-100 outline-none w-6 h-6 flex justify-center items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none">
                    <g clip-path="url(#clip0_429_11083)">
                        <path d="M7 7.00006L17 17.0001M7 17.0001L17 7.00006" stroke="#292929" stroke-width="2.5"
                            stroke-linecap="round" stroke-linejoin="round" />
                    </g>
                    <defs>
                        <clipPath id="clip0_429_11083">
                            <rect width="24" height="24" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
            </button>
        </div>

        <div class="w-full p-4">
            <!--start alert area-->
            <div class="mb-3">
                <alert @onclose="closeAlert" :show-btn-close="alert.showBtnClose" :show="alert.show" :message="alert.message" :type="alert.type" />
            </div>

            <!--end alert area-->

            <!--start email field area-->
            <div v-show="!isSent" class="flex mb-5 flex-col">
                <label class="text-xs text-gray-500 mb-2 font-bold" for="email">
                    E-mail
                    <span class="text-brand-danger">*</span>
                </label>

                <input autocomplete="off" :readonly="loading" @input="validateEmail" type="text" id="email"
                    v-model="form.email"
                    class="outline-none h-10 focus:border-brand-info text-sm border border-gray-300 rounded p-4" :class="{ '!border-brand-danger': errors.email.show }
                        ">

                <span class="text-brand-danger text-xs mt-1" v-show="errors.email.show">
                    {{ errors.email.message }}
                </span>
            </div>
            <!--end email field area-->

            <!--start btn submit area-->
            <button :disabled="loading" v-show="!isSent"
                class="bg-[#007bff] flex justify-center gap-2 items-center text-white hover:opacity-[0.8] font-bold text-sm rounded w-full h-10 py-1 p-2 uppercase disabled:bg-gray-300 disabled:text-gray-500"
                @click="submit()">{{ loading ? 'Enviando...' : 'Enviar e-mail' }}</button>
            <!--end btn submit area-->
        </div>

    </div>
</template>