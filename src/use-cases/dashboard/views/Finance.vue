<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import formatAmount from "@/utils/formatAmount";
import Swal from "sweetalert2"
import { usePayouts } from "@/repositories/payouts-repository";
import moment from "moment";
import BtnSpinner from "../components/spinners/BtnSpinner.vue";

const { getPayouts } = usePayouts()

const store = useStore()
const loadingPayouts = ref(false)

const payouts = computed(() => {
    return store.getters.payouts
})

const page = ref(1);
const limit = ref(10); // Valor inicial do limite
const status = ref(null);

const openModal = (name, data) => {
    store.dispatch("setModal", {
        show: true,
        name,
        data: data || {}
    })
}

const performSearch = () => {
    page.value = 1; // Reseta a página ao mudar o limite ou buscar
    fetchPayouts();
};

const handlePrevPage = () => {
    if (payouts.value?.metadata?.hasPrevPage) {
        page.value = payouts.value.metadata.page - 1;
        fetchPayouts();
    }
};

const handleNextPage = () => {
    if (payouts.value?.metadata?.hasNextPage) {
        page.value = payouts.value.metadata.page + 1;
        fetchPayouts();
    }
};


const payout = () => {
    if (!event?.value.data_bank.iban) {
        Swal.fire({
            icon: "warning",
            title: "Conta Bancária Necessária",
            text: "Para solicitar o levantamento, você precisa adicionar uma conta bancária. Adicione uma conta agora para continuar.",
            confirmButtonText: "Adicionar Conta",
            confirmButtonColor: "#6366F1", // Cor roxa para combinar com o design
        }).then((result) => {
            if (result.isConfirmed) {
                openModal("add-bank-account");
            }
        });
    } else {
        openModal("create-payout");
    }

}

const statusBgColor = (status) => {
    switch (status) {
        case "in_transit":
            return "bg-yellow-500"
        case "completed":
            return "bg-green-500"
        case "failed":
            return "bg-red-500"
        default:
            return 'bg-gray-300'
    }
}
const statusTxtColor = (status) => {
    switch (status) {
        case "in_transit":
            return "text-yellow-500"
        case "completed":
            return "text-green-500"
        case "failed":
            return "text-red-500"
        default:
            return 'text-gray-300'
    }
}

const generateStatusLegend = (status) => {
    switch (status) {
        case "in_transit":
            return "Pendente"
        case "completed":
            return "Pago"
        case "failed":
            return "Rejeitado"
    }
}
const event = computed(() => {
    return store.getters.event
})

onMounted(async () => {
    if (event.value._id) {
        fetchPayouts()
    }
})

const fetchPayouts = async () => {
    loadingPayouts.value = true
    await getPayouts({
        page: page.value,
        limit: limit.value,
        event: event.value._id,
        ...(status.value && { status: status.value })
    }).then(res => {
        store.dispatch("setPayouts", res.data)
    }).finally(() => {
        loadingPayouts.value = false
    })
}
// Observa quando `event` muda e chama a função
watch(event, (newEvent) => {
    if (newEvent) {
        fetchPayouts();
    }
});
</script>

