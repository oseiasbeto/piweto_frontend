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

const openModal = (name, data) => {
    store.dispatch("setModal", {
        show: true,
        name,
        data: data || {}
    })
}
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
        case "pending":
            return "bg-yellow-500"
        case "approved":
            return "bg-green-500"
        case "rejected":
            return "bg-red-500"
        default:
            return 'bg-gray-300'
    }
}
const statusTxtColor = (status) => {
    switch (status) {
        case "pending":
            return "text-yellow-500"
        case "approved":
            return "text-green-500"
        case "rejected":
            return "text-red-500"
        default:
            return 'text-gray-300'
    }
}

const generateStatusLegend = (status) => {
    switch (status) {
        case "pending":
            return "Pendente"
        case "approved":
            return "Pago"
        case "rejected":
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
        page: 1,
        limit: 10,
        event: event.value._id
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
                <p class="text-gray-600 text-center mb-4">Para receber os repasses, adicione uma conta bancária.</p>
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
            <div class="overflow-x-auto">
                <table class="w-full text-sm border-collapse border border-gray-200">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="border border-gray-200 uppercase text-sm font-semibold p-2 text-left">Data</th>
                            <th class="border border-gray-200 uppercase text-sm font-semibold p-2 text-left">Valor</th>
                            <th class="border border-gray-200 uppercase text-sm font-semibold p-2 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody v-if="!loadingPayouts">
                        <tr v-if="!payouts?.data?.length">
                            <td colspan="3" class="text-center text-gray-500 p-4">Nenhum repasse encontrado</td>
                        </tr>
                        <tr v-else v-for="payout in payouts.data || []" :key="payout.id" class="hover:bg-gray-50">
                            <td class="border border-gray-200 p-2">{{ moment(payout.date).format("DD/MM/YYYY") }}</td>
                            <td class="border border-gray-200 p-2">{{ formatAmount(payout.amount) }}</td>
                            <td class="border border-gray-200 p-2">
                                <div class="flex items-center gap-2">
                                    <div class="w-[12px] h-[12px] rounded-full" :class="statusBgColor(payout.status)">
                                    </div>
                                    <p :class="statusTxtColor(payout.status)">{{ generateStatusLegend(payout.status) }}
                                    </p>
                                </div>
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
        </div>
    </section>
</template>