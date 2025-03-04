<script setup>
import { useStaffs } from "@/repositories/staffs-repository"
import { onMounted, ref, computed } from "vue";
import { useStore } from "vuex";
import Swal from "sweetalert2"

const { getStaffs, loading: loadingEvents } = useStaffs()

const store = useStore()

const events = computed(() => {
    return store.getters.myEvents
})
const user = computed(() => {
    return store.getters.currentUser
})

const deleteEvent = (eventId) => {
    console.log(eventId)
}

const confirmDelete = (eventId) => {
    Swal.fire({
        title: "Você tem certeza?",
        text: "you won't able revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, eu tenho",
        cancelButtonText: "Cancelar",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            deleteEvent(eventId)
        }
    })
}

onMounted(async () => {
    if (events?.value?.hasViewed) {
        loadingEvents.value = false
    } else {
        await getStaffs({
            page: 1,
            limit: 10,
            member: user?.value?._id
        }).then((res) => {
            const data = res?.data?.staffs;
            const metadata = res?.data?.metadata;
            store.dispatch("setMyEvents", {
                data,
                metadata,
                hasViewed: true
            })
        })
    }
})
</script>

<template>
    <div>
        <h1>Novo evento</h1>
        <ul class="flex items-center gap-1.5">
            <li>
                <router-link to="/eventos/novo-evento?tipo=presencial">Presencial</router-link>
            </li>
        </ul>
    </div>
    <div>
        <h1>My Events</h1>
        <div v-if="!loadingEvents">
            <ul v-if="events?.data?.length">
                <li v-for="staff in events?.data" :key="staff?._id">
                    <router-link :to="`/gerenciador-de-eventos/pagina-inicial/${staff?.event?.id}?tab=status`">
                        {{ staff?.event?.name }}
                    </router-link>
                    <button @click="confirmDelete()">Eliminar</button>
                </li>
            </ul>
        </div>
        <div v-else>
            <p>Carregando...</p>
        </div>

    </div>

</template>