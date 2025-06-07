<script setup>
import { useStore } from "vuex";
import { onMounted, computed, ref } from "vue";
import formatCount from "@/utils/formatCount";
import { toast } from "vue3-toastify"
import QrcodeVue from "qrcode.vue";
const store = useStore()

const event = computed(() => {
    return store.getters.event
})

const qrCodeRef = ref(null);

const downloadQRCode = () => {
    if (!qrCodeRef.value) {
        console.error("qrCodeRef está vazio!");
        return;
    }

    // Pegamos o primeiro filho do container que é o próprio `<canvas>`
    const canvas = qrCodeRef.value.querySelector("canvas");

    if (!canvas) {
        console.error("QR Code canvas not found!");
        return;
    }

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${Date.now()}-evento-qrcode.png`;
    link.click();
};

const statusBgColor = (status) => {
    switch (status) {
        case "p":
            return "bg-yellow-500"
        case "a":
            return "bg-green-500"
        case "r":
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
        case "r":
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
            return "Aprovado"
        case "r":
            return "Rejeitado"
    }
}

const copyLink = (link) => {
    navigator.clipboard.writeText(link).then(() => {
        toast('Link copiado com sucesso!', {
            theme: "colored",
            position: "top-right",
            autoClose: 2500,
            type: 'success'
        })
    }).catch(err => {
        console.error("Erro ao copiar:", err);
    });
}
</script>

<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Status do evento -->
        <div class="bg-white p-6 rounded-md shadow-md border-t-4 border-blue-500">
            <h2 class="text-medium font-medium text-gray-500 mb-4">Status do Evento</h2>
            <div class="flex items-center gap-2">
                <div class="w-[12px] h-[12px] rounded-full" :class="statusBgColor(event?.status)"></div>
                <p class="text-base font-medium" :class="statusTxtColor(event?.status)">
                    {{ generateStatusLegend(event?.status) }}
                </p>
            </div>
        </div>

        <!-- Visualizações -->
        <div class="bg-white p-6 rounded-md shadow-md border-t-4 border-green-500">
            <h2 class="text-medium font-medium text-gray-500 mb-4">Visualizações</h2>
            <h1 class="text-lg font-semibold text-green-500">{{ formatCount(event?.views) }}</h1>
        </div>

        <!-- Visibilidade -->
        <div class="bg-white p-6 rounded-md shadow-md border-t-4 border-yellow-500">
            <h2 class="text-medium font-medium text-gray-500 mb-4">Visibilidade</h2>
            <h1 class="text-lg font-semibold">{{ event?.visibility == 'public' ? 'Público' : 'Privado' }}</h1>
        </div>

        <!-- QR Code do Evento -->
        <div class="bg-white p-6 rounded-md shadow-md border-t-4 border-gray-500 flex flex-col items-center">
            <h2 class="text-medium font-medium text-gray-500 mb-4">QR Code do Evento</h2>
            <div ref="qrCodeRef">
                <qrcode-vue :value="`https://piweto.it.ao/evento/${event?.slug}`" :size="150" level="H" />
            </div>
            <button @click="downloadQRCode" class="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4">
                Baixar QR Code
            </button>
        </div>

        <!-- Compartilhar -->
        <div class="bg-white p-6 rounded-md shadow-md border-t-4 border-purple-500 col-span-1 md:col-span-2">
            <h2 class="text-medium font-medium text-gray-500 mb-4">Compartilhar</h2>
            <div class="flex items-center gap-2">
                <input type="text" class="border outline-none rounded-lg p-2 w-full"
                    :value="`https://piweto.it.ao/evento/${event?.slug}`" readonly>
                <button @click="copyLink(`https://piweto.it.ao/evento/${event?.slug}`)"
                    class="bg-blue-500 text-white px-4 py-2 rounded-lg">Copiar</button>
            </div>
        </div>

        <!-- Total de ingressos -->
        <div class="bg-white p-6 rounded-md shadow-md border-t-4 border-red-500">
            <h2 class="text-medium font-medium text-gray-500 mb-4">Total de Ingressos</h2>
            <h1 class="text-lg font-semibold text-red-500">{{ formatCount(event?.tickets_available_count) }}</h1>
        </div>

        <!-- Ingressos vendidos -->
        <div class="bg-white p-6 rounded-md shadow-md border-t-4 border-orange-500">
            <h2 class="text-medium font-medium text-gray-500 mb-4">Ingressos Vendidos</h2>
            <h1 class="text-lg font-semibold text-orange-500">{{ formatCount(event?.tickets_purchased_count) }}</h1>
        </div>

        <!-- Ingressos disponíveis -->
        <div class="bg-white p-6 rounded-md shadow-md border-t-4 border-teal-500">
            <h2 class="text-medium font-medium text-gray-500 mb-4">Ingressos Disponíveis</h2>
            <h1 class="text-lg font-semibold text-teal-500">
                {{ formatCount(event?.tickets_available_count - event?.tickets_purchased_count) }}
            </h1>
        </div>

        <!-- Ingressos checados -->
        <div class="bg-white p-6 rounded-md shadow-md border-t-4 border-pink-500">
            <h2 class="text-medium font-medium text-gray-500 mb-4">Ingressos Checados</h2>
            <h1 class="text-lg font-semibold text-pink-500">{{ formatCount(event?.tickets_checked_count) }}</h1>
        </div>
    </div>

</template>