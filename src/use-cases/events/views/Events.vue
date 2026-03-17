<script setup>
import { useStaffs } from "@/repositories/staffs-repository"
import { useEvents } from "@/repositories/events-repository"
import { onMounted, ref, computed } from "vue";
import { useStore } from "vuex";
import Swal from "sweetalert2"
import { toast } from "vue3-toastify"
import moment from "moment";
import DynamicSearch from "@/use-cases/dashboard/components/dynamics/DynamicSearch.vue";
import BtnSpinner from "../components/spinners/BtnSpinner.vue";
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    Menu,
    MenuButton,
    MenuItems,
    MenuItem
} from '@headlessui/vue'

const optionStatus = [
    { name: 'Todos eventos', value: null },
    { name: 'Eventos publicados', value: 'a' },
    { name: 'Eventos pendente', value: 'p' },
    { name: 'Eventos rejeitados', value: 'r' },
    { name: 'Eventos encerrados', value: 'e' }
]

const optionStaffs = [
    { name: 'Todos eventos', value: null },
    { name: 'Apenas meus eventos', value: 'a' },
    { name: 'Compartilhado comigo', value: 'p' }
]

const filterByStatus = ref(optionStatus[0])
const filterByStaffs = ref(optionStaffs[0])

const { getStaffs, loading: loadingEvents } = useStaffs()
const { deleteEvent, loading: loadingDeleteEvent } = useEvents()

const store = useStore()

const events = computed(() => {
    return store.getters.myEvents
})
const user = computed(() => {
    return store.getters.currentUser
})

const page = ref(1);
const limit = ref(10); // Valor inicial do limite
const status = ref(null);
const q = ref(null);


// Esta função computada tem como finalidade retornar os dados do usuário logado.
const getCurrentUser = computed(() => {
    return store.getters.currentUser
})

const validEvents = computed(() => {
    return events.value.data?.filter(e => e?.event?._id) || []
})

const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
}

const calculateProgress = (purchased, available) => {
    if (available === 0) return 0; // Evita divisão por zero
    return ((purchased / available) * 100).toFixed(2);
}

// Esta função tem como finalidade retornar uma classe dinâmica para um status.
function statusColor(status) {
    switch (status) {
        case "a":
            return "bg-[#2ac8bc] text-[#2ac8bc]"
        case "p":
            return "bg-yellow-300 text-yellow-300"
        case "r":
            return "bg-red-500 text-red-500"
        default:
            return "bg-[#85868f] text-[#85868f]"
    }
}

const performSearch = () => {
    page.value = 1; // Reseta a página ao mudar o limite ou buscar
    fetchStaffs();
};

const handlePrevPage = () => {
    if (events?.value?.metadata?.hasPrevPage) {
        page.value = events?.value?.metadata?.page - 1;
        fetchStaffs();
    }
};

const goToDashboard = (eventId) => {
    window.location.href = `/gerenciador-de-eventos/pagina-inicial/${eventId}`;
}

const handleNextPage = () => {
    if (events.value?.metadata?.hasNextPage) {
        page.value = events?.value?.metadata?.page + 1;
        fetchStaffs();
    }
};

// Esta função tem como finalidade retornar uma legenda dinâmica para um status.
function statusLegends(status) {
    switch (status) {
        case "a":
            return "Publicado"
        case "p":
            return "Pendente"
        case "r":
            return "Rejeitado"
        default:
            return "Indefinido"
    }
}

const fetchStaffs = async () => {
    loadingEvents.value = true;
    await getStaffs({
        page: page.value,
        limit: limit.value,
        member: user?.value?._id,
        ...(status.value && {
            status: status.value
        }),
        q: q.value
    }).then((res) => {
        const data = res?.data?.staffs;
        const metadata = res?.data?.metadata;
        store.dispatch("setMyEvents", {
            data,
            metadata,
            hasViewed: true
        })
    }).finally(() => {
        if (!q.value) {
            window.scrollTo(0, 0)
        }

        loadingEvents.value = false;
    });
};

const _deleteEvent = async (eventId) => {

    await deleteEvent(eventId).then(async () => {
        window.scrollTo(0, 0)
        await fetchStaffs()
        toast('Evento eliminado com sucesso!', {
            theme: "colored",
            position: "top-right",
            autoClose: 2500,
            type: 'success'
        })
    }).finally(() => {
        loadingEvents.value = false
    })
}

const confirmDelete = (eventId) => {
    Swal.fire({
        title: "Você tem certeza?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, eu tenho",
        cancelButtonText: "Cancelar",
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            loadingEvents.value = true
            _deleteEvent(eventId)
        }
    })
}

onMounted(async () => {
    if (events?.value?.hasViewed) {
        loadingEvents.value = false
    } else {
        await fetchStaffs();
    }
})
</script>

