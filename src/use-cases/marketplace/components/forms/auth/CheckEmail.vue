<script setup>
import { computed, ref } from 'vue';
import BtnSpinner from '../../spinners/BtnSpinner.vue';
import { toast } from "vue3-toastify"
import Swal from "sweetalert2"
import { useUsers } from "@/repositories/users-repository";
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

// Estados reativos
const form = ref({
    email: '',
});

const store = useStore()
const router = useRouter()

const { checkEmail, loading } = useUsers()

const errors = ref({
    email: {
        show: false,
        message: 'Por favor, insira o código OTP.',
    },
});

const resetForm = () => {
    form.value = {
        email: ''
    }
}

const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.value.email) {
        errors.value.email.show = true;
        errors.value.email.message = 'Por favor, insira um e-mail.';
    } else if (!emailRegex.test(form.value.email)) {
        errors.value.email.show = true;
        errors.value.email.message = 'Por favor, insira um e-mail válido.';
    } else {
        errors.value.email.show = false;
    }
};


const sendEmail = async () => {
    validateEmail();
    if (!errors.value.email.show) {
        loading.value = true
        await checkEmail(form.value.email)
            .then(() => {
                Swal.fire({
                    icon: "success",
                    title: "Verifique seu e-mail!",
                    text: "Enviamos um código de confirmação para o seu e-mail. Acesse sua caixa de entrada e siga as instruções para concluir a verificação.",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#6366F1",
                }).then(() => {
                    router.replace('/')
                })
            })
            .catch((err) => {
                resetForm()
                if (err.response.data.message === 'Já existe um código enviado recentemente. Aguarde antes de solicitar um novo.') {
                    toast('Já enviamos um código. Aguarde para solicitar outro!', {
                        theme: "colored",
                        position: "top-right",
                        autoClose: 2500,
                        type: 'error'
                    })
                }

            })
    }
};

</script>

<template>
    <div class="w-auto">
        <div class="flex items-center mb-8 justify-center">
            <h1 class="font-bold text-gray-800 text-xl">Cadastre seu E-mail para Receber Notificações</h1>
        </div>
        <div class="my-2 mb-4 text-xs text-gray-400">
            Receba notificações sobre suas compras e vendas de ingressos!
        </div>
        <div class="flex flex-col mb-4">
            <div class="flex flex-col">
                <label class="text-xs text-gray-500 mb-2 font-bold" for="otp">E-mail <span
                        class="text-brand-danger">*</span></label>
                <input :readonly="loading"
                    class="outline-none w-full h-10 focus:border-brand-info text-sm border border-gray-300 rounded p-4"
                    placeholder="Ex: meuemail@gmail.com" @input="validateEmail" type="text" id="otp" autocomplete="off"
                    oncontextmenu="false" v-model="form.email" :class="{ '!border-brand-danger': errors.email.show }">

            </div>
            <span class="text-brand-danger text-xs mt-1" v-show="errors.email.show">
                {{ errors.email.message }}
            </span>
        </div>

        <div class="w-full mb-6">
            <button :disabled="loading"
                class="bg-brand-primary flex justify-center gap-2 items-center text-white hover:opacity-[0.8] font-bold text-sm rounded w-full h-10 p-2 uppercase disabled:bg-gray-200"
                @click="sendEmail">
                <BtnSpinner v-if="loading" />
                <p v-else>Cadastrar</p>
            </button>
        </div>

        <div
            class="relative text-sm mt-3 justify-center w-full pt-4 border-t border-gray-300 left-0 flex items-center gap-1">
            <button @click="router.back()" class="text-brand-primary font-semibold">Voltar</button>
        </div>
    </div>
</template>
