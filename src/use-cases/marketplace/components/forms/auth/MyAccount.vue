<script setup>
import { useUsers } from "@/repositories/users-repository.js";
import { computed, onMounted, ref } from "vue"
import { useStore } from "vuex"
import { toast } from "vue3-toastify"
const { updateUser, loading } = useUsers()

const emits = defineEmits(['onclose'])

const form = ref({
    first_name: "",
    last_name: "",
    email: "",
    bio: ""
})

const store = useStore()

const currentUser = computed(() => {
    return store.getters.currentUser
})

const closeModal = () => {
    emits('onclose')
}

const goToForgotPassword = () => {
    store.dispatch("setModal", {
        name: 'forgot-password',
        show: true,
        data: {
        }
    })
}

const submit = async () => {
    await updateUser(form.value).then(() => {
        closeModal()
        toast('Alterações salvas com sucesso!', {
            theme: "colored",
            position: "top-right",
            autoClose: 2500,
            type: 'success'
        })
    })
}

onMounted(() => {
    const user = currentUser.value
    form.value = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        bio: user.bio,
        phone: user.phone
    }
})

</script>

<template>
    <div class="bg-white rounded-sm shadow-md w-full lg:w-80">
        <div class="border-b flex justify-between items-center border-[#dee2e6] p-4">
            <h1 class="font-bold">Minha Conta</h1>
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
            <!--end alert area-->

            <div class="flex mb-5 flex-col">
                <label class="text-xs text-gray-500 mb-2 font-bold" for="email">
                    Primeiro nome
                </label>

                <input autocomplete="off" :readonly="loading" @input="validateEmail" type="text" id="email"
                    v-model="form.first_name"
                    class="outline-none h-10 focus:border-brand-info text-sm border border-gray-300 rounded p-4">
            </div>
            <div class="flex mb-5 flex-col">
                <label class="text-xs text-gray-500 mb-2 font-bold" for="email">
                    Último nome:
                </label>

                <input autocomplete="off" :readonly="loading" @input="validateEmail" type="text" id="email"
                    v-model="form.last_name"
                    class="outline-none h-10 focus:border-brand-info text-sm border border-gray-300 rounded p-4">

            </div>

            <!--start email field area-->
            <div class="flex mb-5 flex-col">
                <label class="text-xs text-gray-500 mb-2 font-bold" for="email">
                    Endereço de email:
                </label>

                <input autocomplete="off" disabled :readonly="loading" @input="validateEmail" type="text" id="email"
                    :value="form.email"
                    class="outline-none h-10 focus:border-brand-info text-sm border disabled:bg-gray-300 disabled:text-gray-500 border-gray-300 rounded p-4">
            </div>
            <!--end email field area-->

            <!--start email field area-->
            <div class="flex mb-5 flex-col">
                <label class="text-xs text-gray-500 mb-2 font-bold" for="email">
                    Telefone:
                </label>

                <input autocomplete="off" disabled :readonly="loading" @input="validateEmail" type="text" id="email"
                    :value="form.phone"
                    class="outline-none h-10 focus:border-brand-info text-sm border disabled:bg-gray-300 disabled:text-gray-500 border-gray-300 rounded p-4">
            </div>
            <!--end email field area-->

            <!--start email field area-->
            <div class="flex mb-5 flex-col">
                <label class="text-xs text-gray-500 mb-2 font-bold" for="email">
                    Bio:
                </label>

                <textarea autocomplete="off" :readonly="loading" @input="validateEmail" type="text" id="email"
                    v-model="form.bio" placeholder="A bio..."
                    class="outline-none h-50 resize-none focus:border-brand-info text-sm border border-gray-300 rounded p-4">
                </textarea>
            </div>
            <!--end email field area-->

            <!--start email field area-->
            <div class="flex mb-5 flex-col">
                <label class="text-xs text-gray-500 mb-2 font-bold" for="email">
                    Palavra-passe:
                </label>
                <button @click="goToForgotPassword()" class="w-min flex-nowrap whitespace-nowrap font-bold text-sm text-[#007bff]">Alterar
                    passe</button>
            </div>
            <!--end email field area-->

            <!--start btn submit area-->
            <button :disabled="loading"
                class="bg-[#007bff] flex justify-center gap-2 items-center text-white hover:opacity-[0.8] font-bold text-sm rounded w-full h-10 py-1 p-2 uppercase disabled:bg-gray-300 disabled:text-gray-500"
                @click="submit()">{{ loading ? 'Salvando...' : 'Salvar' }}</button>
            <!--end btn submit area-->
        </div>

    </div>
</template>