<template>
    <!--start page my events -->
    <div class="bg-[#eeeeee] min-h-screen">
        <!--start body -->
        <div class="p-0 md:p-[20px] lg:p-8">
            <!--start content result -->
            <div class="data">

                <div
                    class="w-full mt-2 mb-8 px-4 py-4 lg:px-8 bg-white rounded-md lg:shadow-[0_2px_10px_0_rgba(0,0,0,0.05)]">
                    <div>
                        <div class="mb-4">
                            <h1 class="font-bold text-gray-700 text-[20px]">Olá,
                                {{ getCurrentUser.full_name }}</h1>
                            <p class="font-medium text-gray-400">Já publicou o seu evento?</p>
                        </div>
                        <div class="flex flex-col lg:flex-row items-center gap-4">
                            <router-link
                                class="border border-brand-primary bg-brand-primary w-full text-[12px] font-medium text-white uppercase rounded-md py-[7px] px-4 hover:bg-green-500 text-center lg:w-auto"
                                :to="{
                                    path: '/eventos/novo-evento',
                                    query: {
                                        tipo: 'presencial'
                                    }
                                }">
                                Criar novo
                                evento
                            </router-link>
                        </div>
                    </div>
                </div>
                <!--end header content result empty -->

                <div class="flex bg-white rounded-md flex-col flex-wrap shadow-[0_2px_10px_0_rgba(0,0,0,0.05)]">
                    <div
                        class="flex flex-col py-4 px-4 lg:flex-row items-center border-b border-[#dfe0df] lg:border-none lg:mb-8 gap-4">

                        <div class="lg:max-w-80 w-full">
                            <p class="hidden lg:block text-gray-500 font-semibold py-2 text-xs">Buscar pelo nome do
                                evento</p>
                            <DynamicSearch placeholder="Buscar pelo nome do evento" v-model:search="q"
                                :loading="loadingEvents" @update:search="performSearch" />
                        </div>

                        <div class="lg:max-w-60 w-full">
                            <p class="hidden lg:block text-gray-500 font-semibold py-2 text-xs">Compartilhamento</p>
                            <Listbox v-model="filterByStaffs">
                                <div class="relative">
                                    <ListboxButton v-slot="{ open }"
                                        class="flex h-[40px] w-full text-gray-500 items-center text-xs px-3.5 p-2 overflow-hidden border border-[#dfe0df] rounded-[3px] bg-white focus:outline-none">
                                        <span class="block truncate">{{ filterByStaffs.name }}</span>

                                        <span
                                            class="pointer-events-none text-gray-900 absolute inset-y-0 right-0 flex items-center pr-2.5"
                                            :class="{ '!text-gray-300': open }">
                                            <svg :class="{ 'rotate-180 ': open }" class="h-3.5 w-3.5"
                                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                fill="currentColor">
                                                <path
                                                    d="M17.9188 8.17969H11.6888H6.07877C5.11877 8.17969 4.63877 9.33969 5.31877 10.0197L10.4988 15.1997C11.3288 16.0297 12.6788 16.0297 13.5088 15.1997L15.4788 13.2297L18.6888 10.0197C19.3588 9.33969 18.8788 8.17969 17.9188 8.17969Z"
                                                    fill="currentColor" />
                                            </svg>
                                        </span>

                                    </ListboxButton>

                                    <transition leave-active-class="transition duration-100 ease-in"
                                        leave-from-class="opacity-100" leave-to-class="opacity-0">
                                        <ListboxOptions
                                            class="absolute z-[100] max-h-60 w-full overflow-auto rounded-sm bg-white text-xs shadow-lg focus:outline-none">
                                            <ListboxOption v-for="option in optionStaffs" :key="option.value"
                                                :value="option" v-slot="{ active, selected }" as="template">
                                                <li :class="[
                                                    selected
                                                        ? 'bg-[#0097ff] text-white'
                                                        : active
                                                            ? 'bg-gray-100 text-gray-700'
                                                            : 'text-gray-500',
                                                    'relative cursor-default select-none py-1.5 px-4'
                                                ]">
                                                    <span :class="[
                                                        selected ? 'font-medium' : 'font-normal',
                                                        'block truncate',
                                                    ]">{{ option.name }}</span>


                                                </li>
                                            </ListboxOption>
                                        </ListboxOptions>
                                    </transition>
                                </div>
                            </Listbox>
                        </div>

                        <div class="lg:max-w-60 w-full">
                            <p class="hidden lg:block text-gray-500 font-semibold py-2 text-xs">Filtrar por</p>
                            <Listbox v-model="filterByStatus">
                                <div class="relative">
                                    <ListboxButton v-slot="{ open }"
                                        class="flex h-[40px] w-full text-gray-500 items-center text-xs px-3.5 p-2 overflow-hidden border border-[#dfe0df] rounded-[3px] bg-white focus:outline-none">
                                        <span class="block truncate">{{ filterByStatus.name }}</span>

                                        <span
                                            class="pointer-events-none text-gray-900 absolute inset-y-0 right-0 flex items-center pr-2.5"
                                            :class="{ '!text-gray-300': open }">
                                            <svg :class="{ 'rotate-180 ': open }" class="h-3.5 w-3.5"
                                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                                fill="currentColor">
                                                <path
                                                    d="M17.9188 8.17969H11.6888H6.07877C5.11877 8.17969 4.63877 9.33969 5.31877 10.0197L10.4988 15.1997C11.3288 16.0297 12.6788 16.0297 13.5088 15.1997L15.4788 13.2297L18.6888 10.0197C19.3588 9.33969 18.8788 8.17969 17.9188 8.17969Z"
                                                    fill="currentColor" />
                                            </svg>
                                        </span>

                                    </ListboxButton>

                                    <transition leave-active-class="transition duration-100 ease-in"
                                        leave-from-class="opacity-100" leave-to-class="opacity-0">
                                        <ListboxOptions
                                            class="absolute z-[100] max-h-60 w-full overflow-auto rounded-sm bg-white text-xs shadow-lg focus:outline-none">
                                            <ListboxOption v-for="option in optionStatus" :key="option.value"
                                                :value="option" v-slot="{ active, selected }" as="template">
                                                <li :class="[
                                                    selected
                                                        ? 'bg-[#0097ff] text-white'
                                                        : active
                                                            ? 'bg-gray-100 text-gray-700'
                                                            : 'text-gray-500',
                                                    'relative cursor-default select-none py-1.5 px-4'
                                                ]">
                                                    <span :class="[
                                                        selected ? 'font-medium' : 'font-normal',
                                                        'block truncate',
                                                    ]">{{ option.name }}</span>


                                                </li>
                                            </ListboxOption>
                                        </ListboxOptions>
                                    </transition>
                                </div>
                            </Listbox>
                        </div>


                        <div class="w-full mt-4 lg:mt-9 flex flex-col lg:flex-row gap-2 lg:gap-1.5 items-center">
                            <button
                                class="border border-[#0097ff] w-full lg:w-auto hover:bg-[#0097ff] hover:text-white transition-colors text-[#0097ff] py-2 px-8 text-xs font-medium uppercase rounded-full">
                                Filtrar
                            </button>

                            <button
                                class="border border-transparent w-full lg:w-auto hover:bg-gray-100 transition-colors text-[#0097ff] py-2 px-5 text-xs font-medium uppercase whitespace-nowrap rounded-full">
                                Limpar filtros
                            </button>
                        </div>
                        <!-- 
                        <div class="lg:max-w-80 w-full">
                            <select v-model="status" @change="performSearch"
                                class="flex h-[40px] w-full text-gray-500 items-center text-xs p-2 overflow-hidden border border-[#dfe0df] rounded-[3px] bg-white focus:outline-none">
                                <option :value="null">Todos eventos</option>
                                <option value="a">Eventos publicados</option>
                                <option value="p">Eventos pendentes</option>
                                <option value="r">Eventos rejeitados</option>
                            </select>


                        </div>
                        -->
                    </div>

                    <div class="hidden lg:block px-4">
                        <table class="w-full text-xs text-left">
                            <thead @click="fetchStaffs"
                                class="text-[11px] cursor-pointer font-bold border border-gray-200 text-gray-500 uppercase bg-gray-50">
                                <tr>
                                    <th class="px-4 noorder py-2.5">
                                        Status

                                    </th>
                                    <th class="px-4 noorder py-2.5">
                                        Evento

                                        <span class="arrow"></span>
                                    </th>
                                    <th class="px-4 noorder py-2.5">
                                        Quando

                                        <span class="arrow"></span>
                                    </th>
                                    <th class="px-4 noorder py-2.5">
                                        Onde

                                        <span class="arrow"></span>
                                    </th>
                                    <th class="px-4 noorder py-2.5">
                                        Ingressos
                                    </th>

                                    <th class="px-4 noorder py-2.5">

                                    </th>
                                </tr>
                            </thead>
                            <tbody v-if="!loadingEvents">
                                <tr v-if="validEvents?.length" v-for="eventWrapper in validEvents"
                                    :key="eventWrapper.event._id" @click="goToDashboard(eventWrapper.event.id)"
                                    class="bg-white cursor-pointer border-b border-[#dfe0df] hover:bg-gray-50 transition-colors">
                                    <td class="px-4 py-2 text-gray-500">
                                        <div class="flex items-center gap-2">
                                            <div class="w-[12px] h-[12px] rounded-full"
                                                :class="statusColor(eventWrapper.event.status || 'r')"></div>

                                            <p class="text-xs !bg-transparent"
                                                :class="statusColor(eventWrapper.event.status || 'r')">
                                                {{ statusLegends(eventWrapper.event.status || 'r') }}
                                            </p>
                                        </div>
                                    </td>

                                    <td class="px-4 py-2 text-nowrap text-gray-500">
                                        {{ truncateText(eventWrapper.event.name || "Evento", 30) }}
                                    </td>

                                    <td class="px-4 py-2  text-gray-500">
                                        <p class="truncate"> {{
                                            moment(eventWrapper.event.starts_at?.date).format("DD/MM/YYYY") }}</p>
                                    </td>

                                    <td class="px-4 py-2 max-w-[146px] text-gray-500">
                                        <p class="truncate">{{ eventWrapper.event.address?.location || "Indefinido" }}
                                        </p>
                                    </td>

                                    <td class="px-4 py-2 text-gray-500">
                                        <div
                                            class="h-full w-[130px] relative overflow-hidden flex text-xs bg-gray-100 rounded-lg font-medium py-[4px] px-2">
                                            <div class="relative z-[99] w-full flex justify-between">
                                                <span>{{ eventWrapper.event.tickets_purchased_count }}</span>
                                                <span>{{ eventWrapper.event.tickets_available_count }}</span>
                                            </div>

                                            <span class="absolute top-0 left-0 h-full bg-[#6AD9D1]" :style="`width: ${calculateProgress(
                                                eventWrapper.event.tickets_purchased_count,
                                                eventWrapper.event.tickets_available_count
                                            )}%`"></span>
                                        </div>
                                    </td>

                                    <td @click.stop class="px-4 py-2 flex items-center justify-end gap-2 text-gray-500">
                                        <button
                                            class="border border-[#0097ff] hover:bg-[#0097ff] hover:text-white transition-colors text-[#0097ff] py-1.5 px-3.5 text-xs font-medium uppercase rounded-full mr-9"
                                            @click="goToDashboard(eventWrapper.event.id)">
                                            Gerenciar
                                        </button>
                                        <router-link :to="`/eventos/${eventWrapper.event._id}`">
                                            <button
                                                v-tippy="{ content: 'Editar', maxWidth: 350, placement: 'top', theme: 'custom-card' }"
                                                class="w-6 h-6 flex text-[#0097ff] items-center justify-center rounded-ful">
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                    xmlns:xlink="http://www.w3.org/1999/xlink" fill="currentColor"
                                                    class="w-5 h-5" version="1.1" id="Layer_1" viewBox="0 0 512 512"
                                                    xml:space="preserve">
                                                    <g>
                                                        <g>
                                                            <path
                                                                d="M488.79,47.263l-24.034-24.035C449.775,8.249,429.859,0,408.675,0c-21.186,0-41.102,8.249-56.081,23.229l-44.796,44.794    c-0.002,0.002-0.005,0.006-0.007,0.008c-0.001,0.001-0.001,0.001-0.002,0.002L33.471,342.983    c-0.028,0.028-0.053,0.062-0.081,0.091c-0.416,0.391-0.836,0.774-1.242,1.181c-4.456,4.456-9.539,13.437-16.504,48.67    C6.92,437.064,0.361,496.986,0.085,499.514c-0.37,3.394,0.82,6.772,3.234,9.185c2.125,2.124,4.996,3.3,7.967,3.3    c0.405,0,0.811-0.023,1.219-0.066c2.53-0.275,62.451-6.835,106.591-15.56c35.233-6.965,44.213-12.047,48.67-16.504    c0.432-0.432,0.839-0.879,1.255-1.321c0.034-0.033,0.07-0.061,0.104-0.094l274.861-274.227c0.003-0.003,0.008-0.007,0.011-0.01    l44.795-44.794C519.712,128.503,519.712,78.188,488.79,47.263z M48.219,360.055c0.354-0.35,0.717-0.685,1.082-1.018    c0.206-0.187,0.416-0.368,0.625-0.55c0.238-0.206,0.477-0.412,0.719-0.611c0.177-0.145,0.357-0.286,0.537-0.427    c0.296-0.233,0.593-0.464,0.895-0.685c0.115-0.085,0.232-0.167,0.348-0.25c0.386-0.276,0.776-0.549,1.172-0.807    c0.024-0.016,0.047-0.03,0.072-0.046c12.867-8.373,30.135-7.289,41.863,3.252c0.024,0.021,0.048,0.041,0.072,0.062    c0.434,0.392,0.86,0.797,1.278,1.215c2.648,2.648,4.805,5.645,6.436,8.872c3.15,6.232,4.322,13.321,3.304,20.404l-34.815,34.815    l-32.859-32.858C44.207,366.424,47.625,360.873,48.219,360.055z M24.122,487.897c1.947-16.141,5.489-43.734,9.824-69.605    l29.466,29.466c0.134,0.149,0.259,0.302,0.403,0.446c0.143,0.143,0.297,0.269,0.446,0.403l29.465,29.465    C67.862,482.409,40.264,485.95,24.122,487.897z M156.334,458.392c-0.001,0.002-0.002,0.003-0.003,0.006    c-0.273,0.418-0.56,0.828-0.852,1.236c-0.069,0.096-0.136,0.193-0.207,0.287c-0.234,0.32-0.48,0.635-0.727,0.949    c-0.13,0.163-0.258,0.328-0.39,0.49c-0.21,0.256-0.427,0.508-0.644,0.759c-0.171,0.197-0.343,0.396-0.518,0.59    c-0.335,0.368-0.674,0.735-1.026,1.092c-0.819,0.593-6.37,4.012-31.368,9.271L87.74,440.216l34.815-34.815    c10.75-1.545,21.512,1.977,29.275,9.74c0.097,0.097,0.186,0.197,0.281,0.295c0.315,0.323,0.631,0.648,0.932,0.98    c0.035,0.039,0.068,0.08,0.103,0.118C163.658,428.273,164.724,445.537,156.334,458.392z M184.005,431.776    c-1.264-9.185-4.791-18.114-10.542-25.929c-0.029-0.041-0.06-0.08-0.089-0.119c-0.486-0.656-0.987-1.304-1.504-1.944    c-0.125-0.156-0.25-0.311-0.378-0.464c-0.448-0.543-0.91-1.079-1.381-1.61c-0.154-0.173-0.304-0.349-0.461-0.522    c-0.611-0.672-1.236-1.334-1.885-1.983c-6.976-6.976-15.415-11.877-24.515-14.499l188.433-188.433c4.4-4.4,4.4-11.535,0-15.936    c-4.401-4.4-11.534-4.4-15.936,0L127.314,368.771c-0.181-0.628-0.362-1.256-0.565-1.877c-2.735-8.383-7.441-16.144-13.935-22.639    c-0.651-0.651-1.318-1.28-1.993-1.893c-0.161-0.146-0.327-0.287-0.489-0.432c-0.543-0.483-1.091-0.954-1.647-1.414    c-0.144-0.118-0.29-0.235-0.434-0.353c-0.655-0.53-1.317-1.042-1.989-1.539c-0.025-0.018-0.051-0.038-0.076-0.056    c-7.821-5.76-16.754-9.29-25.95-10.553L315.775,91.935l6.108,6.108l98.2,98.2L184.005,431.776z M472.856,143.491l-36.827,36.826    l-52.163-52.163l-52.164-52.163l36.827-36.827c10.722-10.724,24.981-16.629,40.146-16.629s29.422,5.905,40.146,16.629    l12.017,12.018c0,0,0,0,0.001,0l12.017,12.017C494.992,85.336,494.992,121.354,472.856,143.491z" />
                                                        </g>
                                                    </g>
                                                    <g>
                                                        <g>
                                                            <path
                                                                d="M358.105,162.76c-0.146-0.721-0.359-1.431-0.641-2.107c-0.282-0.687-0.632-1.341-1.038-1.949    c-0.405-0.62-0.878-1.194-1.396-1.713c-0.518-0.518-1.094-0.992-1.714-1.397c-0.608-0.406-1.262-0.755-1.948-1.037    c-0.677-0.282-1.386-0.496-2.107-0.642c-1.454-0.293-2.952-0.293-4.406,0c-0.71,0.146-1.42,0.361-2.107,0.642    c-0.676,0.282-1.33,0.631-1.938,1.037c-0.62,0.406-1.195,0.879-1.714,1.397c-0.518,0.518-0.992,1.093-1.408,1.713    c-0.405,0.608-0.755,1.262-1.037,1.949c-0.282,0.676-0.495,1.386-0.641,2.107c-0.148,0.721-0.214,1.465-0.214,2.197    c0,0.732,0.068,1.476,0.214,2.208c0.145,0.721,0.359,1.42,0.641,2.107c0.282,0.676,0.632,1.33,1.037,1.938    c0.417,0.62,0.89,1.194,1.408,1.713c0.518,0.53,1.094,0.992,1.714,1.408c0.608,0.406,1.262,0.755,1.938,1.037    c0.687,0.282,1.397,0.496,2.107,0.642c0.732,0.146,1.476,0.214,2.208,0.214c0.732,0,1.476-0.068,2.197-0.214    c0.721-0.146,1.431-0.361,2.107-0.642c0.686-0.282,1.34-0.631,1.948-1.037c0.62-0.417,1.195-0.879,1.714-1.408    c0.518-0.518,0.992-1.093,1.396-1.713c0.406-0.608,0.756-1.262,1.038-1.938c0.282-0.687,0.495-1.386,0.641-2.107    c0.146-0.732,0.225-1.476,0.225-2.208C358.33,164.225,358.251,163.481,358.105,162.76z" />
                                                        </g>
                                                    </g>
                                                </svg>
                                            </button>
                                        </router-link>
                                        <button
                                            v-tippy="{ content: 'Eliminar', maxWidth: 350, placement: 'top', theme: 'custom-card' }"
                                            @click="confirmDelete(eventWrapper.event._id)"
                                            class="w-6 h-6 flex text-[#0097ff] items-center justify-center rounded-ful">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="w-[22px] h-[22px]"
                                                viewBox="0 0 1024 1024">
                                                <path fill="currentColor"
                                                    d="M160 256H96a32 32 0 0 1 0-64h256V95.936a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32V192h256a32 32 0 1 1 0 64h-64v672a32 32 0 0 1-32 32H192a32 32 0 0 1-32-32V256zm448-64v-64H416v64h192zM224 896h576V256H224v640zm192-128a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32zm192 0a32 32 0 0 1-32-32V416a32 32 0 0 1 64 0v320a32 32 0 0 1-32 32z" />
                                            </svg>
                                        </button>

                                        <a :href="`/evento/${eventWrapper.event.slug}`" target="_blank" @click.stop>
                                            <button
                                                v-tippy="{ content: 'Ir à página do evento', maxWidth: 350, placement: 'top', theme: 'custom-card' }"
                                                class="w-6 h-6 flex text-[#0097ff] items-center justify-center rounded-ful">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                                    class="w-5 h-5" viewBox="0 0 32 32" version="1.1">

                                                    <path
                                                        d="M26 15.036c-0.69 0-1.25 0.56-1.25 1.25v12.464h-21.5v-21.5h12.464c0.69 0 1.25-0.56 1.25-1.25s-0.56-1.25-1.25-1.25v0h-13.714c-0.69 0-1.25 0.56-1.25 1.25v0 24c0 0.69 0.56 1.25 1.25 1.25h24c0.69-0.001 1.249-0.56 1.25-1.25v-13.714c-0-0.69-0.56-1.25-1.25-1.25h-0zM31.248 1.917c-0.046-0.648-0.578-1.158-1.231-1.167h-10.017c-0.69 0-1.25 0.56-1.25 1.25s0.56 1.25 1.25 1.25v0h6.982l-15.866 15.865c-0.227 0.226-0.367 0.539-0.367 0.885 0 0.691 0.56 1.251 1.251 1.251 0.345 0 0.658-0.14 0.884-0.366v0l15.866-15.867v6.982c0 0.69 0.56 1.25 1.25 1.25s1.25-0.56 1.25-1.25v0-9.991c0-0.031 0-0.062-0.002-0.092z" />
                                                </svg>
                                            </button>
                                        </a>
                                    </td>
                                </tr>

                                <tr class="border-b border-[#dfe0df]" v-if="!validEvents.length">
                                    <td class="px-4 py-[15px] text-gray-500 text-nowrap">Nenhum evento encontrado</td>
                                </tr>
                            </tbody>

                            <tbody v-else>
                                <tr>
                                    <td class="p-4 text-center">
                                        <BtnSpinner />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <ul class="flex flex-col lg:hidden items-center" v-if="validEvents?.length">
                        <li class="w-full py-[10px] px-[20px] border-b-[5px] border-[#eee]"
                            v-for="eventWrapper in validEvents" :key="eventWrapper.event._id"
                            @click="goToDashboard(eventWrapper.event.id)">
                            <div class="flex py-2 items-center w-full justify-between">
                                <p class="text-sm mb-1 font-normal text-gray-900" style="color: rgb(25, 31, 40);">
                                    {{ truncateText(eventWrapper.event.name || "Evento", 30) }}
                                </p>
                                <!-- MENU -->
                                <Menu as="div" class="relative">
                                    <MenuButton @click.stop
                                        class="w-8 h-8 flex items-center justify-center rounded-lg transition">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20"
                                            fill="currentColor">
                                            <path
                                                d="M3 8a2 2 0 100 4 2 2 0 000-4zm5 2a2 2 0 114 0 2 2 0 01-4 0zm7 0a2 2 0 114 0 2 2 0 01-4 0z" />
                                        </svg>
                                    </MenuButton>

                                    <transition @click.stop enter-active-class="transition duration-100 ease-out"
                                        enter-from-class="transform scale-95 opacity-0"
                                        enter-to-class="transform scale-100 opacity-100"
                                        leave-active-class="transition duration-75 ease-in"
                                        leave-from-class="transform scale-100 opacity-100"
                                        leave-to-class="transform scale-95 opacity-0">
                                        <MenuItems
                                            class="absolute right-0 top-[110%] z-50 w-[210px] origin-top-right bg-white shadow-lg ring-1 ring-black/5 focus:outline-none overflow-hidden">
                                           

                                            <!-- Painel -->
                                            <MenuItem v-slot="{ active }">
                                            <button @click.stop="goToDashboard(eventWrapper.event.id)" :class="[
                                                active ? 'bg-gray-100' : '',
                                                'flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 transition'
                                            ]">
                                                <span>Painel de controle</span>
                                            </button>
                                            </MenuItem>

                                            <!-- Editar -->
                                            <MenuItem  v-slot="{ active }">
                                            <router-link :to="`/eventos/${eventWrapper.event._id}`" :class="[
                                                active ? 'bg-gray-100' : '',
                                                'flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 transition'
                                            ]">
                                                 <span>Editar evento</span>
                                            </router-link>
                                            </MenuItem>

                                            <!-- Ver página -->
                                            <MenuItem v-slot="{ active }">
                                            <a :href="`/evento/${eventWrapper.event.slug}`" target="_blank" :class="[
                                                active ? 'bg-gray-100' : '',
                                                'flex w-full items-center gap-3 px-4 py-2 pb-2.5 text-sm text-gray-700 transition'
                                            ]">
                                                <span>Ir à página do evento</span>
                                            </a>
                                            </MenuItem>
                                        </MenuItems>
                                    </transition>
                                </Menu>
                            </div>

                            <div class="flex py-2 text-xs justify-between items-center">
                                <span class="text-gray-500 min-w-[80px]">
                                    <div class="flex items-center gap-2">
                                        <div class="w-[12px] h-[12px] rounded-full"
                                            :class="statusColor(eventWrapper.event.status || 'r')"></div>

                                        <p class="text-xs !bg-transparent"
                                            :class="statusColor(eventWrapper.event.status || 'r')">
                                            {{ statusLegends(eventWrapper.event.status || 'r') }}
                                        </p>
                                    </div>
                                </span>

                                <span class="flex text-[#50525f] items-center">
                                    <svg class="mr-2 shrink-0" xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                        viewBox="0 0 32 32">
                                        <path fill="#848C9B" fill-rule="evenodd"
                                            d="M21.204 4c.414 0 .752.338.752.75v.856H23.8c2.04 0 3.7 1.652 3.7 3.683v13.437a.686.686 0 0 1-.688.684.686.686 0 0 1-.687-.684v-10.29H6.375v11.881A2.323 2.323 0 0 0 8.7 26.633h18.113c.379 0 .687.306.687.684a.686.686 0 0 1-.688.683H8.7C6.66 28 5 26.348 5 24.317V9.289c0-2.03 1.66-3.683 3.7-3.683h1.803V4.75a.753.753 0 0 1 1.505 0v.856h3.469V4.75a.754.754 0 0 1 1.506 0v.856h3.468V4.75c0-.412.339-.75.753-.75zm5.653 20.28l.087.013a.91.91 0 0 1 .13.037c.042.02.084.042.121.063a.69.69 0 0 1 .251.833.592.592 0 0 1-.062.115c-.027.037-.053.073-.084.104a.511.511 0 0 1-.105.083c-.037.026-.079.047-.12.068a.91.91 0 0 1-.262.053.698.698 0 0 1-.634-.423 1.413 1.413 0 0 1-.042-.13 1.139 1.139 0 0 1-.01-.13.546.546 0 0 1 .052-.266.463.463 0 0 1 .063-.114.555.555 0 0 1 .084-.105.855.855 0 0 1 .105-.088c.037-.021.078-.042.12-.063.042-.016.084-.026.126-.037a.587.587 0 0 1 .267 0zm-10.66-3.127c.578 0 1.047.467 1.047 1.043 0 .575-.469 1.042-1.047 1.042a1.045 1.045 0 0 1-1.047-1.042c0-.576.469-1.043 1.047-1.043zm-5.76 0c.579 0 1.047.467 1.047 1.043 0 .575-.468 1.042-1.046 1.042a1.044 1.044 0 0 1-1.048-1.042c0-.576.469-1.043 1.048-1.043zm0-6.374a2.289 2.289 0 0 1 2.292 2.28 2.289 2.289 0 0 1-2.291 2.28 2.289 2.289 0 0 1-2.292-2.28 2.289 2.289 0 0 1 2.291-2.28zm5.76 1.238c.578 0 1.047.467 1.047 1.043 0 .575-.469 1.042-1.047 1.042a1.045 1.045 0 0 1-1.047-1.042c0-.576.469-1.043 1.047-1.043zm5.76 0c.578 0 1.047.467 1.047 1.043 0 .575-.469 1.042-1.047 1.042a1.045 1.045 0 0 1-1.048-1.042c0-.576.47-1.043 1.048-1.043zm-11.52.13a.915.915 0 0 0-.916.912c0 .504.41.913.916.913a.915.915 0 0 0 .917-.913.915.915 0 0 0-.916-.912zm.066-9.172H8.7a2.323 2.323 0 0 0-2.325 2.314v1.78h19.75v-1.78A2.323 2.323 0 0 0 23.8 6.975h-1.844v1.004a.753.753 0 0 1-1.505 0V6.974h-3.468V7.98a.753.753 0 0 1-1.506 0V6.974h-3.469V7.98a.753.753 0 0 1-1.505 0V6.974z" />
                                    </svg>

                                    <p> {{ moment(eventWrapper.event.starts_at?.date).format("DD/MM/YYYY") }}</p>
                                </span>
                                <span class="flex text-[#50525f] items-center max-w-[146px]">
                                    <svg class=" shrink-0" xmlns="http://www.w3.org/2000/svg" width="28" height="28"
                                        viewBox="0 0 24 24">
                                        <path fill="#848C9B" fill-rule="evenodd"
                                            d="M12 3c3.942 0 7.412 3.462 7.412 7.412a7.373 7.373 0 0 1-2.174 5.237l-.494.491-.431.43a.53.53 0 0 1-.748-.748l.928-.92a6.296 6.296 0 0 0 1.86-4.49A6.515 6.515 0 0 0 12 4.059a6.353 6.353 0 0 0-4.493 10.839L12 19.39l.935-.943a.533.533 0 0 1 .752.752l-1.316 1.313a.526.526 0 0 1-.749 0L6.76 15.649A7.412 7.412 0 0 1 12 3zm2.266 14.118a.53.53 0 0 1 .72-.04.522.522 0 0 1 .039.746v.02a.519.519 0 0 1-.73.01.526.526 0 0 1-.03-.736zM12 7.508a2.901 2.901 0 1 1-.007 5.802A2.901 2.901 0 0 1 12 7.506zm.703 1.199a1.842 1.842 0 1 0-1.413 3.403 1.842 1.842 0 0 0 1.413-3.403z" />
                                    </svg>

                                    <p class="truncate"> {{ eventWrapper.event.address?.location || "Indefinido" }}</p>
                                </span>
                            </div>
                        </li>
                    </ul>

                    <div class="w-full">
                        <div class="flex flex-col sm:flex-row items-center justify-between py-4 px-4">
                            <!-- Informação de resultados -->
                            <div class="flex items-center gap-2 mb-4 sm:mb-0">
                                <p class="text-xs flex-1 text-gray-500">
                                    Mostrando
                                    <span class="font-medium">{{ events?.metadata?.page || 1 }}</span>
                                    a
                                    <span class="font-medium">{{ events?.metadata?.limit || 10 }}</span>
                                    de
                                    <span class="font-medium">{{ events?.metadata?.total || 0 }}</span>
                                    resultados
                                </p>

                            </div>


                            <!-- Controles de paginação -->
                            <div class="flex items-center space-x-2">
                                <button @click="handlePrevPage" :disabled="!events?.metadata?.hasPrevPage"
                                    class="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    :class="{ 'opacity-50 cursor-not-allowed': !events?.metadata?.hasPrevPage }">
                                    Anterior
                                </button>
                                <select v-model="limit" @change="performSearch"
                                    class="block w-auto px-[20px] py-2 text-xs font-medium shrink-0 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none">
                                    <option value="10">10</option>
                                    <option value="15">15</option>
                                    <option value="20">20</option>
                                    <option value="30">30</option>
                                </select>
                                <button @click="handleNextPage" :disabled="!events?.metadata?.hasNextPage"
                                    class="px-4 py-2 text-xs font-medium text-white bg-[#0097ff] border border-transparent rounded-md focus:outline-none focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    :class="{ 'opacity-50 cursor-not-allowed': !events?.metadata?.hasNextPage }">
                                    Próximo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--end content result -->
        </div>
        <!--end body -->
    </div>
    <!--end page my events -->

</template>

<style>
.arrow {
    display: inline-block;
    vertical-align: middle;
    width: 0;
    height: 0;
    margin-left: 5px;
    position: relative;
}

.noorder>span:before {
    border-bottom-color: #cbcbcf !important;
    margin-top: -14px;
}

.noorder>span:after {
    border-top-color: #cbcbcf !important;
    margin-top: 1px;
}

.ASC>span:before,
.DESC>span:after,
.noorder>span:after,
.noorder>span:before {
    border: 6px solid transparent;
    content: "";
    display: block;
    height: 0;
    right: -15px;
    top: 50%;
    position: absolute;
    width: 0;
}

:after,
:before {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}
</style>