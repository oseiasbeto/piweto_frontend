<script setup>
import Logo from '@/components/Logo.vue';
import UserMenu from '@/components/UserMenu'
import { computed } from "vue"
import { useRouter } from 'vue-router';

// Define as props deste componente.
const props = defineProps({
    sticked: {
        type: Boolean,
        default: true
    }
})

const router = useRouter()

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
        <button @click="router.back()" class="text-brand-primary block lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="32px" height="32px"
                viewBox="0 0 1024 1024">
                <path d="M604.7 759.2l61.8-61.8L481.1 512l185.4-185.4-61.8-61.8L357.5 512z" />
            </svg>
        </button>
        <div class="flex items-center">
            <Logo size="w-[80px] lg:w-[110px]" />
            <router-link to="/eventos/meus-eventos"
                class="hidden lg:block text-gray-500 border-l-2 px-2 ml-2 cursor-pointer border-gray-200 text-sm uppercase">
                <p>Área do produtor</p>
            </router-link>
        </div>
        <!--end left area-->

        <!--start right area-->
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
