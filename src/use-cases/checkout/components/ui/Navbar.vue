<script setup>
import { useRoute } from "vue-router";
import Logo from '@/components/Logo.vue';
import { useStore } from "vuex";
import { computed } from "vue";
import Container from '@/use-cases/marketplace/components/ui/Container.vue';
import UserMenu from "@/components/UserMenu.vue";

const route = useRoute()
const store = useStore()

const hasLogged = computed(() => {
    return store.getters.hasLogged
})

</script>

<template>
    <div class="bg-[#191f28] sticky border-b border-b-[rgb(76,87,108)] z-[9999] top-0 h-12 lg:h-16 w-full">
        <Container>
            <div class="flex relative justify-between px-3 lg:px-4 items-center">
                <div>
                    <button class="flex lg:hidden items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M22.502 12.487L9.49801 12.5C9.10131 12.4883 8.72327 12.3289 8.43801 12.053C8.29855 11.9128 8.18808 11.7465 8.11293 11.5636C8.03777 11.3807 7.9994 11.1847 8.00001 10.987C8.00343 10.5918 8.16271 10.2139 8.44321 9.93544C8.72371 9.65699 9.10277 9.50051 9.49801 9.5L22.502 9.513C22.8972 9.51351 23.2763 9.66999 23.5568 9.94844C23.8373 10.2269 23.9966 10.6048 24 11C23.9966 11.3952 23.8373 11.7731 23.5568 12.0516C23.2763 12.33 22.8972 12.4865 22.502 12.487ZM9.49801 14.5L22.502 14.513C22.8972 14.5135 23.2763 14.67 23.5568 14.9484C23.8373 15.2269 23.9966 15.6048 24 16C23.9966 16.3952 23.8373 16.7731 23.5568 17.0516C23.2763 17.33 22.8972 17.4865 22.502 17.487L9.49801 17.5C9.10127 17.4885 8.72317 17.3291 8.43801 17.053C8.2985 16.9128 8.18801 16.7465 8.11285 16.5636C8.03769 16.3807 7.99935 16.1848 8.00001 15.987C8.00343 15.5918 8.16271 15.2139 8.44321 14.9354C8.72371 14.657 9.10277 14.5005 9.49801 14.5ZM9.49801 19.5L22.502 19.513C22.8972 19.5135 23.2763 19.67 23.5568 19.9484C23.8373 20.2269 23.9966 20.6048 24 21C23.9966 21.3952 23.8373 21.7731 23.5568 22.0516C23.2763 22.33 22.8972 22.4865 22.502 22.487L9.49801 22.5C9.10131 22.4883 8.72327 22.3289 8.43801 22.053C8.15645 21.7698 7.9989 21.3864 8.00001 20.987C8.00343 20.5918 8.16271 20.2139 8.44321 19.9354C8.72371 19.657 9.10277 19.5005 9.49801 19.5Z"
                                fill="white" />
                        </svg>
                    </button>
                </div>
                <Logo :is-white="true" size="lg:w-[100px] mr-8 lg:mr-0 hover:opacity-80 transition-opacity w-[80px] h-12 lg:h-16" />
                <div>
                </div>
            </div>
        </Container>
    </div>
</template>