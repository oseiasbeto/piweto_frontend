<template>
    <div class="relative box-border">
        <!--start header-->
        <div class="mb-4">
            <h1 class="text-[#a8a9af] font-semibold text-xs uppercase">Check-in Participantes</h1>
        </div>
        <!--end header-->

        <!--start body-->
        <div class="mb-4 w-full lg:max-w-xs">
            <DynamicSearch v-model:search="searchTerm" :placeholder="'Nome, email, nº do ingresso ou pedido'"
                :loading="isSearchLoading" @search="performSearch" />
        </div>
        <div class="w-full">
            <DynamicTable :columns="checkinColumns" :data="checkinList || []" :loading="loadingCheckinList"
                empty-message="O evento ainda não tem participantes." />
        </div>
        <!--end body-->
    </div>
</template>

<script setup>
import DynamicSearch from '@/use-cases/dashboard/components/dynamics/DynamicSearch.vue';
import DynamicTable from '@/use-cases/dashboard/components/dynamics/DynamicTable.vue';
import { ref } from 'vue';

const checkinColumns = [
    { label: "status", field: "status", type: "status" },
    { label: "Participante", field: "name" },
    { label: "Checkin feito em", field: "date" },
    { label: "Tipo do ingresso", field: "batch" },
    { label: "Nº reserva", field: "checkin_date", type: "reservation_number" },
    { label: "Nº pedido", field: "checkin_date", type: "reservation_number" },
]
const searchTerm = ref('');
const isSearchLoading = ref(false);
const loadingCheckinList = ref(false)
const checkinList = ref([])

const performSearch = async (query) => {
    isSearchLoading.value = true;
    try {
        // Simula uma busca assíncrona
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log('Buscando:', query);
    } finally {
        isSearchLoading.value = false;
    }
}
</script>