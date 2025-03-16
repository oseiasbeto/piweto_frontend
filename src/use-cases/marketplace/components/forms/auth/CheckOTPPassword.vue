<script setup>
import { computed, ref } from 'vue';
import BtnSpinner from '../../spinners/BtnSpinner.vue';
import { toast } from "vue3-toastify"
import { useUsers } from "@/repositories/users-repository";
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

// Estados reativos
const form = ref({
    otp: '',
});

const store = useStore()
const router = useRouter()

const { checkOTPPassword } = useUsers()

const errors = ref({
    otp: {
        show: false,
        message: 'Por favor, insira o código OTP.',
    },
});

const resetForm = () => {
    form.value = {
        otp: ''
    }
}
const loading = ref(false)

const currentUser = computed(() => {
    return store.getters.currentUser
})

const validateOTP = () => {
    if (!form.value.otp) {
        errors.value.otp.show = true;
        errors.value.otp.message = 'Por favor, insira o código OTP.';
    } else {
        errors.value.otp.show = false;
    }
};

const submitOTP = async () => {
    validateOTP();
    if (!errors.value.otp.show) {
        loading.value = true
        await checkOTPPassword(form.value.otp)
            .then((otp) => {
                toast('Código válido!', {
                    theme: "colored",
                    position: "top-right",
                    autoClose: 2000,
                    type: 'success'
                })

                setTimeout(() => {
                    loading.value = false
                    router.push(`/conta/redefinir-senha?otp=${otp}`)
                }, 1500)
            })
            .catch(() => {
                loading.value = false
                resetForm()
                toast('Código inválido!', {
                    theme: "colored",
                    position: "top-right",
                    autoClose: 2500,
                    type: 'error'
                })
            })
    }
};

const resendOTP = () => {
    loading.value = true;
    setTimeout(() => {
        loading.value = false
        toast('Código reenviado com sucesso!', {
            theme: "colored",
            position: "top-right",
            autoClose: 1100,
            type: 'success'
        })
    }, 1500)
};
</script>

<template>
    <div class="w-auto">
        <div class="flex items-center mb-8 justify-center">
            <h1 class="font-bold text-gray-800 text-xl">Conclua verificando seu número.</h1>
        </div>
        <div class="my-2 mb-4 text-xs text-gray-400">
            Foi enviado um código de verificação para {{ currentUser.phone }}
        </div>
        <div class="flex flex-col mb-4">
            <div class="flex flex-col">
                <label class="text-xs text-gray-500 mb-2 font-bold" for="otp">Código OTP <span
                        class="text-brand-danger">*</span></label>
                <input :readonly="loading"
                    class="outline-none w-full h-10 focus:border-brand-info text-sm border border-gray-300 rounded p-4"
                    placeholder="Escreva o código" @input="validateOTP" type="text" id="otp" autocomplete="off"
                    oncontextmenu="false" v-model="form.otp" :class="{ '!border-brand-danger': errors.otp.show }">

            </div>
            <span class="text-brand-danger text-xs mt-1" v-show="errors.otp.show">
                {{ errors.otp.message }}
            </span>
        </div>

        <div class="w-full mb-6">
            <button :disabled="loading"
                class="bg-brand-primary flex justify-center gap-2 items-center text-white hover:opacity-[0.8] font-bold text-sm rounded w-full h-10 p-2 uppercase disabled:bg-gray-200"
                @click="submitOTP">
                <BtnSpinner v-if="loading" />
                <p v-else>Verificar</p>
            </button>
        </div>

        <div
            class="relative text-sm mt-3 justify-center w-full pt-4 border-t border-gray-300 left-0 flex items-center gap-1">
            <p>Não recebeu o código?</p>
            <button :disabled="loading" @click="resendOTP" class="text-brand-primary font-semibold">Reenviar
                código</button>
        </div>
    </div>
</template>
