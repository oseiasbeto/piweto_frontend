<script setup>
import { useRoute, useRouter } from "vue-router";
import { onMounted, computed } from "vue";
import { useStore } from "vuex";
import { useStaffs } from "@/repositories/staffs-repository";

const router = useRouter()
const route = useRoute()
const store = useStore()

const { toggleStatus } = useStaffs()

const token = route.query.token
const status = route.params.status

const hasLogged = computed(() => {
    return store.getters.hasLogged
})

onMounted(async () => {
    if (!token) {
        router.replace('/')
    } else if (!['aceitar', 'rejeitar'].includes(status)) {
        router.replace('/')
    } else {
        if (!hasLogged.value) {
            router.replace(`/conta/login?r=${route.fullPath}`)
        } else {
            await toggleStatus({
                token,
                status: status == 'aceitar' ? 'accepted' : 'rejected'
            }).then(() => {
                store.dispatch("setToast", {
                    show: true,
                    message: `Convite ${status == 'aceitar' ? 'aceito' : 'rejeitado'} com sucesso.`,
                    type: "success",
                    timeout: 2500
                })
                store.dispatch("resetMyEvents")
                if(status == 'aceitar') {
                    router.replace('/eventos/meus-eventos')
                } else {
                    router.replace('/')
                }
            })
            .catch(err => {
                if (err.response.status == 400) {   
                    store.dispatch("setToast", {
                        show: true,
                        message: 'Convite invalido.',
                        type: "error",
                        timeout: 2500
                    })
                    router.replace('/')
                 }
            })
        }
    }

})
</script>

<template>
    <div></div>
</template>