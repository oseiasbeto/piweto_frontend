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

const { events: topViewedEvents, getEvents: getTopViewedEvents, loading: loadingTopViewed, error: errorTopViewed, metadata: topViewedEventsMetadata } = useEvents();

const { events: newEvents, getEvents: getNewEvents, loading: loadingNewEvents } = useEvents();

const loadingGlobal = ref(true)
const router = useRouter()
const route = useRoute()


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

   const sevenDaysAgo = new Date(); 
   sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Buscar eventos da semana
    await getNewEvents({
        status: "a",
        page: 1,
        limit: 10,
        sort: "-created_at",
        //"created_at[gte]": sevenDaysAgo,
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

        <HeaderCategories />


        <!-- start carossel area-->
        <div>
            <CarosselEvents :auto-play="true" :loading="loadingNewEvents" :events="newEvents" />
        </div>

        <!--start eventos top-->
        <div class="w-full mt-2.5 lg:mt-8">
            <CarosselEvents :error="errorTopViewed" :loading="loadingTopViewed" :metadata="topViewedEventsMetadata"
                :events="topViewedEvents" title="Próximos eventos" />
        </div>
    </div>

    <!--start for organizers-->
    <ForOrganizers />
    <!--end for organizers-->
</template>