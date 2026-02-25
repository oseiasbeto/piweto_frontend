<script setup>
import { useRoute } from "vue-router"
import { useStore } from "vuex";
import { computed } from "vue";
import Modal from "./components/ui/Modal.vue";
import Navbar from "./components/ui/Navbar.vue";
import Sidebar from "./components/ui/Sidebar.vue";
import PageNotFound from "./views/errors/PageNotFound.vue";
import InternalErrorServer from "./views/errors/InternalErrorServer.vue";
import Home from "./views/Home.vue";
import AuthUser from "./views/auth/AuthUser.vue";
import RegisterUser from "./views/auth/RegisterUser.vue";
import About from "./views/About.vue";
import ResetPassword from "./views/auth/ResetPassword.vue";
import Search from "./views/Search.vue";
import Footer from "./components/ui/Footer.vue";
import MyTickets from "./views/MyTickets.vue";
import TermsOfUse from "./views/TermsOfUse.vue";
import PrivacyPolicy from "./views/PrivacyPolicy.vue";
import ForgotPassword from "./views/auth/ForgotPassword.vue";
import CheckEmail from "./views/auth/CheckEmail.vue";

const route = useRoute()
const store = useStore()

const sidebar = computed(() => {
    return store.getters.sidebar
})

</script>

<template>
    <div class="relative">
        <!--start navbar-->
        <Navbar />
        <!--end navbar-->

        <!--start views marketplace-->
        <div class="mt-0">
            <Home v-if="route.name == 'Marketplace'" />
            <!--start pages-->
            <AuthUser v-if="route.name == 'Auth user'" />
            <RegisterUser v-if="route.name == 'Register user'" />
            <ResetPassword v-if="route.name == 'Reset password'" />
            <ForgotPassword v-if="route.name == 'Forgot password'" />
            <CheckEmail v-if="route.name == 'Check email'" />
            <Search v-if="route.name == 'Search'" />
            <MyTickets v-if="route.name == 'My tickets'" />
            <TermsOfUse v-if="route.name == 'Terms of use'" />
            <PrivacyPolicy v-if="route.name == 'Privacy Policy'" />
            <About v-if="route.name == 'How does it work'" />
            <!--end pages-->


            <!--start error pages-->
            <PageNotFound v-if="route.name == 'Page not found' || route.name == 'Page not found api'" />
            <InternalErrorServer v-if="route.name == 'Internal error server'" />
            <!--end error pages-->

            <Sidebar :isView="sidebar.show" />

            <!--start footer-->
            <Footer/>
            <!--end footer-->
        </div>
        <!--end views marketplace-->
        
        <!--start modal marketplace-->
        <Modal />
        <!--end modal marketplace-->
    </div>
</template>