<template>
    <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Montante Pendente -->
        <div class="bg-white p-6 rounded-md shadow-md border-t-4 border-red-500">
            <h2 class="text-medium font-medium text-gray-500 mb-4">Montante Pendente</h2>
            <h1 class="text-2xl font-bold text-gray-900">{{ formatAmount(event?.orders_pending_cash || 0) }}</h1>
        </div>

        <!-- Disponível para Repasse -->
        <div class="bg-white p-6 rounded-md shadow-md border-t-4 border-green-500 flex flex-col justify-between">
            <div>
                <h2 class="text-medium font-medium text-gray-500 mb-4">Disponível para levantamento</h2>
                <h1 class="text-2xl font-bold text-gray-900">{{ formatAmount(event?.balance || 0) }}</h1>
            </div>
            <button @click="payout()" :disabled="event?.balance === 0"
                class="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-blue-600 transition disabled:pointer-events-none disabled:bg-gray-300 disabled:text-gray-500">
                Solicitar o levantamento
            </button>
        </div>

        <!-- Adicionar Conta Bancária -->
        <div
            class="bg-white p-6 rounded-md shadow-md border-t-4 border-purple-500 col-span-1 md:col-span-2 flex flex-col items-center">
            <div v-if="!event?.data_bank?.iban">
                <h2 class="text-medium font-medium text-gray-500 mb-4">Adicione sua Conta Bancária</h2>
                <p class="text-gray-600 text-center mb-4">Para receber os levantamentos, adicione uma conta bancária.
                </p>
                <button @click="openModal('add-bank-account')"
                    class="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition disabled:pointer-events-none disabled:bg-gray-300 disabled:text-gray-500">
                    Adicionar Conta Bancária
                </button>
            </div>
            <div v-else class="w-full">
                <h2 class="text-medium font-medium text-gray-700 mb-4">Coordenadas Bancárias</h2>
                <div class="bg-gray-100 p-4 rounded-md w-full text-sm">
                    <p class="text-gray-700"><span class="font-semibold">Banco:</span> {{ event.data_bank.bank_name }}
                    </p>
                    <p class="text-gray-700 mt-1"><span class="font-semibold">IBAN:</span> {{ event.data_bank.iban }}
                    </p>
                    <p class="text-gray-700 mt-1"><span class="font-semibold">Titular:</span> {{
                        event.data_bank.account_holder }}</p>
                </div>
                <button @click="openModal('add-bank-account', event)"
                    class="mt-4 bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition disabled:pointer-events-none disabled:bg-gray-300 disabled:text-gray-500">
                    Atualizar Dados Bancários
                </button>
            </div>
        </div>


        <!-- Histórico de Repasses -->
        <div class="bg-white p-6 rounded-md shadow-md border-t-4 border-gray-500 col-span-1 md:col-span-2">
            <h2 class="text-medium font-medium text-gray-500 mb-4">Histórico de levantamentos</h2>
            <div class="mb-4">
                <div class="lg:max-w-80 w-full">
                    <select v-model="status" @change="performSearch"
                        class="flex h-[40px] w-full text-gray-500 items-center text-sm p-2 overflow-hidden border border-[#dfe0df] rounded-[3px] bg-white focus:outline-none">
                        <option :value="null">Todos levantamentos</option>
                        <option value="completed">Levantamentos activos</option>
                        <option value="in_transit">Levantamentos pendentes</option>
                        <option value="failed">Levantamentos rejeitados</option>
                    </select>
                </div>
            </div>

            <div class="overflow-x-auto mb-4">
                <table class="w-full text-sm border-collapse border border-gray-200">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="border border-gray-200 uppercase text-sm font-semibold p-2 text-left">Status</th>
                            <th class="border border-gray-200 uppercase text-sm font-semibold p-2 text-left">Data</th>
                            <th class="border border-gray-200 uppercase text-sm font-semibold p-2 text-left">Montante
                            </th>
                            <th class="border border-gray-200 uppercase text-sm font-semibold p-2 text-left">Solicitante
                            </th>
                        </tr>
                    </thead>
                    <tbody v-if="!loadingPayouts">
                        <tr v-if="!payouts?.data?.length">
                            <td class="text-gray-500 text-nowrap p-4">Nenhum levantamento encontrado</td>
                        </tr>
                        <tr v-else v-for="payout in payouts.data || []" :key="payout.id" class="hover:bg-gray-50">
                            <td class="border border-gray-200 p-2">
                                <div class="flex items-center gap-2">
                                    <div class="w-[12px] h-[12px] rounded-full" :class="statusBgColor(payout.status)">
                                    </div>
                                    <p :class="statusTxtColor(payout.status)">{{ generateStatusLegend(payout.status) }}
                                    </p>
                                </div>
                            </td>
                            <td class="border border-gray-200 p-2">{{ moment(payout.date).format("DD/MM/YYYY") }}</td>
                            <td class="border border-gray-200 p-2">{{ formatAmount(payout.amount) }}</td>
                            <td class="border border-gray-200 p-2">{{ payout?.user?.full_name || 'Desconhecido(a)' }}
                            </td>

                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr class="w-full">
                            <td class="p-4 mx-auto">
                                <BtnSpinner />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="flex flex-col sm:flex-row items-center justify-between py-4 px-4">
                <!-- Informação de resultados -->
                <div class="flex items-center gap-2 mb-4 sm:mb-0">
                    <p class="text-sm flex-1 text-gray-600">
                        Mostrando
                        <span class="font-medium">{{ payouts?.metadata?.page || 1 }}</span>
                        a
                        <span class="font-medium">{{ payouts?.metadata?.limit || 10 }}</span>
                        de
                        <span class="font-medium">{{ payouts?.metadata?.total || 0 }}</span>
                        resultados
                    </p>

                </div>


                <!-- Controles de paginação -->
                <div class="flex items-center space-x-2">
                    <button @click="handlePrevPage" :disabled="!payouts?.metadata?.hasPrevPage"
                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        :class="{ 'opacity-50 cursor-not-allowed': !payouts?.metadata?.hasPrevPage }">
                        Anterior
                    </button>
                    <select v-model="limit" @change="performSearch"
                        class="block w-auto px-[20px] py-2 text-sm font-medium shrink-0 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none">
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                    </select>
                    <button @click="handleNextPage" :disabled="!payouts?.metadata?.hasNextPage"
                        class="px-4 py-2 text-sm font-medium text-white bg-brand-primary border border-transparent rounded-md focus:outline-none focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        :class="{ 'opacity-50 cursor-not-allowed': !payouts?.metadata?.hasNextPage }">
                        Próximo
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>