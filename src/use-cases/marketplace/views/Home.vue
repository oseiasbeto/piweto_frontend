<script setup>
import { onMounted, ref } from "vue";
import Search from '../components/ui/Search.vue';
import { useEvents } from "../../../repositories/events-repository";
import moment from "moment";
import ListEvents from "../components/ui/ListEvents.vue";
import CarosselEvents from "../components/ui/CarosselEvents.vue";
import Spinner from "@/use-cases/checkout/components/ui/Spinner.vue";
import ForOrganizers from "../components/ui/ForOrganizers.vue";
import { useRoute, useRouter } from "vue-router";
import Container from "../components/ui/Container.vue";
import HeaderCategories from "../components/ui/HeaderCategories.vue";

const { events: topViewedEvents, getEvents: getTopViewedEvents, loading: loadingTopViewed, error: errorTopViewed, metadata: topViewedEventsMetadata, loadMore: getTopViewedEventsLoadMore, loadingLoadMore: topViewedEventsloadingLoadMore } = useEvents();

const { events: newEvents, getEvents: getNewEvents, loading: loadingNewEvents } = useEvents();

const loadingGlobal = ref(true)
const router = useRouter()
const route = useRoute()

const TopViewedLoadMore = async () => {
    // Buscar eventos mais vistos nas últimas 24 horas
    await getTopViewedEventsLoadMore({
        status: "a",
        sort: "-views",
        limit: 10
    });
}

const goToSearch = (keywords) => {
    router.push({ path: '/eventos/pesquisar', query: { ...route.query, s: keywords || undefined } })
}

onMounted(async () => {
    // Buscar eventos mais vistos nas últimas 24 horas
    await getTopViewedEvents({
        status: "a",
        sort: "-views",
        page: 1,
        limit: 10
    }).then(() => {
        loadingGlobal.value = false
    });

    // Buscar eventos da semana
    await getNewEvents({
        status: "a",
        page: 1,
        limit: 10,
        sort: "-created_at"
    });
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

        <HeaderCategories/>
        

        <div class="lg:mb-6">
            <CarosselEvents :loading="loadingNewEvents" :events="newEvents" />
        </div>

        <div v-if="!newEvents.length" class="mt-8"></div>

        <div class="w-full px-6 lg:px-4 mt-2.5 lg:mt-8">
            <ListEvents 
                title="Eventos nos principais estados" 
                :error="errorTopViewed" 
                :loading="loadingTopViewed"
                @onloadmore="TopViewedLoadMore()" 
                :btn-loading-more="topViewedEventsloadingLoadMore"
                :metadata="topViewedEventsMetadata" 
                :events="topViewedEvents" 
            />
        </div>
    </div>

    <!--start for organizers-->
    <ForOrganizers />
    <!--end for organizers-->
</template>