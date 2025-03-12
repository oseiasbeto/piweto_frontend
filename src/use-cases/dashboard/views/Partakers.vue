<script setup>
import { useTickets } from "@/repositories/tickets-repository";
import moment from "moment";
import { onMounted, ref, computed } from "vue";
import { useStore } from "vuex";
import formatAmount from "@/utils/formatAmount";
const { getTickets, loading: loadingPartakers } = useTickets()

const store = useStore()

const event = computed(() => {
    return store.getters.event
})
const partakers = computed(() => {
    return store.getters.partakers
})

const statusBgColor = (status) => {
    switch (status) {
        case "p":
            return "bg-yellow-500"
        case "a":
            return "bg-green-500"
        case "d":
            return "bg-red-500"
        default:
            return 'bg-gray-300'
    }
}
const statusTxtColor = (status) => {
    switch (status) {
        case "p":
            return "text-yellow-500"
        case "a":
            return "text-green-500"
        case "d":
            return "text-red-500"
        default:
            return 'text-gray-300'
    }
}

const generateStatusLegend = (status) => {
    switch (status) {
        case "p":
            return "Pendente"
        case "a":
            return "Processado"
        case "d":
            return "Cancelado"
    }
}

onMounted(async () => {
    if (partakers.value.hasViewed) {
        loadingPartakers.value = false
    } else {
        
        await getTickets({
            event: event.value._id,
            populate: 'costumer'
        }).then(res => {
            const partakers = res.data.tickets;
            const metadata = res.data.metadata;

            store.dispatch("setPartakers", {
                data: partakers,
                metadata: metadata,
                hasViewed: true
            })
        })
    }
})

</script>

<template>
    <div>
        <div class="bg-white p-4 mb-5 relative overflow-x-auto inline-block w-full shadow-md rounded-md">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead class="text-xs border border-gray-100 text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th class="px-4 py-3">
                            Status
                        </th>
                        <th class="px-4 py-3">
                            Participante
                        </th>
                        <th class="px-4 py-3">
                            Código
                        </th>
                        <th class="px-4 py-3">
                            Preço
                        </th>
                        <th class="px-4 py-3">
                            Nº Reserva
                        </th>
                        <th class="px-4 py-3">
                            Data da Compra
                        </th>
                        <th class="px-4 py-3">
                            Check-in
                        </th>
                    </tr>
                </thead>
                <tbody v-if="!loadingPartakers">
                    <tr v-if="partakers.data.length" v-for="(partaker, index) in partakers.data" :key="partaker._id"
                        class=" bg-white border-b border-gray-100">
                        <td class="px-4 py-3" :class="statusTxtColor(partaker.status)">
                            <div class="flex items-center gap-2">
                                <div class="w-[12px] h-[12px] rounded-full" :class="statusBgColor(partaker.status)"></div>
                                <p>{{ generateStatusLegend(partaker.status) }}</p>
                            </div>

                        </td>
                        <td class="px-4 py-3 text-nowrap text-gray-500">
                            <p>{{ partaker.costumer.full_name }}</p>
                        </td>
                        <td class="px-4 py-3 text-nowrap text-gray-500">
                            <p>{{ partaker.code }}</p>
                        </td>
                        <td class="px-4 py-3 text-nowrap text-gray-500">
                            <p>{{ formatAmount(partaker?.price || 0) }}</p>
                        </td>
                        <td class="px-4 py-3 text-nowrap text-gray-500">
                            <p>{{ partaker.booking_number }}</p>
                        </td>
                        <td class="px-4 py-3 text-nowrap text-gray-500">
                            <p> {{ moment(partaker.created_at).format("DD/MM/YYYY") }}</p>
                        </td>
                        <td class="px-4 py-3 text-nowrap text-gray-500">
                            <p>{{ partaker.check_in.status == 'a' ? 'Realizado' : 'N/Realizado' }}</p>
                        </td>
                    </tr>
                    <tr v-else>
                        <td class="px-4 py-3 text-nowrap">Nenhum participante</td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        Carregando...
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>