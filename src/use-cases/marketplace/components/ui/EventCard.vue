<script setup>
import formatAmount from '@/utils/formatAmount';
import moment from 'moment';
import QrcodeVue from 'qrcode.vue'
import { ref, nextTick, computed } from "vue";
import { useStore } from 'vuex';
const props = defineProps({
    event: {
        type: Object,
        required: true
    },
    ticket: {
        type: Object,
        default: null
    },
    isTicket: {
        type: Boolean,
        default: false
    },
    isBigCover: {
        type: Boolean,
        default: false
    }
})
function formatDate(date, time) {
    const day = new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(date);
    const dayNumber = date.getDate();
    const month = new Intl.DateTimeFormat('pt-BR', { month: 'short' }).format(date);
    const _time = time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    return `${day}, ${dayNumber} ${month} · ${_time}`;
}

const store = useStore()
const qrcodeRef = ref(null) // Referência ao componente QR Code
const size = ref(200) // Tamanho do QR code (em pixels)
const level = ref('M') // Nível de correção de erro (L, M, Q, H)
const margin = ref(4) // Margem ao redor do QR code

const user = computed(() => {
    return store.getters.currentUser
})

const statusBgColor = (status) => {
    switch (status) {
        case "p":
            return "bg-[#fff3cd] text-[#856404] border-[#ffeeba]"
        case "a":
            return "bg-[#d4edda] text-[#155724] border-[#c3e6cb]"
        case "d":
            return "bg-[#fceeef] text-[#b6202a] border-[#fae1e2]"
    }
}

const generateStatusLegend = (status) => {
    switch (status) {
        case "p":
            return "Pendente"
        case "a":
            return "Activo"
        case "d":
            return "Cancelado"
    }
}

const downloadQRCode = async () => {
    await nextTick(); // Wait for QR Code rendering

    try {
        // Extract values
        const qrValue = props.ticket.code;
        const reservationNumber = props.ticket.booking_number;
        const eventName = props.event.name;
        const ticketType = props.ticket.batch.name;
        const eventDate = moment(props.event.starts_at.date);
        const price = props.ticket.price;
        const participantName = user.value?.full_name; // Added participant name
        const footerText = "Este ingresso foi emitido pelo Piweto";

        if (!qrcodeRef.value) {
            console.error("QR Code reference not found!");
            return;
        }

        const qrCanvas = qrcodeRef.value.getElementsByTagName("canvas")[0];
        if (!qrCanvas) {
            console.error("QR Code canvas not found!");
            return;
        }

        // Constants for layout
        const PADDING = 20;
        const TEXT_HEIGHT = 160; // Increased to accommodate participant name
        const LINE_HEIGHT = 20;
        const FOOTER_MARGIN = 10;
        
        const qrSize = qrCanvas.width;
        const totalHeight = qrSize + TEXT_HEIGHT + PADDING;

        // Create new canvas
        const canvas = document.createElement('canvas');
        canvas.width = qrSize + PADDING * 2;
        canvas.height = totalHeight;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error("Could not get canvas context");
            return;
        }

        // Draw white background
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add QR Code centered
        ctx.drawImage(qrCanvas, PADDING, TEXT_HEIGHT);

        // Style and add text information
        ctx.fillStyle = '#000';
        ctx.textAlign = 'center';

        // Draw each line of text
        const textLines = [
            eventName,
            `Participante: ${participantName}`, // Added participant name line
            `Ingresso: ${ticketType}`,
            `Data: ${eventDate.format("DD/MM/YYYY")}`,
            `Preço: ${formatAmount(price)}`,
            `Código: ${qrValue}`,
            `Reserva: ${reservationNumber}`
        ];

        ctx.font = '16px Arial';
        textLines.forEach((text, index) => {
            ctx.fillText(text, canvas.width / 2, 20 + (index * LINE_HEIGHT));
        });

        // Add footer
        ctx.font = '12px Arial';
        ctx.fillStyle = '#555';
        ctx.fillText(footerText, canvas.width / 2, totalHeight - FOOTER_MARGIN);

        // Create download link
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `${qrValue}.png`;
        link.setAttribute('aria-label', `Download QR Code for ticket ${qrValue}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("Error generating QR Code download:", error);
        // You might want to show a user-friendly error message here
    }
};



function onImageLoad(event) {
    // Adiciona a classe de transição no carregamento da imagem
    event.target.classList.add("fade-in");
}
</script>

<template>
    <div class="bg-white overflow-hidden transition-all rounded-[15px] mb-3.5 md:hover:shadow-lg">
        <a :href="'/evento/' + props.event.slug">
            <div class="h-[150px]  overflow-hidden rounded-b-[15px]"
            :class="isBigCover ? 'lg:h-[285px]': 'lg:h-[150px]'"
            >
                <img class="w-full h-full object-cover lazy-image" 
                @load="onImageLoad" 
                v-lazy="event.cover.low || 'https://i.ibb.co/RpzZJGzc/5f282a0c6a2d9.png'"
                :alt="props.event.name"
                >
            </div>
        </a>
        <a :href="'/evento/' + props.event.slug">
            <div class="py-3 px-0 md:px-3 flex flex-col gap-2">
                <div class="flex text-brand-info text-xs items-center gap-1">
                    <p class="flex-1 w-64 uppercase font-bold truncate">{{ formatDate(new Date(event.starts_at.date),
                        new
                            Date(event.starts_at.hm)) }}
                    </p>
                </div>
                <div>
                    <h5
                        class="text-gray-900 text-base font-semibold line-clamp-2 overflow-hidden text-ellipsis break-words"
                        :class="isBigCover ? 'lg:text-xl' : 'lg:text-base'"
                        >
                        {{ event.name }}</h5>
                </div>
                <div class="flex text-gray-600 text-xs items-center gap-1">
                    <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round"
                        stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <p class="flex-1 w-64 text-sm truncate">{{ event.address.location }}</p>
                </div>
                <div class="my-[1px]"></div>
            </div>
        </a>
        <div v-if="props.isTicket">
            <div class="mb-2">
                <hr>
            </div>
            <ul class="px-0 lg:px-3">
                <div class="text-xs py-1 px-3 w-min rounded-full border" :class="statusBgColor(ticket.status)">{{
                    generateStatusLegend(ticket.status) }}</div>

                <!--start qr code area-->
                <div ref="qrcodeRef" class="flex justify-center items-center">
                    <qrcode-vue :value="ticket.code" :size="size" :level="level" :margin="margin" />
                </div>
                <div class="text-center text-xs leading-4 mb-5">
                    <p class="mb-2">{{ ticket.code }}</p>
                    <b>{{ user?.full_name }}</b>
                    <p>{{ user?.email }}</p>
                </div>
                <!--end qr code area-->
                <button :disabled="ticket.status !== 'a'"
                    class="w-full disabled:bg-gray-300 disabled:text-gray-500 font-medium hover:opacity-[0.8] mt-1 mb-5 py-3 flex justify-center rounded-full bg-[#333333] text-white "
                    @click="downloadQRCode"> <svg class="mr-3" width="21" height="21" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="arcs">
                        <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5"></path>
                    </svg> Baixar QR Code</button>
            </ul>
        </div>
    </div>
</template>

<style scoped>
/* Estilo inicial com opacidade zero */
.lazy-image {
    opacity: 0;
    transition: opacity 0.8s ease-in-out;
    /* Suavização do efeito */
}

/* Estilo aplicado após o carregamento */
.lazy-image.fade-in {
    opacity: 1;
}
</style>