<script setup>
import { useRoute } from "vue-router"
import { useStore } from "vuex";
import { onMounted, computed } from "vue";
import { toast } from "vue3-toastify"
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

            <a class="w-[60px] z-40 rounded-full shadow-2xl text-white fixed right-10 bottom-10 h-[60px] flex justify-center items-center bg-[#25d366]"
                href="https://wa.me/948360831" target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#fff"
                    version="1.1" id="Capa_1" width="28px" height="28px" viewBox="0 0 30.667 30.667"
                    xml:space="preserve">
                    <g>
                        <path
                            d="M30.667,14.939c0,8.25-6.74,14.938-15.056,14.938c-2.639,0-5.118-0.675-7.276-1.857L0,30.667l2.717-8.017   c-1.37-2.25-2.159-4.892-2.159-7.712C0.559,6.688,7.297,0,15.613,0C23.928,0.002,30.667,6.689,30.667,14.939z M15.61,2.382   c-6.979,0-12.656,5.634-12.656,12.56c0,2.748,0.896,5.292,2.411,7.362l-1.58,4.663l4.862-1.545c2,1.312,4.393,2.076,6.963,2.076   c6.979,0,12.658-5.633,12.658-12.559C28.27,8.016,22.59,2.382,15.61,2.382z M23.214,18.38c-0.094-0.151-0.34-0.243-0.708-0.427   c-0.367-0.184-2.184-1.069-2.521-1.189c-0.34-0.123-0.586-0.185-0.832,0.182c-0.243,0.367-0.951,1.191-1.168,1.437   c-0.215,0.245-0.43,0.276-0.799,0.095c-0.369-0.186-1.559-0.57-2.969-1.817c-1.097-0.972-1.838-2.169-2.052-2.536   c-0.217-0.366-0.022-0.564,0.161-0.746c0.165-0.165,0.369-0.428,0.554-0.643c0.185-0.213,0.246-0.364,0.369-0.609   c0.121-0.245,0.06-0.458-0.031-0.643c-0.092-0.184-0.829-1.984-1.138-2.717c-0.307-0.732-0.614-0.611-0.83-0.611   c-0.215,0-0.461-0.03-0.707-0.03S9.897,8.215,9.56,8.582s-1.291,1.252-1.291,3.054c0,1.804,1.321,3.543,1.506,3.787   c0.186,0.243,2.554,4.062,6.305,5.528c3.753,1.465,3.753,0.976,4.429,0.914c0.678-0.062,2.184-0.885,2.49-1.739   C23.307,19.268,23.307,18.533,23.214,18.38z" />
                    </g>
                </svg>
            </a>

            <Sidebar :isView="sidebar.show" />

            <!--start footer-->
            <Footer />
            <!--end footer-->
        </div>
        <!--end views marketplace-->
        
        <!--start modal marketplace-->
        <Modal />
        <!--end modal marketplace-->
    </div>
</template>