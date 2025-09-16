<template>
    <div class="pb-16">
        <div class="bg-white relative inline-block w-full shadow-md rounded-md">
            <div class="p-4">
                <!--start header-->
                <div class="flex gap-3 lg:gap-0 lg:flex-row flex-col items-center justify-between mb-4">
                    <div class="lg:max-w-80 w-full">
                        <DynamicSearch v-model:search="q" :loading="loadingPartakers" @update:search="performSearch" />
                    </div>
                    <div class="flex lg:flex-row flex-col gap-3 w-full lg:w-auto">
                        <div class="lg:max-w-80 w-full">
                            <select v-model="status" @change="performSearch"
                                class="flex h-[40px] w-full text-gray-500 items-center text-sm p-2 overflow-hidden border border-[#dfe0df] rounded-[3px] bg-white focus:outline-none">
                                <option :value="null">Todos participantes</option>
                                <option value="a">Participantes activos</option>
                                <option value="p">Participantes pendentes</option>
                                <option value="d">Participantes cancelados</option>
                            </select>
                        </div>

                        <button @click="generatePDF" :disabled="loadingPartakers || !partakers?.data?.length"
                            class="px-4 py-2 text-sm font-medium text-white bg-brand-primary border border-transparent w-full rounded-md focus:outline-none focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                            Gerar Lista em PDF
                        </button>
                    </div>
                </div>
                <!--end header-->

                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left rtl:text-right text-gray-500">
                        <thead class="text-xs border border-gray-100 text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th class="px-4 py-3">Status</th>
                                <th class="px-4 py-3">Participante</th>
                                <th class="px-4 py-3">Ingresso</th>
                                <th class="px-4 py-3">Preço</th>
                                <th class="px-4 py-3">Nº Reserva</th>
                                <th class="px-4 py-3">Data da Compra</th>
                                <th class="px-4 py-3">Check-in</th>
                            </tr>
                        </thead>
                        <tbody v-if="!loadingPartakers">
                            <tr @click="openPartakerInfo(partaker, index)" v-if="partakers?.data?.length" v-for="(partaker, index) in partakers.data"
                                :key="partaker._id"
                                class="bg-white border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                                <td class="px-4 py-3" :class="statusTxtColor(partaker.status)">
                                    <div class="flex items-center gap-2">
                                        <div class="w-[12px] h-[12px] rounded-full"
                                            :class="statusBgColor(partaker.status)"></div>
                                        <p>{{ generateStatusLegend(partaker.status) }}</p>
                                    </div>
                                </td>
                                <td class="px-4 py-3 text-nowrap text-gray-500">
                                    <p>{{ partaker.costumer.full_name }}</p>
                                </td>
                                <td class="px-4 py-3 text-nowrap text-gray-500">
                                    <p>{{ partaker?.batch?.name }}</p>
                                </td>
                                <td class="px-4 py-3 text-nowrap text-gray-500">
                                    <p>{{ formatAmount(partaker?.price || 0) }}</p>
                                </td>
                                <td class="px-4 py-3 text-nowrap text-gray-500">
                                    <p>{{ partaker.booking_number }}</p>
                                </td>
                                <td class="px-4 py-3 text-nowrap text-gray-500">
                                    <p>{{ moment(partaker.created_at).format("DD/MM/YYYY") }}</p>
                                </td>
                                <td class="px-4 py-3 text-nowrap text-gray-500">
                                    <p>{{ partaker.check_in.status == 'a' ? 'Realizado' : 'N/Realizado' }}</p>
                                </td>
                            </tr>
                            <tr v-else>
                                <td class="px-4 py-3 text-nowrap">Nenhum participante</td>
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
            </div>

            <div>
                <div class="flex flex-col sm:flex-row items-center justify-between py-4 px-4">
                    <!-- Informação de resultados -->
                    <div class="flex items-center gap-2 mb-4 sm:mb-0">
                        <p class="text-sm flex-1 text-gray-600">
                            Mostrando
                            <span class="font-medium">{{ partakers?.metadata?.page || 1 }}</span>
                            a
                            <span class="font-medium">{{ partakers?.metadata?.limit || 10 }}</span>
                            de
                            <span class="font-medium">{{ partakers?.metadata?.total || 0 }}</span>
                            resultados
                        </p>

                    </div>


                    <!-- Controles de paginação -->
                    <div class="flex items-center space-x-2">
                        <button @click="handlePrevPage" :disabled="!partakers?.metadata?.hasPrevPage"
                            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            :class="{ 'opacity-50 cursor-not-allowed': !partakers?.metadata?.hasPrevPage }">
                            Anterior
                        </button>
                        <select v-model="limit" @change="performSearch"
                            class="block w-auto px-[20px] py-2 text-sm font-medium shrink-0 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none">
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                        </select>
                        <button @click="handleNextPage" :disabled="!partakers?.metadata?.hasNextPage"
                            class="px-4 py-2 text-sm font-medium text-white bg-brand-primary border border-transparent rounded-md focus:outline-none focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            :class="{ 'opacity-50 cursor-not-allowed': !partakers?.metadata?.hasNextPage }">
                            Próximo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useTickets } from "@/repositories/tickets-repository";
