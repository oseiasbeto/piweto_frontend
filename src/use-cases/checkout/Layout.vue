<script setup>
import { useRoute, useRouter } from "vue-router";
import Cart from "./views/Cart.vue";
import Order from "./views/Order.vue";
import { computed } from "vue";
import DetailsEvent from "./views/DetailsEvent.vue";
import Footer from "./components/ui/Footer.vue";
import { useStore } from "vuex";
import Modal from "./components/ui/Modal.vue";
import Navbar from "../marketplace/components/ui/Navbar.vue";

const route = useRoute()
const router = useRouter()
const store = useStore()

</script>

<template>
    <div class="relative min-h-screen bg-[rgba(82,31,142,.077)]" :class="{ 'bg-white': route.name === 'Order' }">
        <!--start navbar-->
        <Navbar />
        <!--end navbar-->

        <!--start main-->
        <main class="relative min-h-[calc(-230px+100vh)]">
            <!--start pages from checkout-->
            <Cart v-if="route.name == 'Cart'" />
            <Order v-if="route.name == 'Order'" />
            <DetailsEvent v-if="route.name == 'Details event'" />
            <!--end pages from checkout-->
        </main>
        <!--end main-->

        <!--start footer-->
        <Footer />
        <!--end footer-->

        <!--start modal-->
        <Modal />
        <!--end modal-->
    </div>

</template>