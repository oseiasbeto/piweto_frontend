<script setup>
import Logo from '@/components/Logo.vue';
import UserMenu from '@/components/UserMenu'
import { computed } from "vue"
import { useStore } from 'vuex';

// Define as props deste componente.
const props = defineProps({
    sticked: {
        type: Boolean,
        default: true
    }
})


const isViewMobile = computed(() => {
    return store.getters.isViewMobile
})

const store = useStore()

const toggleSidebar = () => {
    store.dispatch("toggleIsViewMobile")
}

// Esta função computada tem como finalidade atribuir uma classe dinâmica a este componente.
const positionClass = computed(() => {
    if (props.sticked) {
        return "sticky top-0"
    } else {
        return "relative"
    }
})
</script>

<template>
    <!--start navbar component-->
    <div class="bg-white border-b z-[100] lg:border-none border-gray-200 px-[20px] lg:px-8 shadow-nav flex justify-between items-center w-[100%] h-[47px] lg:h-[70px]"
        :class="positionClass">
        <!--start left area-->
        <div class="block lg:hidden">
            <button @click="toggleSidebar()" class="text-brand-primary block lg:hidden">
                <svg v-if="!isViewMobile" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="32px" height="32px"
                    viewBox="0 0 1024 1024">
                    <title>Artboard</title>
                    <path
                        d="M768 307.2V384H384v-76.8h384zM384 537.6h384v-76.8H384v76.8zm0 153.6h384v-76.8H384v76.8zM256 384h76.8v-76.8H256V384zm76.8 153.6v-76.8H256v76.8h76.8zM256 691.2h76.8v-76.8H256v76.8z"
                        fill-rule="evenodd" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="32px" height="32px"
                    viewBox="0 0 1024 1024">
                    <path
                        d="M697.4 759.2l61.8-61.8L573.8 512l185.4-185.4-61.8-61.8L512 450.2 326.6 264.8l-61.8 61.8L450.2 512 264.8 697.4l61.8 61.8L512 573.8z" />
                </svg>
            </button>
        </div>
        <div class="flex items-center">
            <Logo size="w-[80px] lg:w-[110px]" />
            <router-link to="/eventos/meus-eventos"
                class="hidden lg:block text-gray-500 border-l-2 px-2 ml-2 cursor-pointer border-gray-200 text-sm uppercase">
                <p>Área do produtor</p>
            </router-link>
        </div>
        <div>
            <!--start avatar area-->
            <UserMenu />
            <!--end avatar area-->
        </div>
        <!--end right area-->
    </div>
    <!--end navbar component-->
</template>

<style scoped>
.shadow-nav {
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, .3)
}
</style>
