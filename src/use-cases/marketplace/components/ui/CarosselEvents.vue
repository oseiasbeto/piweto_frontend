<script setup>
import { ref, onMounted } from "vue";
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import EventCardSkeleton from "./EventCardSkeleton.vue";

import '@splidejs/splide/dist/css/splide.min.css';

import EventCard from "./EventCard.vue";
import Container from "./Container.vue";

const props = defineProps({
    title: {
        type: String,
        default: null
    },
    loading: {
        type: Boolean,
        default: true
    },
    events: {
        type: Array,
        required: true
    }
})

const splideRef = ref(null);
const isAtStart = ref(true);
const isAtEnd = ref(false);

const goPrev = () => {
    splideRef.value.go("<");
};

const goNext = () => {
    splideRef.value.go(">");
};

onMounted(() => {
    const splide = splideRef.value.splide
    splide.on('moved', () => {
        isAtStart.value = splide.index === 0 ? true : false;
        isAtEnd.value = splide.index === splide.length - splide.options.perPage;
    });
})
</script>

<template>
    <div>


        <!-- start body carossel area-->
        <Container>
            <section v-if="loading || events?.length" class="w-full mt-2 lg:mt-7">
                <!-- Arrows Personalizados -->
                <button v-if="!loading" @click="goPrev" class="absolute left-0 top-1/2 -translate-y-1/2 z-10 
                       bg-white shadow-md hover:shadow-lg
                       w-10 h-10 hidden lg:flex items-center justify-center
                       rounded-full transition">
                    <!-- Left Arrow -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <button v-if="!loading" @click="goNext" class="absolute right-0 top-1/2 -translate-y-1/2 z-10 
                       bg-white shadow-md hover:shadow-lg
                       w-10 h-10 hidden lg:flex items-center justify-center
                       rounded-full transition">
                    <!-- Right Arrow -->
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
                <Splide :key="loading" ref="splideRef" :options="{
                    type: 'loop',
                    perPage: 4,
                    arrows: false,
                    pagination: false,
                    padding: { left: '1rem', right: '1rem' },
                    gap: '1.5rem',
                    autoplay: !loading,
                    interval: 3000,
                    pauseOnHover: true,
                    drag: !loading,
                    swipe: !loading,
                    breakpoints: {
                        1024: {
                            perPage: 4,
                            gap: '1rem',
                            padding: { left: '1.5rem', right: '1.5rem' }
                        },
                        768: {
                            perPage: 2,
                            gap: '1rem',
                            padding: { left: '1.5rem', right: '1.5rem' }
                        },
                        640: {
                            perPage: 1,
                            gap: '0.75rem',
                            padding: { left: '24px', right: '24px' },
                        }
                    }
                }">
                    <!-- Quando estiver carregando -->
                    <template v-if="loading">
                        <SplideSlide v-for="n in 4" :key="'skeleton-' + n">
                            <EventCardSkeleton />
                        </SplideSlide>
                    </template>

                    <!-- Quando já tiver dados -->
                    <template v-else>
                        <SplideSlide v-for="event in events" :key="event._id">
                            <EventCard :isBigCover="false" :event="event" />
                        </SplideSlide>
                    </template>
                </Splide>
            </section>
        </Container>

        <!-- end body carossel area-->
    </div>
</template>