<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import formatAmount from "@/utils/formatAmount";

const store = useStore()
const event = computed(() => {
    return store.getters.event
})
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
                <h2 class="text-medium font-medium text-gray-500 mb-4">Disponível para Repasse</h2>
                <h1 class="text-2xl font-bold text-gray-900">{{ formatAmount(event?.balance || 0) }}</h1>
            </div>
            <button disabled class="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-blue-600 transition disabled:pointer-events-none disabled:bg-gray-300 disabled:text-gray-500">
                Solicitar o Repasse
            </button>
        </div>

        <!-- Adicionar Conta Bancária -->
        <div
            class="bg-white p-6 rounded-md shadow-md border-t-4 border-purple-500 col-span-1 md:col-span-2 flex flex-col items-center">
            <h2 class="text-medium font-medium text-gray-500 mb-4">Adicione sua Conta Bancária</h2>
            <p class="text-gray-600 text-center mb-4">Para receber os repasses, adicione uma conta bancária.</p>
            <button disabled class="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition disabled:pointer-events-none disabled:bg-gray-300 disabled:text-gray-500">
                Adicionar Conta Bancária
            </button>
        </div>

        <!-- Histórico de Repasses -->
        <div class="bg-white p-6 rounded-md shadow-md border-t-4 border-gray-500 col-span-1 md:col-span-2">
            <h2 class="text-medium font-medium text-gray-500 mb-4">Histórico de Repasses</h2>
            <div class="overflow-x-auto">
                <table class="w-full border-collapse border border-gray-200">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="border border-gray-200 p-2 text-left">Data</th>
                            <th class="border border-gray-200 p-2 text-left">Valor</th>
                            <th class="border border-gray-200 p-2 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="repasse in event?.payouts || []" :key="repasse.id" class="hover:bg-gray-50">
                            <td class="border border-gray-200 p-2">{{ formatDate(repasse.date) }}</td>
                            <td class="border border-gray-200 p-2">{{ formatAmount(repasse.amount) }}</td>
                            <td class="border border-gray-200 p-2">
                                <span :class="repasse.status === 'Pago' ? 'text-green-600' : 'text-yellow-600'">
                                    {{ repasse.status }}
                                </span>
                            </td>
                        </tr>
                        <tr v-if="!event?.payouts || event.payouts.length === 0">
                            <td colspan="3" class="text-center text-gray-500 p-4">Nenhum repasse encontrado</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </section>
</template>