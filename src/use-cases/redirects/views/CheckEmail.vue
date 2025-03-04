<script setup>
import { useRoute, useRouter } from "vue-router";
import { onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useUsers } from "@/repositories/users-repository";

const router = useRouter()
const route = useRoute()
const store = useStore()

const { checkEmail } = useUsers()

const token = route.query.token

onMounted(async () => {
    if (!token) {
        router.replace('/')
    } else {
        await checkEmail(token).then(() => {
            store.dispatch("setToast", {
                show: true,
                message: 'Conta verificada com sucesso',
                type: "success",
                timeout: 2500
            })
            router.replace(`/conta/login`)
        })
            .catch(err => {
                if (err.response.status == 400) {
                    store.dispatch("setToast", {
                        show: true,
                        message: 'Token invalido.',
                        type: "error",
                        timeout: 2500
                    })
                    router.replace('/')
                }
            })
    }
})
</script>

<template>
    <div></div>
</template>