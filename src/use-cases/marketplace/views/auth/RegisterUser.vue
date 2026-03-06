<script setup>
import SignupForm from "../../components/forms/auth/SignupForm.vue"
import { ref } from "vue"
import CheckOTPPhone from "../../components/forms/auth/CheckOTPPhone.vue"
import Logo from "@/components/Logo.vue";
const isRegistred = ref(false)

const onRegistred = () => {
    window.scrollTo(0, 0)
    isRegistred.value = true
}
</script>

<template>
    <div class="lg:w-80 p-4 bg-white my-6 lg:my-12 mx-auto">
        <div class="flex justify-center mb-6">
            <Logo size="w-[84px] ml-[-4px] lg:ml-0 lg:w-[100px]" />
        </div>
        <SignupForm v-if="!isRegistred" @onregistred="onRegistred" />
        <CheckOTPPhone v-else />
    </div>

</template>