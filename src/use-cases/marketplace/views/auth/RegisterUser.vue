<script setup>
import SignupForm from "../../components/forms/auth/SignupForm.vue"
import { ref } from "vue"
import CheckOTPPhone from "../../components/forms/auth/CheckOTPPhone.vue"
const isRegistred = ref(false)

const onRegistred = () => {
    window.scrollTo(0, 0)
    isRegistred.value = true
}
</script>

<template>
    <div class="lg:w-80 p-4 bg-white lg:shadow-lg my-6 lg:my-12 mx-auto">
        <SignupForm v-if="!isRegistred" @onregistred="onRegistred" />
        <CheckOTPPhone v-else/>
    </div>

</template>