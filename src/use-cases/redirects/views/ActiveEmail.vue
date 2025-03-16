<script setup>
import { useRoute, useRouter } from "vue-router";
import { onMounted, computed } from "vue";
import { toast } from "vue3-toastify"
import { useStore } from "vuex";
import { useUsers } from "@/repositories/users-repository";

const router = useRouter()
const route = useRoute()
const store = useStore()

const { activeEmail } = useUsers()

const token = route.query.token

onMounted(async () => {
    if (!token) {
        router.replace('/')
    } else {
        await activeEmail(token).then((res) => {

            toast('Email verificada com sucesso', {
                theme: "colored",
                position: "top-right",
                autoClose: 2500,
                type: 'success'
            })
            const email = res.data.user.check_email
            store.dispatch("updateUser", {
                email
            })

            setTimeout(() => {
                router.replace(`/`)
            }, 1500)
        })
            .catch(err => {
                if (err.response.status == 400) {
                    toast('Token invalido.', {
                        theme: "colored",
                        position: "top-right",
                        autoClose: 2500,
                        type: 'error'
                    })
                    setTimeout(() => {
                        router.replace(`/`)
                    }, 1500)
                }
            })
    }
})
</script>

<template>
    <div></div>
</template>