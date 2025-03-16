<script setup>
import { computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import ResetPassword from "../../components/forms/auth/ResetPassword.vue"

const router = useRouter()
const route = useRoute()

const otp = computed(() => {
    return route.query.otp
})

onMounted(() => {
    if (!otp.value) {
        router.replace('/404')
    } else return
})
</script>

<template>
    <div class="lg:w-80 p-4 bg-white lg:shadow-lg my-6 lg:my-12 mx-auto">
        <ResetPassword/>
    </div>
</template>