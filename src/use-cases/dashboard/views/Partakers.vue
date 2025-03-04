<script setup>
import { useTickets } from "@/repositories/tickets-repository";
import { onMounted, ref, computed } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
const { getTickets, loading: loadingTickets } = useTickets()

const store = useStore()
const route = useRoute()

const event = computed(() => {
    return store.getters.event
})
const tickets = computed(() => {
    return store.getters.tickets
})

const statusBgColor = (status) => {
    switch (status) {
        case "pending":
            return "bg-yellow-500"
        case "valid":
            return "bg-green-500"
        case "invalid":
            return "bg-red-500"
        default:
            return 'bg-gray-300'
    }
}
const statusTxtColor = (status) => {
    switch (status) {
        case "pending":
            return "text-yellow-500"
        case "valid":
            return "text-green-500"
        case "invalid":
            return "text-red-500"
        default:
            return 'text-gray-300'
    }
}

const generateStatusLegend = (status) => {
    switch (status) {
        case "pending":
            return "Pendente"
        case "valid":
            return "Processado"
        case "invalid":
            return "Cancelado"
    }
}

onMounted(async () => {
    if (tickets.value.hasViewed) {
        loadingTickets.value = false
    } else {
        await getTickets({
            event: event._id,
            populate: 'costumer'
        }).then(res => {
            const tickets = res.data.tickets;
            const metadata = res.data.metadata;

            store.dispatch("setTickets", {
                data: tickets,
                metadata: metadata,
                hasViewed: true
            })
        })
    }
})

</script>

<template>
    <div>
        <table class="w-full text-sm text-left border border-gray-100">
            <thead class="text-xs border-b border-gray-100 text-gray-500 uppercase bg-gray-50">
                <tr>
                    <th class="px-4 py-3">
                        Status
                    </th>
                    <th class="px-4 py-3">
                        Participante
                    </th>
                    <th class="px-4 py-3">
                        Codigo
                    </th>
                    <th class="px-4 py-3">
                        ID Pedido
                    </th>
                    <th class="px-4 py-3">

                    </th>
                </tr>
            </thead>
            <tbody v-if="!loadingTickets">
                <tr v-if="tickets.data.length" v-for="(ticket, index) in tickets.data" :key="ticket._id"
                    class=" bg-white border-b border-gray-100">
                    <td class="px-4 py-3" :class="statusTxtColor(ticket.status)">
                        <div class="flex items-center gap-2">
                            <div class="w-[12px] h-[12px] rounded-full" :class="statusBgColor(ticket.status)"></div>
                            <p>{{ generateStatusLegend(ticket.status) }}</p>
                        </div>

                    </td>
                    <td class="px-4 py-3 text-nowrap text-gray-500">
                        <p>{{ ticket.costumer.full_name }}</p>
                    </td>
                    <td class="px-4 py-3 text-nowrap text-gray-500">
                        <p>{{ ticket.code }}</p>
                    </td>
                    <td class="px-4 py-3 text-nowrap text-gray-500">
                        <p>{{ ticket.order.id }}</p>
                    </td>

                    <td class="px-4 py-3 flex items-center gap-2 text-gray-500">
                        <button>Desfazer</button>
                    </td>
                </tr>
                <tr>
                    <td>Nenhum participante</td>
                </tr>
            </tbody>
            <tbody v-else>
                <tr>
                    Carregando...
                </tr>
            </tbody>
        </table>
    </div>
</template>