<script setup>
import { useRoute, useRouter } from "vue-router";
import Cart from "./views/Cart.vue";
import Order from "./views/Order.vue";
import { computed } from "vue";
import DetailsEvent from "./views/DetailsEvent.vue";
import Navbar from "./components/ui/Navbar.vue";
import Footer from "./components/ui/Footer.vue";
import { useStore } from "vuex";

const route = useRoute()
const router = useRouter()
const store = useStore()

</script>

<template>
    <div class="relative">
        <!--start navbar-->
        <Navbar />
        <!--end navbar-->
        <div class="relative">
            <!--start pages from checkout-->
            <Cart v-if="route.name == 'Cart'" />
            <Order v-if="route.name == 'Order'" />
            <DetailsEvent v-if="route.name == 'Details event'" />
            <!--end pages from checkout-->

            <!--start footer-->
            <Footer/>
            <!--end footer-->
        </div>
    </div>
</template>