import moment from "moment";
import { onMounted, ref, computed, watch } from "vue";
import { useStore } from "vuex";
import formatAmount from "@/utils/formatAmount";
import { useRoute } from "vue-router";
import BtnSpinner from "../components/spinners/BtnSpinner.vue";
import DynamicSearch from "../components/dynamics/DynamicSearch.vue";
import { generatePartakersPDF } from "@/utils/generatePartakersPDF";

const { getPartakers, loading: loadingPartakers } = useTickets();

const store = useStore();
const route = useRoute();

const event = computed(() => {
    return store.getters.event;
});

const page = ref(1);
const limit = ref(10); // Valor inicial do limite
const status = ref(null);
const q = ref(null);

const partakers = computed(() => {
    return store.getters.partakers;
});

const statusBgColor = (status) => {
    switch (status) {
        case "p":
            return "bg-yellow-500";
        case "a":
            return "bg-green-500";
        case "d":
            return "bg-red-500";
        default:
            return "bg-gray-300";
    }
};

const statusTxtColor = (status) => {
    switch (status) {
        case "p":
            return "text-yellow-500";
        case "a":
            return "text-green-500";
        case "d":
            return "text-red-500";
        default:
            return "text-gray-300";
    }
};

const generateStatusLegend = (status) => {
    switch (status) {
        case "p":
            return "Pendente";
        case "a":
            return "Activo";
        case "d":
            return "Cancelado";
    }
};

const performSearch = () => {
    page.value = 1; // Reseta a página ao mudar o limite ou buscar
    fetchPartakers();
};

const openPartakerInfo = (partaker, index) => {
    store.dispatch("setModal", {
        show: true,
        name: "partaker-info",
        data: {
            partakerData: partaker,
            partakerIndex: index,
        }
    });
};

const fetchPartakers = async () => {
    await getPartakers({
        eventId: event.value._id,
        page: page.value,
        limit: limit.value,
        status: status.value,
        q: q.value,
    }).then((res) => {
        const partakers = res.data.data;
        const metadata = res.data.pagination;

        store.dispatch("setPartakers", {
            data: partakers,
            metadata: metadata,
            hasViewed: true,
        });
    });
};

const handlePrevPage = () => {
    if (partakers.value?.metadata?.hasPrevPage) {
        page.value = partakers.value.metadata.page - 1;
        fetchPartakers();
    }
};

const handleNextPage = () => {
    if (partakers.value?.metadata?.hasNextPage) {
        page.value = partakers.value.metadata.page + 1;
        fetchPartakers();
    }
};

// Função para gerar o PDF
const generatePDF = () => {
    if (partakers.value?.data?.length) {
        generatePartakersPDF(partakers.value.data, event.value, partakers?.value?.metadata);
    }
};

onMounted(() => {
    if (event?.value?._id) {
        fetchPartakers();
    }
});

// Observa quando `event` muda e chama a função
watch(event, (newEvent) => {
    if (newEvent) {
        fetchPartakers();
    }
});

// Observa quando `limit` muda e chama a função
watch(limit, () => {
    performSearch();
});
</script>