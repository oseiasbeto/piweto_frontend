<script setup>
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { onMounted, computed, ref } from "vue";
import Container from '../components/ui/Container.vue';
import { useTickets } from "../../../repositories/tickets-repository";
import ListEvents from "../components/ui/ListEvents.vue";
import Search from '../components/ui/Search.vue';
import SplashScreen from "@/use-cases/checkout/components/ui/SplashScreen.vue";
import Spinner from "@/use-cases/checkout/components/ui/Spinner.vue";

const { getTickets, loading } = useTickets();
const { searchUserTickets, loading: loadingSearchTickets } = useTickets();
const { getTicketsLoadMore, loading: loadingLoadMore } = useTickets();

loading.value = true
loadingLoadMore.value = false

const store = useStore()

const user = computed(() => {
    return store.getters.currentUser
})

const tickets = computed(() => {
    return store.getters.tickets
})

const searchKeywords = ref('')
const startSearch = ref(false)

const goToSearch = async (keywords) => {
    startSearch.value = true
    loadingSearchTickets.value = true
    await searchUserTickets({
        page: 1,
        limit: 10,
        keywords
    }).then(res => {
        const tickets = res.data.data;
        const metadata = res.data.pagination;

        store.dispatch("setTickets", {
            data: tickets,
            metadata: metadata,
            keywords,
            hasViewed: true
        })
    });
}

const resetSearch = async () => {
    searchKeywords.value = ''

    setTimeout(() => {
        startSearch.value = false
        loadingSearchTickets.value = true
    }, 50)

    await getTickets({
        page: 1,
        limit: 10
    }).then(res => {
        const tickets = res.data.data;
        const metadata = res.data.pagination;

        store.dispatch("setTickets", {
            data: tickets,
            metadata: metadata,
            hasViewed: true
        })
    }).finally(() => {
        loadingSearchTickets.value = false
    })
}

const ticketsLoadMore = async () => {

    // Buscar eventos mais vistos nas últimas 24 horas
    await getTicketsLoadMore({
        page: tickets?.value?.metadata?.page + 1,
        limit: tickets?.value?.metadata?.limit,
        ...(tickets?.value?.keywords && {
            keywords: tickets?.value?.keywords
        })
    }).then(res => {

        const _tickets = res.data.data;
        const metadata = res.data.pagination;

        store.dispatch("setTickets", {
            data: [
                ...tickets?.value?.data,
                ..._tickets
            ],
            metadata: metadata,
            hasViewed: true
        })
    })
}

onMounted(async () => {
    await getTickets({
        page: 1,
        limit: 10,
    }).then(res => {
        const tickets = res.data.data;
        const metadata = res.data.pagination;

        store.dispatch("setTickets", {
            data: tickets,
            metadata: metadata,
            hasViewed: true
        })
    });
})
</script>

<template>
    <div v-if="user?._id">
        <Container>
            <div class="px-4 xl:px-0">
                <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center">
                    <h1 class="font-bold mt-7 my-0 lg:my-5 text-2xl lg:text-3xl">Meus ingressos</h1>
                    <div class="flex items-center text-[#6c757d]">
                        <router-link class="text-brand-primary hover:underline" to="/">Home</router-link>
                        <span class="mx-1.5">/</span>
                        <p>Meus ingressos</p>
                    </div>
                </div>

            </div>
        </Container>
        <div class="mt-5 lg:mt-4 mb-2">
            <hr>
        </div>
        <Container>
            <div>
                <div v-if="!loading">
                    <div>
                        <div v-if="tickets?.data?.length" class="px-4 xl:px-0">
                            <div class="mx-auto py-4 w-full lg:w-[540px]">
                                <Search v-model="searchKeywords" @onsearch="goToSearch" />
                            </div>
                            <div class="mt-5 lg:mt-4 mb-2">
                                <hr>
                            </div>
                        </div>
                        <div v-if="!loadingSearchTickets">
                            <div class="w-full px-4 mt-8" v-if="tickets?.data?.length">
                                <ListEvents title="Ingressos encontrado(s)" @onloadmore="ticketsLoadMore()"
                                    :loading="loading" :show-btn-load-more="!startSearch"
                                    :btn-loading-more="loadingLoadMore" :metadata="tickets?.metadata"
                                    :events="tickets?.data" :is-ticket-list="true" />
                            </div>
                            <div v-else class="mt-5 px-4 xl:px-0" style="margin-bottom: 210px;">
                                <h1 v-if="startSearch" class="text-xl font-bold">
                                    Nenhum ingresso encontrado! Tente outra busca ou clique em 'Ver meus ingressos' para
                                    voltar.
                                    😉
                                </h1>
                                <h1 class="text-base" v-else="!startSearch">
                                    Você ainda não tem ingressos ou reservas ativas. Explore nossos eventos e garanta o
                                    seu
                                    lugar ;)
                                </h1>
                                <div class="py-5">
                                    <button
                                        class="bg-brand-primary flex justify-center gap-2 items-center text-white hover:opacity-[0.8] w-min whitespace-nowrap font-bold text-sm rounded px-4 h-10 p-2 uppercase disabled:bg-gray-200"
                                        v-if="startSearch" @click="resetSearch">Ver meus ingressos</button>
                                    <router-link v-else to="/"
                                        class="bg-[#0097ff] flex justify-center gap-2 items-center text-white hover:opacity-[0.8] w-min whitespace-nowrap font-bold text-sm rounded px-4 h-10 p-2 uppercase disabled:bg-gray-200"
                                        @click="resetSearch">Ver mais eventos</router-link>
                                </div>

                            </div>
                        </div>
                        <div v-else class="flex justify-center items-center h-[500px]">
                            <Spinner />
                        </div>
                    </div>

                </div>
                <div v-else>
                    <SplashScreen :visible="loading" />
                </div>
            </div>
        </Container>
    </div>
</template>