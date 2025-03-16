<script setup>
import { ref } from "vue";
import ForgotPassword from "../../components/forms/auth/ForgotPassword.vue";
import CheckOTPPassword from "../../components/forms/auth/CheckOTPPassword.vue";

const isSent = ref(false)
const onSended = () => {
    isSent.value = true
}
</script>

<template>
    <div class="lg:w-80 p-4 bg-white lg:shadow-lg my-6 lg:my-12 mx-auto">
        <ForgotPassword v-if="!isSent" @on-sent="onSended()"/>
        <CheckOTPPassword v-else/>
    </div>
</template>