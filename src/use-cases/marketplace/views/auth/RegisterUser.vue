<script setup>
import SignupForm from "../../components/forms/auth/SignupForm.vue"
import { ref } from "vue"
const isRegistred = ref(false)

const onRegistred = () => {
    window.scrollTo(0, 0)
    isRegistred.value = true
}
</script>

<template>
    <div class="lg:w-80 p-4 bg-white lg:shadow-lg my-6 lg:my-12 mx-auto">
        <SignupForm v-if="!isRegistred" @onregistred="onRegistred" />
        <div v-else>
            <div class="w-12 h-12 mx-auto bg-[#e7f8eb] rounded-full flex justify-center items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" viewBox="0 0 24 24" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M9.9647 14.9617L17.4693 7.44735L18.5307 8.50732L9.96538 17.0837L5.46967 12.588L6.53033 11.5273L9.9647 14.9617Z"
                        fill="#2d9f46" />
                </svg>
            </div>
            <h1 class="text-[#36C055] py-4 text-center text-2xl">Conta registrada com sucesso!</h1>
            <p class="text-[#ACB0B9] mb-5 text-center text-xs leading-6">Obrigado por se registrar no Piweto! Para garantir a segurança
                da sua conta, enviamos um link de
                verificação para o e-mail.
                <br />
                <br />
                Por favor, acesse seu e-mail e clique no link de verificação para ativar sua conta. 
            </p>
        </div>
    </div>

</template>