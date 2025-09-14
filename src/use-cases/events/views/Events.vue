<script setup>
import { useStaffs } from "@/repositories/staffs-repository"
import { useEvents } from "@/repositories/events-repository"
import { onMounted, ref, computed } from "vue";
import { useStore } from "vuex";
import Swal from "sweetalert2"
import { toast } from "vue3-toastify"
import moment from "moment";
import Spinner from "@/use-cases/checkout/components/ui/Spinner.vue";
import AlertConfirmEmail from "@/components/AlertConfirmEmail.vue";
import DynamicSearch from "@/use-cases/dashboard/components/dynamics/DynamicSearch.vue";
import BtnSpinner from "../components/spinners/BtnSpinner.vue";

const { getStaffs, loading: loadingEvents } = useStaffs()
const { deleteEvent, loading: loadingDeleteEvent } = useEvents()

const store = useStore()

const events = computed(() => {
    return store.getters.myEvents
})
const user = computed(() => {
    return store.getters.currentUser
})

const page = ref(1);
const limit = ref(10); // Valor inicial do limite
const status = ref(null);
const q = ref(null);

// Esta função computada tem como finalidade retornar os dados do usuário logado.
const getCurrentUser = computed(() => {
    return store.getters.currentUser
})

const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
}

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
            return "bg-red-500 text-red-500"
        default:
            return "bg-gray-300 text-gray-300"
    }
}

const performSearch = () => {
    page.value = 1; // Reseta a página ao mudar o limite ou buscar
    fetchStaffs();
};

const handlePrevPage = () => {
    if (events?.value?.metadata?.hasPrevPage) {
        page.value = events?.value?.metadata?.page - 1;
        fetchStaffs();
    }
};

const handleNextPage = () => {
    if (events.value?.metadata?.hasNextPage) {
        page.value = events?.value?.metadata?.page + 1;
        fetchStaffs();
    }
};

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

const fetchStaffs = async () => {
    loadingEvents.value = true;
    await getStaffs({
        page: page.value,
        limit: limit.value,
        member: user?.value?._id,
        ...(status.value && {
            status: status.value
        }),
        q: q.value
    }).then((res) => {
        const data = res?.data?.staffs;
        const metadata = res?.data?.metadata;
        store.dispatch("setMyEvents", {
            data,
            metadata,
            hasViewed: true
        })
    }).finally(() => {
        if (!q.value) {
            window.scrollTo(0, 0)
        }

        loadingEvents.value = false;
    });
};

const _deleteEvent = async (eventId) => {

    await deleteEvent(eventId).then(async () => {
        window.scrollTo(0, 0)
        await fetchStaffs()
        toast('Evento eliminado com sucesso!', {
            theme: "colored",
            position: "top-right",
            autoClose: 2500,
            type: 'success'
        })
    }).finally(() => {
        loadingEvents.value = false
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
            loadingEvents.value = true
            _deleteEvent(eventId)
        }
    })
}

onMounted(async () => {
    if (events?.value?.hasViewed) {
        loadingEvents.value = false
    } else {
        await fetchStaffs();
    }
})
</script>

