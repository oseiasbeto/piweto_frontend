<script setup>
import { useRoute } from "vue-router"
import { onMounted, computed } from "vue"
import { useStore } from "vuex"
import { useStaffs } from "@/repositories/staffs-repository";
import Modal from "./components/ui/Modal.vue";
import Navbar from "./components/ui/Navbar.vue";
import Sidebar from "./components/ui/Sidebar.vue";
import { toast } from "vue3-toastify"
import Dashboard from "./views/Dashboard.vue";
import Tickets from "./views/Tickets.vue";
import Partakers from "./views/Partakers.vue";
import CheckIn from "./views/CheckIn.vue";
import Finance from "./views/Finance.vue";
import Spinner from "../checkout/components/ui/Spinner.vue";
import AlertConfirmEmail from "@/components/AlertConfirmEmail.vue";
import Staffs from "./views/Staffs.vue";
import SplashScreen from "../checkout/components/ui/SplashScreen.vue";

const { getStaffById, loading: loadingStaff } = useStaffs()
loadingStaff.value = true

const route = useRoute()
const store = useStore()

const currentUser = computed(() => {
    return store.getters.currentUser
})

const _toast = computed(() => {
    return store.getters.toast
})

onMounted(async () => {
    const id = route.params.id
    if (!id) return
    else {
        await getStaffById(id).then(res => {
            const event = res.data.event;
            const staff = res.data.staff;
            
            store.dispatch("setStaff", staff)
            store.dispatch("setEvent", event)

            if (_toast.value.show) {
                toast(_toast.value.message, {
                    theme: "colored",
                    position: "top-right",
                    autoClose: _toast.value.timeout,
                    type: _toast.value.type
                })
            } else return
        })
    }

})

</script>

<template>
    <div v-if="loadingStaff" class="flex justify-center items-center h-[500px]">
        <SplashScreen />
    </div>
    <div v-else class="relative">


        <!--start navbar-->
        <navbar />
        <!--end navbar-->

        <div class="flex relative z-[10] flex-row">
            <!--start sidebar dashboard-->
            <sidebar />
            <!--end sidebar dashboard-->

            <!--start views dashboard-->
            <div class="lg:ml-[120px] relative w-full lg:w-[calc(100%-120px)]">
                <div class="mt-0 w-full p-6">
                    <div v-if="!currentUser.email" class="mb-5">
                        <AlertConfirmEmail/>
                    </div>
                    
                    <Dashboard v-if="route.name == 'Dashboard'" />
                    <Tickets v-if="route.name == 'Tickets'" />
                    <Staffs v-if="route.name == 'Staffs'" />
                    <Partakers v-if="route.name == 'Partakers'" />
                    <CheckIn v-if="route.name == 'Check in'" />
                    <Finance v-if="route.name == 'Finance'" />
                </div>
            </div>
            <!--end views dashboard-->

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
        </div>

        <!--start bg-->
        <div class="fixed top-0 h-screen w-screen bg-gray-50"></div>
        <!--end bg-->

        <!--start modal dashboard-->
        <modal />
        <!--end modal dashboard-->
    </div>

</template>