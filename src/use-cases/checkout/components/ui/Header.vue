<template>
    <div
        class="text-xl flex items-center lg:hidden mb-2.5 font-bold h-14 bg-white border-b border-[#dde0e4] shadow-[0_1px_4px_0_rgba(0,0,0,0.15),0_0_4px_0_rgba(0,0,0,0.12)] fixed top-12 w-full z-[999]">
        <div class="flex justify-between w-full items-center font-bold text-center text-base text-[#191f28] m-0 px-4">
            <button @click="router.back()" class="outline-none pr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24"
                    fill="none">
                    <path d="M11 6L5 12M5 12L11 18M5 12H19" stroke="#0096ff" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </button>
            <div class="whitespace-nowrap truncate overflow-hidden mr-10 flex-1">{{ title }}</div>
        </div>

    </div>
</template>


<script setup>
import { useRouter } from "vue-router";
const router = useRouter()
defineProps({
    title: {
        type: String,
        default: "Concluir pedido"
    }
})
</script>