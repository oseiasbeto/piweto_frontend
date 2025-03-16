<script setup>
import { useUsers } from "@/repositories/users-repository.js";
import { computed, onMounted, ref } from "vue"
import { useStore } from "vuex"
import { useRoute, useRouter } from "vue-router"
import { toast } from "vue3-toastify"
import intlTelInput from 'intl-tel-input';
import BtnSpinner from "../../spinners/BtnSpinner.vue";

const { forgotPassword } = useUsers()
const intl = ref({})

const emits = defineEmits(['onSent'])

const form = ref({
    phone: ""
})

const loading = ref(false)

const errors = ref({
    phone: {
        show: false,
        message: "",
        data: ""
    }
})

const route = useRoute()
const router = useRouter()
const store = useStore()

const resetForm = () => {
    form.value = {
        email: ""
    }
}

const hasLogged = computed(() => {
    return store.getters.hasLogged
})

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

const submit = async () => {
    const email = form.value.phone.length
    const error = errors.value.phone.show

    validatePhone()

    if (email && !error) {
        loading.value = true
        await forgotPassword(form.value)
            .then((user) => {

                toast('Código enviado com sucesso!', {
                    theme: "colored",
                    position: "top-right",
                    autoClose: 2000,
                    type: 'success'
                })
                setTimeout(() => {
                    loading.value = false
                    store.dispatch("setUser", user)
                    emits("onSent")
                }, 1500)

            })
            .catch(error => {
                if (error.response.status == 400) {
                    if (error.response.data.message == 'O codigo enviado ainda nao expirou, por favor tente novamente mais tarde!') {
                        toast('Código ainda válido. Aguarde a expiração!', {
                            theme: "colored",
                            position: "top-right",
                            autoClose: 4000,
                            type: 'error'
                        })
                    } else {
                        toast('Nenhum usuário registrado com este número!', {
                            theme: "colored",
                            position: "top-right",
                            autoClose: 2500,
                            type: 'error'
                        })
                    }

                }
                loading.value = false
                resetForm()
            })
    } else return
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
            <h1 class="font-bold text-gray-800 text-xl">Esqueceu sua senha?</h1>

        </div>
        <div class="my-2 mb-4 text-xs text-gray-400">
            Indique o número de telefone da conta que pretende recuperar
        </div>
        <div class="flex flex-col mb-4">
            <div class="flex flex-col">
                <label class="text-xs text-gray-500 mb-2 font-bold" for="phone">Número de telefone <span
                        class="text-brand-danger">*</span></label>
                <input :readonly="loading"
                    class="outline-none w-full h-10 focus:border-brand-info text-sm border border-gray-300 rounded p-4"
                    @input="validatePhone" type="tel" id="phone" autocomplete="off" oncontextmenu="false"
                    v-model="form.phone" :class="{ '!border-brand-danger': errors.phone.show }">

            </div>
            <span class="text-brand-danger text-xs mt-1" v-show="errors.phone.show">
                {{ errors.phone.message }}
            </span>
        </div>



        <div class="w-full mb-6">
            <button :disabled="loading"
                class="bg-brand-primary flex justify-center gap-2 items-center text-white hover:opacity-[0.8] font-bold text-sm rounded w-full h-10 p-2 uppercase disabled:bg-gray-200"
                @click="submit">
                <BtnSpinner v-if="loading" />
                <p v-else>Recuperar</p>
            </button>
        </div>
        <div v-if="!hasLogged"
            class="relative text-sm mt-3 justify-center w-full pt-4 border-t border-gray-300 left-0 flex items-center gap-1">
            <p>Já tens uma conta?</p>
            <router-link to="/conta/login" class="text-brand-primary font-semibold">Login</router-link>
        </div>
    </div>
</template>