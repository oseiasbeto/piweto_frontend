<script setup>
import { useRoute } from "vue-router"
import { useStore } from "vuex";
import { ref, onMounted } from "vue"
import Modal from "./components/ui/Modal.vue";
import Navbar from "./components/ui/Navbar.vue";
import Events from "./views/Events.vue";
import NewEvent from "./views/NewEvent.vue";
import EditEvent from "./views/EditEvent.vue";
import SplashScreen from "./components/ui/SplashScreen.vue"

const route = useRoute()

const loading = ref(true)

onMounted(() => {
    // simula carregamento (ou coloca aqui suas requests reais)
    setTimeout(() => {
        loading.value = false
    }, 1500)
})

const store = useStore()
</script>

<template>
    <div class="relative evently !font-tertiary">
        <div v-if="!loading" class="relative">
            <!--start navbar-->
            <Navbar />
            <!--end navbar-->

            <!--start views dashboard-->
            <div class="mt-0">
                <Events v-if="route.name == 'My events'" />
                <NewEvent v-if="route.name == 'New event'" />
                <EditEvent v-if="route.name == 'Edit event'" />
            </div>
            <!--end views dashboard-->

            <!--start chat-->
            <a class="w-[48px] lg:w-auto z-[100] lg:px-4 gap-1.5 rounded-full lg:rounded-[40px] hover:shadow-[0_0_6px_1px_#4be76a,0_20px_24px_-4px_rgba(0,0,0,0.12)] shadow-[0_0_6px_0_rgba(75,231,106,0),0_20px_24px_-4px_rgba(0,0,0,0.12)] text-black fixed right-[20px] bottom-[20px] h-[48px] flex justify-center items-center bg-[#4be76a]"
                href="https://wa.me/948360831" target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" class="w-6 h-6" viewBox="0 0 31.925 31.925">

                    <g transform="translate(-673.321 -514.099)">

                        <path
                            d="M689.284,516.1a13.962,13.962,0,1,1-13.963,13.962A13.977,13.977,0,0,1,689.284,516.1m0-2a15.962,15.962,0,1,0,15.962,15.962A15.962,15.962,0,0,0,689.284,514.1Z" />

                        <path
                            d="M687.65,531.612a2.374,2.374,0,0,1,.49-1.433,9.248,9.248,0,0,1,1.443-1.483,10.084,10.084,0,0,0,1.321-1.371,1.993,1.993,0,0,0,.367-1.2,1.953,1.953,0,0,0-1.982-2,2.073,2.073,0,0,0-1.419.543,3.56,3.56,0,0,0-.954,1.582l-2.152-.939a5.027,5.027,0,0,1,1.724-2.657,4.632,4.632,0,0,1,2.9-.926,4.959,4.959,0,0,1,2.287.531,4.154,4.154,0,0,1,1.651,1.5,3.979,3.979,0,0,1,.611,2.175,3.681,3.681,0,0,1-.538,1.965,8.76,8.76,0,0,1-1.638,1.865,13.792,13.792,0,0,0-1.359,1.322,1.536,1.536,0,0,0-.379,1,2.868,2.868,0,0,0,.1.667h-2.2A2.74,2.74,0,0,1,687.65,531.612Zm1.468,6.969a1.855,1.855,0,0,1-1.357-.543,1.831,1.831,0,0,1-.551-1.359,1.875,1.875,0,0,1,.551-1.372,1.835,1.835,0,0,1,1.357-.556,1.868,1.868,0,0,1,1.908,1.928,1.833,1.833,0,0,1-.549,1.359A1.863,1.863,0,0,1,689.118,538.581Z" />

                    </g>

                </svg>

                <p class="text-[11px] hidden lg:block tracking-[1px] uppercase">Ajuda</p>
            </a>
            <!--end chat-->

            <!--start modal dashboard-->
            <Modal />
            <!--end modal dashboard-->
        </div>
        <SplashScreen v-else :visible="loading" />
    </div>
</template>

<style>
.evently {
    line-height: 1.846 !important;
    font-size: 13px !important;
}
</style>
