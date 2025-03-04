<script setup>
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { onMounted, watch, ref } from "vue";
import Container from '../components/ui/Container.vue';
import Search from '../components/ui/Search.vue';
import { useEvents } from "../../../repositories/events-repository";
import ListEvents from "../components/ui/ListEvents.vue";
import Spinner from "@/use-cases/checkout/components/ui/Spinner.vue";

const { events, getEvents, metadata, loading, error } = useEvents();

const store = useStore()
const route = useRoute()
const router = useRouter()

const searchKeywords = ref("");

const goToSearch = (keywords) => {
    loading.value = true
    router.push({ query: { ...route.query, s: keywords || undefined } })
    searchKeywords.value = keywords
    getEvents({
        status: "a",
        page: 1,
        limit: 10,
        tags: keywords
    });
}


watch(
    () => route.query.s, // Certifique-se de passar uma função que retorna o valor
    (newQuery, oldQuery) => {
        goToSearch(newQuery)
    }
);

onMounted(() => {

    if (!route.query.s) {
        router.replace('/')
    } else {
        // Buscar eventos da semana
        goToSearch(route.query.s)
    }

})
</script>

<template>
    <Container>
        <div class="px-4 xl:px-0">
            <div class="flex flex-col lg:flex-row lg:justify-between lg:items-center">
                <h1 class="font-bold mt-7 my-0 lg:my-5 text-2xl lg:text-3xl">Pesquisa de Eventos</h1>
                <div class="flex items-center text-[#6c757d]">
                    <router-link class="text-brand-primary hover:underline" to="/">Home</router-link>
                    <span class="mx-1.5">/</span>
                    <p>Pesquisa de Eventos</p>
                </div>
            </div>

        </div>
    </Container>
    <div class="mt-5 lg:mt-4 mb-2">
        <hr>
    </div>
    <Container>
        <div class="px-4 xl:px-0">
            <div class="mx-auto py-4 w-full lg:w-[540px]">
                <Search v-model="searchKeywords" @onsearch="goToSearch" />
            </div>
            <div class="mt-5 lg:mt-4 mb-2">
                <hr>
            </div>
        </div>
        <div>
            <div v-if="!loading">
                <div class="w-full px-4 mt-8" v-if="events.length">
                    <ListEvents
                        title="Eventos encontrados"
                        :metadata="metadata" :show-btn-load-more="false" :error="error" :loading="loading"
                        :events="events" />
                </div>
                <div v-else class="mt-5 px-4 xl:px-0" style="margin-bottom: 210px;">
                    <h1 class=" text-xl font-bold">Não encontramos eventos com estas palavras. Você pode fazer uma nova
                        busca ;)</h1>
                </div>
            </div>
            <div v-else>
                <div class="flex justify-center items-center h-[300px]">
                    <Spinner />
                </div>
            </div>
        </div>
    </Container>

</template>