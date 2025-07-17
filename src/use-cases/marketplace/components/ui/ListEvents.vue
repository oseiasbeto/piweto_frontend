<script setup>
import { ref, onMounted } from "vue";
import EventCard from "./EventCard.vue";
import Container from "./Container.vue";

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    events: {
        type: Array,
        required: true
    },
    btnLoadingMore: {
        type: Boolean,
        default: false
    },
    metadata: {
        type: Object,
        required: true
    },
    showBtnLoadMore: {
        type: Boolean,
        default: true
    },
    isTicketList: {
        type: Boolean,
        default: false
    }
})

const emots = defineEmits(['onloadmore'])

// Função para carregar mais eventos
const loadMoreEvents = () => {
    if (props.btnLoadingMore) return; // Evita requisições múltiplas enquanto já estiver carregando ou se não houver mais eventos

    emots('onloadmore')
    console.log('Emite uma luz..')
};

</script>

<template>
    <div class="md:mb-8">
        <Container>
            <!-- start header list area-->
            <div class="mx-auto flex justify-between items-center">
                <div class="w-full">
                    <h1 class="text-2xl text-gray-900 font-bold">{{ props.title }}</h1>
                </div>
            </div>
            <!-- end header list area-->

            <!-- start body list area-->
            <section class="flex gap-4 flex-wrap mt-7">
                <div class="w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1rem)]"
                    v-for="event in events" :key="event._id">
                    <event-card :event="isTicketList ? event.event : event" :ticket="isTicketList ? event : null"
                        :isTicket="isTicketList" />
                </div>
            </section>
            <!-- end body list area-->

            <!-- start pagination area -->
            <div v-if="props.showBtnLoadMore && props.metadata.hasNextPage" class="my-6 text-center">
                <button @click="loadMoreEvents" :disabled="btnLoadingMore"
                    class="bg-[#333333] text-white px-6 py-2 rounded-md font-semibold hover:opacity-80 disabled:opacity-50">
                    {{ btnLoadingMore ? 'Carregando...' : 'Ver mais' }}
                </button>
            </div>
            <!-- end pagination area -->
        </Container>
    </div>
</template>
