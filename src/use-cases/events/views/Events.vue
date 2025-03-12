<script setup>
import { useStaffs } from "@/repositories/staffs-repository"
import { useEvents } from "@/repositories/events-repository"
import { onMounted, ref, computed } from "vue";
import { useStore } from "vuex";
import Swal from "sweetalert2"
import { toast } from "vue3-toastify"
import moment from "moment";
import Spinner from "@/use-cases/checkout/components/ui/Spinner.vue";

const { getStaffs, loading: loadingEvents } = useStaffs()
const { deleteEvent, loading: loadingDeleteEvent } = useEvents()

const store = useStore()

const events = computed(() => {
    return store.getters.myEvents
})
const user = computed(() => {
    return store.getters.currentUser
})

// Esta função computada tem como finalidade retornar os dados do usuário logado.
const getCurrentUser = computed(() => {
    return store.getters.currentUser
})
const calculateProgress = (purchased, available) => {
    if (available === 0) return 0; // Evita divisão por zero
    return ((purchased / available) * 100).toFixed(2);
}

// Esta função tem como finalidade retornar uma classe dinâmica para um status.
function statusColor(status) {
    switch (status) {
        case "a":
            return "bg-green-400 text-green-400"
        case "p":
            return "bg-yellow-300 text-yellow-300"
        case "r":
            return "bg-red-500 text-yellow-500"
        default:
            return "bg-gray-300 text-gray-300"
    }
}

// Esta função tem como finalidade retornar uma legenda dinâmica para um status.
function statusLegends(status) {
    switch (status) {
        case "a":
            return "Publicado"
        case "p":
            return "Pendente"
        case "r":
            return "Rejeitado"
        default:
            return "Indefinido"
    }
}

const _deleteEvent = async (eventId) => {
    await deleteEvent(eventId).then(async () => {
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
            toast('Evento eliminado com sucesso!', {
                theme: "colored",
                position: "top-right",
                autoClose: 2500,
                type: 'success'
            })
        })
    })
}

