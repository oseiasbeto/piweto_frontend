<script setup>
import { ref, onMounted } from "vue";
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import '@splidejs/splide/dist/css/splide.min.css';

import EventCard from "./EventCard.vue";
import Container from "./Container.vue";

const props = defineProps({
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
            <section class="w-full mt-7">
                <Splide ref="splideRef" :options="{
                    perPage: 2, arrows: true, pagination: true, gap: '1.5rem',
                    autoplay: true, // Ativa o autoplay
    interval: 3000, // Intervalo de 3 segundos entre os slides
    pauseOnHover: true, // Pausa o autoplay ao passar o mouse
                    breakpoints: {
                        1024: {
                            perPage: 2,
                            perMove: 1,
                            gap: '0.8rem',
                            padding: { left: '1.5rem', right: '1.5rem' }
                        },
                        640: {
                            perPage: 1,
                            perMove: 1,
                            gap: '0.5rem',
                            padding: { left: '1rem', right: '1rem' }
                        }
                    }
                }">
                    <SplideSlide v-for="event in props.events" :key="event._id">
                        <event-card :isBigCover="true" :event="event" />
                    </SplideSlide>
                </Splide>
            </section>
        </Container>

        <!-- end body carossel area-->
    </div>
</template>