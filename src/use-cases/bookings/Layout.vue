<script setup>
import { useStore } from 'vuex';
import Container from '../marketplace/components/ui/Container.vue';
import Footer from '../marketplace/components/ui/Footer.vue';
import Navbar from '../marketplace/components/ui/Navbar.vue';
import Auth from './views/Auth.vue';
import { computed } from 'vue';
import Tickets from './views/Tickets.vue';
import Sidebar from '../marketplace/components/ui/Sidebar.vue';

const store = useStore()
const booking = computed(() => store.getters.booking)
const sidebar = computed(() => {
    return store.getters.sidebar
})

</script>

<template>
    <!--start navbar-->
    <Navbar />
    <!--end navbar-->

    <!--start main booking-->
    <div class="relative">
        <Container>
            <div v-if="!booking?._id" class="lg:w-80 p-4 bg-white lg:shadow-lg my-6 lg:my-12 mx-auto">
                <Auth />
            </div>
            <div class="mx-auto" v-else>
                <Tickets :order-id="booking?._id" />
            </div>
        </Container>

        <Sidebar :isView="sidebar.show" />

        <!--start footer-->
        <Footer />
        <!--end footer-->
    </div>
    <!--end main booking-->
</template>