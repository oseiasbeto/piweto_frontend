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
import Sidebar from "../marketplace/components/ui/Sidebar.vue";
import NavbarCheckout from "./components/ui/NavbarCheckout.vue";

const route = useRoute()
const store = useStore()


const sidebar = computed(() => {
    return store.getters.sidebar
})
</script>

<template>
    <div class="relative min-h-screen bg-white">
        <!--start navbar-->
        <Navbar v-if="route.name !== 'Cart' && route.name !== 'Order'" />
        <NavbarCheckout v-else />
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

        <!--start sidebar-->
        <Sidebar :isView="sidebar.show" />
        <!--end sidebar-->

        <!--start modal-->
        <Modal />
        <!--end modal-->
    </div>

</template>