<script setup>
import { onMounted, ref } from "vue";
import Search from '../components/ui/Search.vue';
import { useEvents } from "../../../repositories/events-repository";
import ListEvents from "../components/ui/ListEvents.vue";
import { useRoute, useRouter } from "vue-router";
import Container from "../components/ui/Container.vue";

const { events: categoryEvents, getEvents: getCategoryEvents, loading, error, metadata } = useEvents();


const loadingGlobal = ref(true)
const router = useRouter()
const route = useRoute()

const goToSearch = (keywords) => {
    router.push({ path: '/eventos/pesquisar', query: { ...route.query, s: keywords || undefined } })
}

onMounted(async () => {

    if (!route.params.category) {
        router.push({ name: 'Page not found' })
    } else {
        document.title = `Categoria - ${route.params.category} | Piweto`
        // Buscar eventos da categoria
        await getCategoryEvents({
            status: "a",
            page: 1,
            limit: 10,
            sort: "-created_at",
            category: route.params.category
        })
    }
});

</script>

<template>
    <div class="relative">
        <div class="px-5 xl:px-0">
            <Container>
                <div class="lg:py-5 w-full">
                    <Search @onsearch="goToSearch" />
                </div>
            </Container>
        </div>

        <div class="w-full px-4 mt-8">
            <ListEvents 
                :title="route.params.category" 
                :error="error" :loading="loading"
                @onloadmore="getCategoryEvents({ ...route.query, page: metadata.page + 1 })" :btn-loading-more="true"
                :metadata="metadata" :events="categoryEvents" 
            />
        </div>
    </div>
</template>