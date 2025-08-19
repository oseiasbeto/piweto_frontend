<script setup>
import { formatDate } from '@/utils/formatDate'
import { useTicketGenerator } from '@/utils/useTicketGenerator';
import moment from 'moment'
import QrcodeVue from 'qrcode.vue'
import { ref } from 'vue'

const { generateTicket, isLoading: loadingGenerateTicket } = useTicketGenerator();


const props = defineProps({
    ticket: {
        type: Object,
        required: true
    }
})
const qrcodeRef = ref(null) // Referência ao componente QR Code
const size = ref(80) // Tamanho do QR code (em pixels)
const level = ref('M') // Nível de correção de erro (L, M, Q, H)
const margin = ref(4) // Margem ao redor do QR code

const statusLegend = (status) => {
    switch (status) {
        case "p":
            return "Não utilizado"
        case "d":
            return "Cancelado"
        case "a":
            return "Utilizado"
    }
}
const handleGenerateTicket = async () => {
    await generateTicket(props.ticket, props?.ticket?.order, props?.ticket?.event);
};
</script>

<template>
    <div class="p-1 rounded-lg border border-gray-200">
        <div class="flex gap-2 mb-1 items-center">
            <div class="w-[80px] h-[80px] bg-gray-400 shrink-0 overflow-hidden">
                <div ref="qrcodeRef" class="flex justify-center items-center">
                    <qrcode-vue :value="ticket?.code" :size="size" :level="level" :margin="margin" />
                </div>
            </div>
            <div class="flex-1 overflow-hidden">
                <h1 class="text-xs font-bold lg:text-sm w-full truncate">{{ ticket?.event?.name }}</h1>
                <h2 class="text-xs mb-5 lg:mb-2.5 font-semibold text-gray-500 lg:text-sm w-full truncate">{{
                    ticket?.name }}</h2>
                <h3 class="text-xs font-semibold lg:text-sm w-full truncate">{{ ticket.code }}</h3>
            </div>
        </div>
        <hr class="py-1">
        <div class="p-2 mb-2 block">
            <div class="text-xs rounded-full text-nowrap mb-3 max-w-min border-gray-200 py-1 px-3 border">
                {{ statusLegend(ticket?.check_in?.status) }}
            </div>
            <div class="flex flex-1 mb-1 gap-1 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="shrink-0 w-4 h-4 lg:w-5 lg:h-5" viewBox="0 0 24 24"
                    fill="none">
                    <path
                        d="M14 19.2857L15.8 21L20 17M4 21C4 17.134 7.13401 14 11 14C12.4872 14 13.8662 14.4638 15 15.2547M15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span class="text-xs w-full font-semibold lg:text-sm truncate">{{ ticket?.costumer?.full_name }}</span>
            </div>
            <div>
                <p class="flex-1 text-xs font-semibold text-gray-500 lg:text-sm w-full uppercase truncate">
                    {{ moment(ticket?.event?.starts_at?.date).format('DD/MM/YYYY') }} - {{
                        moment(ticket?.event?.starts_at?.hm).format('HH:mm') }}
                </p>
            </div>
        </div>
        <div class="px-2 mb-2.5">
            <button @click="handleGenerateTicket()"
                class="text-xs px-1 hover:bg-gray-100 py-1.5 justify-center flex items-center w-full lg:text-sm rounded-full border border-gray-200">
                <svg class="w-4 h-4 lg:h-5 lg:w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="square" stroke-linejoin="arcs">
                    <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"></path>
                </svg>
                <span>{{ loadingGenerateTicket ? 'Baixando...' : 'Baixar em PDF' }}</span>
            </button>
        </div>

    </div>
</template>