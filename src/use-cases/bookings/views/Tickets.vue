<script setup>
import { useTickets } from '@/repositories/tickets-repository';
import Container from '@/use-cases/marketplace/components/ui/Container.vue';
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import Ticket from '../components/Ticket.vue';
import Spinner from '@/use-cases/checkout/components/ui/Spinner.vue';
const { getTicketsByOrderId, loading:loadingTickets } = useTickets()

const props = defineProps({
    orderId: {
        type: String,
        required: true
    }
})

const store = useStore()
const tickets = computed(() => store.getters.tickets)
const booking = computed(() => store.getters.booking)

onMounted(async () => {
    if (!props?.orderId) return
    else {
        loadingTickets.value = true
        await getTicketsByOrderId({
            page: 1,
            limit: 10,
            id: props?.orderId
        }).then(() => {
            console.log("achou")
        }).catch(err => {
            console.log(err)
        })
    }
})
</script>

<template>
    <div class="relative">
        <Container>
            <div class="px-4 xl:px-0">
                <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center">
                    <h1 class="font-bold mt-7 my-0 lg:my-5 text-2xl lg:text-3xl">Reserva: {{ booking?.reservation_number
                    }}</h1>
                    <div class="flex items-center text-[#6c757d]">
                        <router-link class="text-brand-primary hover:underline" to="/">Home</router-link>
                        <span class="mx-1.5">/</span>
                        <p>Reserva</p>
                    </div>
                </div>
            </div>
        </Container>
        <div class="mt-5 lg:mt-4 mb-2">
            <hr>
        </div>

        <Container>
            <div v-if="!loadingTickets" class="p-4 lg:px-0">
                <div v-if="tickets?.data?.length">
                    <div class="mb-4">
                        <p class="text-sm font-bold"> {{ tickets?.data?.length }} ingresso(s)</p>
                    </div>
                    <div class="flex flex-col gap-4">
                        <Ticket v-for="ticket in tickets?.data" :ticket="ticket" />
                    </div>
                </div>
                <div v-else>
                    <h1>Sem ingressos</h1>
                </div>
            </div>
            <div v-else>
                <div class="flex justify-center items-center h-[150px]">
                    <Spinner />
                </div>
            </div>

        </Container>
    </div>

</template>