<template>
    <!--start page my events -->
    <div class="bg-gray-50 min-h-screen">
        <!--start body -->
        <div class="p-6 md:p-[20px] lg:p-8">
            <!--start content result -->
            <div class="data">
                <!--start header content result empty -->
                <div v-if="!user.email" class="mb-4">
                    <AlertConfirmEmail />
                </div>
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

                <div class="flex bg-white rounded-md flex-col overflow-hidden shadow-md p-4">
                    <div class="flex flex-col lg:flex-row items-center justify-between mb-4 gap-4">
                        <div class="lg:max-w-80 w-full">
                            <DynamicSearch v-model:search="q" :loading="loadingEvents" @update:search="performSearch" />
                        </div>
                        <div class="lg:max-w-80 w-full">
                            <select v-model="status" @change="performSearch"
                                class="flex h-[40px] w-full text-gray-500 items-center text-sm p-2 overflow-hidden border border-[#dfe0df] rounded-[3px] bg-white focus:outline-none">
                                <option :value="null">Todos eventos</option>
                                <option value="a">Eventos publicados</option>
                                <option value="p">Eventos pendentes</option>
                                <option value="r">Eventos rejeitados</option>
                            </select>
                        </div>

                    </div>
                    <div class="overflow-x-auto">
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
                            <tbody v-if="!loadingEvents">
                                <tr v-if="events.data.length" v-for="(event, index) in events.data" :key="event._id"
                                    class=" bg-white border-b border-gray-100">
                                    <td class="px-4 py-3 text-gray-500">
                                        <div class="flex items-center gap-2">
                                            <div class="w-[12px] h-[12px] rounded-full bg-green-400"
                                                :class="statusColor(event?.event?.status || 'r')"></div>
                                            <p class="text-sm text-gray-500 !bg-transparent"
                                                :class="statusColor(event?.event?.status || 'r')"> {{
                                                    statusLegends(event?.event?.status || 'r') }}</p>
                                        </div>
                                    </td>

                                    <td class="px-4 py-3 text-nowrap text-gray-500">
                                        <router-link class="hover:underline"
                                            :to="'/gerenciador-de-eventos/pagina-inicial/' + event?.event?.id">{{
                                                truncateText(event?.event?.name || 'Evento', 30)

                                            }}</router-link>
                                    </td>

                                    <td class="px-4 py-3 text-gray-500">
                                        {{ moment(event?.event?.starts_at?.date || null).format("DD/MM/YYYY") }}
                                    </td>

                                    <td class="px-4 py-3 text-gray-500 text-nowrap">
                                        {{ event?.event?.address?.location || "Indefinido" }}
                                    </td>
                                    <td class="px-4 py-3 text-gray-500">
                                        <div
                                            class="h-full w-[130px] relative overflow-hidden flex  text-xs bg-gray-100 rounded-lg font-medium py-[4px] px-2">
                                            <div class="relative z-10 w-full items-center flex justify-between">
                                                <span>{{ event?.event?.tickets_purchased_count }}</span>
                                                <span>{{ event?.event?.tickets_available_count }}</span>
                                            </div>
                                            <span class="absolute top-0 left-0 h-full bg-green-300"
                                                :style="`width: ${calculateProgress(event?.event?.tickets_purchased_count, event?.event?.tickets_available_count)}%`"></span>
                                        </div>
                                    </td>
                                    <td class="px-4 py-3 flex items-center justify-end gap-2 text-gray-500">
                                        <router-link :to="'/gerenciador-de-eventos/pagina-inicial/' + event?.event?.id">
                                            <button
                                                class="border p-[4px] px-[14px] rounded-full text-[12px] border-gray-400 font-medium text-gray-400 uppercase hover:bg-blue-400 hover:border-blue-400 hover:text-white">Gerenciar</button>
                                        </router-link>
                                        <router-link :to="'/eventos/' + event?.event?._id">
                                            <button>Editar</button>
                                        </router-link>

                                        <button @click="confirmDelete(event?.event?._id)">Excluir</button>
                                    </td>
                                </tr>
                                <tr v-else>
                                    <td class="px-4 py-3 text-nowrap">Nenhum evento encotrado</td>
                                </tr>
                            </tbody>
                            <tbody class="w-full" v-else>
                                <tr class="w-full">
                                    <td class="p-4 mx-auto">
                                        <BtnSpinner />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="w-full">
                        <div class="flex flex-col sm:flex-row items-center justify-between py-4 px-4">
                            <!-- Informação de resultados -->
                            <div class="flex items-center gap-2 mb-4 sm:mb-0">
                                <p class="text-sm flex-1 text-gray-600">
                                    Mostrando
                                    <span class="font-medium">{{ events?.metadata?.page || 1 }}</span>
                                    a
                                    <span class="font-medium">{{ events?.metadata?.limit || 10 }}</span>
                                    de
                                    <span class="font-medium">{{ events?.metadata?.total || 0 }}</span>
                                    resultados
                                </p>

                            </div>


                            <!-- Controles de paginação -->
                            <div class="flex items-center space-x-2">
                                <button @click="handlePrevPage" :disabled="!events?.metadata?.hasPrevPage"
                                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    :class="{ 'opacity-50 cursor-not-allowed': !events?.metadata?.hasPrevPage }">
                                    Anterior
                                </button>
                                <select v-model="limit" @change="performSearch"
                                    class="block w-auto px-[20px] py-2 text-sm font-medium shrink-0 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none">
                                    <option value="10">10</option>
                                    <option value="15">15</option>
                                    <option value="20">20</option>
                                    <option value="30">30</option>
                                </select>
                                <button @click="handleNextPage" :disabled="!events?.metadata?.hasNextPage"
                                    class="px-4 py-2 text-sm font-medium text-white bg-brand-primary border border-transparent rounded-md focus:outline-none focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    :class="{ 'opacity-50 cursor-not-allowed': !events?.metadata?.hasNextPage }">
                                    Próximo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--end content result -->
        </div>
        <!--end body -->
    </div>
    <!--end page my events -->

</template>