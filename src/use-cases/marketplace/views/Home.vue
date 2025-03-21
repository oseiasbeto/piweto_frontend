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
    <div v-if="!loadingGlobal" class="relative">
        <div class="lg:mb-6" v-if="!loadingNewEvents && newEvents.length">
            <CarosselEvents :events="newEvents" />
        </div>
        <div v-if="!newEvents.length" class="mt-8"></div>

        <div v-if="topViewedEvents.length" class="px-4 xl:px-0">
            <div class="mx-auto w-full lg:w-[540px]">
                <Search @onsearch="goToSearch" />
            </div>
        </div>
        <div class="w-full px-4 mt-8" v-if="topViewedEvents.length">
            <ListEvents title="Eventos em destaque" :error="errorTopViewed" :loading="loadingTopViewed"
                @onloadmore="TopViewedLoadMore()" :btn-loading-more="topViewedEventsloadingLoadMore"
                :metadata="topViewedEventsMetadata" :events="topViewedEvents" />
        </div>
    </div>
    <div v-else class="flex justify-center items-center h-[500px]">
        <Spinner />
    </div>
    <!--start for organizers-->
    <ForOrganizers />
    <!--end for organizers-->
</template>