const confirmDelete = (eventId) => {
    Swal.fire({
        title: "Você tem certeza?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, eu tenho",
        cancelButtonText: "Cancelar",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            _deleteEvent(eventId)
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
    <!--start page my events -->
    <div class="bg-gray-50 min-h-screen">
        <!--start body -->
        <div class="p-6 md:p-[20px] lg:p-8">

            <!--start content loading -->
            <div v-if="loadingEvents" class="flex justify-center items-center h-[500px]">
                <Spinner />
            </div>
            <!--end content loading -->

            <!--start content result -->
            <div v-else class="data">
                <!--start header content result empty -->
                <div class="w-full mt-2 mb-8 px-8 bg-white rounded-md shadow-md py-4">
                    <div>
                        <div class="mb-4">
                            <h1 class="font-bold text-gray-700 text-[20px]">Olá,
                                {{ getCurrentUser.full_name }}</h1>
                            <p class="font-medium text-gray-500">Já publicou o seu evento?</p>
                        </div>
                        <div class="flex flex-col lg:flex-row items-center gap-4">
                            <router-link
                                class="border border-brand-primary bg-brand-primary w-full text-[12px] font-medium text-white uppercase rounded-full py-[7px] px-4 hover:bg-green-500 text-center lg:w-auto"
                                :to="{
                                    path: '/eventos/novo-evento',
                                    query: {
                                        tipo: 'presencial'
                                    }
                                }">
                                Criar novo
                                evento
                            </router-link>
                        </div>
                    </div>
                </div>
                <!--end header content result empty -->

                <div v-if="events.data.length" class="flex flex-wrap overflow-x-scroll lg:overflow-x-hidden">
                    <table class="w-full text-sm text-left border border-gray-100">
                        <thead class="text-xs border-b border-gray-100 text-gray-500 uppercase bg-gray-50">
                            <tr>
                                <th class="px-4 py-3">
                                    Status
                                </th>
                                <th class="px-4 py-3">
                                    Evento
                                </th>
                                <th class="px-4 py-3">
                                    Quando
                                </th>
                                <th class="px-4 py-3">
                                    Onde
                                </th>
                                <th class="px-4 py-3">
                                    Ingressos
                                </th>

                                <th class="px-4 py-3">

                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(event, index) in events.data" :key="event._id"
                                class=" bg-white border-b border-gray-100">
                                <td class="px-4 py-3 text-gray-500">
                                    <div class="flex items-center gap-2">
                                        <div class="w-[12px] h-[12px] rounded-full bg-green-400"
                                            :class="statusColor(event.event.status)"></div>
                                        <p class="text-sm text-gray-500 !bg-transparent"
                                            :class="statusColor(event.event.status)"> {{
                                                statusLegends(event.event.status) }}</p>
                                    </div>

                                </td>
                                <td class="px-4 py-3 text-nowrap text-gray-500">
                                    <router-link class="hover:underline" :to="'/gerenciador-de-eventos/pagina-inicial/' + event.event.id">{{
                                        event.event.name
                                        }}</router-link>
                                </td>
                                <td class="px-4 py-3 text-gray-500">
                                    {{ moment(event.event.starts_at.date).format("DD/MM/YYYY")  }}
                                </td>

                                <td class="px-4 py-3 text-gray-500 text-nowrap">
                                    {{ event.event.address?.location || "Indefinido" }}
                                </td>
                                <td class="px-4 py-3 text-gray-500">
                                    <div
                                        class="h-full w-[130px] relative overflow-hidden flex  text-xs bg-gray-100 rounded-lg font-medium py-[4px] px-2">
                                        <div class="relative z-10 w-full items-center flex justify-between">
                                            <span>{{ event.event.tickets_purchased_count }}</span>
                                            <span>{{ event.event.tickets_available_count }}</span>
                                        </div>
                                        <span class="absolute top-0 left-0 h-full bg-green-300" :style="`width: ${calculateProgress(event.event.tickets_purchased_count, event.event.tickets_available_count)}%`"></span>
                                    </div>
                                </td>
                                <td class="px-4 py-3 flex items-center justify-end gap-2 text-gray-500">
                                    <router-link
                                        :to="'/gerenciador-de-eventos/pagina-inicial/' + event.event.id">
                                        <button
                                            class="border p-[4px] px-[14px] rounded-full text-[12px] border-gray-400 font-medium text-gray-400 uppercase hover:bg-blue-400 hover:border-blue-400 hover:text-white">Gerenciar</button>
                                    </router-link>
                                    <router-link :to="'/eventos/' + event.event._id">
                                        <button>Editar</button>
                                    </router-link>

                                    <button @click="confirmDelete(event.event._id)">Excluir</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!--start footer content result empty -->
                <div v-else class="no-events">
                    <div class="w-full mt-2 mb-8 px-8 bg-white rounded-md shadow-md py-4">
                        <div>
                            <div class="mb-4 text-center">
                                <h5 class="font-medium text-gray-600 my-4">
                                    Publique um evento pela primeira vez!
                                </h5>
                                <p class="text-gray-500 text-sm">
                                    Você tem total autonomia para cadastrar, gerenciar e acompanhar<br /> todas as
                                    informações de seu evento.
                                </p>
                            </div>
                            <div class="flex flex-col justify-center lg:flex-row items-center gap-4">
                                <a class="w-full mb-3 lg:w-auto" href="https://www.youtube.com/channel/piwetoapp"
                                    target="_blank">
                                    <button
                                        class="w-full text-sm font-bold text-[#0097ff] rounded-full py-[7px] hover:opacity-[0.6] px-4 flex-1">
                                        Precisas de ajuda para criar?
                                    </button>
                                </a>

                            </div>
                        </div>
                    </div>
                </div>
                <!--end footer content result empty -->
            </div>
            <!--end content result -->
        </div>
        <!--end body -->
    </div>
    <!--end page my events -->

</template>