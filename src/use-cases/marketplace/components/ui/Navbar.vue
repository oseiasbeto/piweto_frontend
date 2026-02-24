<script setup>
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { computed, onMounted, onUnmounted, ref } from "vue";
import Logo from "@/components/Logo.vue";
import Container from "./Container.vue";
import UserMenu from "@/components/UserMenu";
import UserTriggerDropdown from "./UserTriggerDropdown.vue";

const hasScroll = ref(false);

const store = useStore()
const router = useRouter()
const route = useRoute()

const sidebar = computed(() => {
    return store.getters.sidebar
})

const toggleSidebar = () => {
    store.dispatch('setSidebar', {
        show: !sidebar.value.show
    })
}

const handleScroll = () => {
    hasScroll.value = window.scrollY > 0;
};


const hasLogged = computed(() => {
    return store.getters.hasLogged
})

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
    <div class="sticky top-0 z-[90]">
        <div :class="[
            'px-4 xl:px-0 relative backdrop-blur-md bg-white/[0.92] h-[56px] transition-all duration-200',
            hasScroll ? 'border-b border-gray-200' : 'border-b border-transparent'
        ]">
            <Container>
                <div class="flex h-full items-center justify-between">
                    <div class="flex items-center gap-5">
                        <Logo size="w-[94px] lg:w-[100px]" />
                        <ul class="hidden lg:flex items-center gap-1.5">
                            <li>
                                <a href="#"
                                    class="py-1 rounded-lg px-3 pb-1 flex items-center hover:bg-[rgba(0,0,0,0.08)] font-medium text-[15px]">
                                    <p> Para produtores </p>
                                </a>
                            </li>
                            <li>
                                <a href="#"
                                    class="py-1 rounded-lg px-3 pb-1 flex items-center hover:bg-[rgba(0,0,0,0.08)] font-medium text-[15px]">
                                    <p>Preços</p>
                                </a>
                            </li>
                            <li>
                                <a href="#"
                                    class="py-1 rounded-lg px-3 pb-1 flex items-center hover:bg-[rgba(0,0,0,0.08)] font-medium text-[15px]">
                                    <p> Encontrar eventos </p>
                                </a>
                            </li>
                            <li>
                                <a href="#"
                                    class="py-1 rounded-lg px-3 pb-1 flex items-center hover:bg-[rgba(0,0,0,0.08)] font-medium text-[15px]">
                                    <p> Ajuda </p>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div class="flex items-center">
                        <ul class="hidden lg:flex items-center gap-1.5">

                            <li v-if="!hasLogged">
                                <a href="/eventos/meus-eventos"
                                    class="py-1 rounded-lg px-3 pb-1 flex items-center hover:bg-[rgba(0,0,0,0.08)] font-medium text-[15px]">
                                    <p> Área do produtor </p>
                                </a>
                            </li>

                            <li v-if="!hasLogged" class="flex items-center gap-1.5">

                                <a class="py-1 rounded-lg px-3 pb-1 flex items-center hover:bg-[rgba(0,0,0,0.08)] font-medium text-[15px]"
                                    href="/conta/login">
                                    Entrar
                                </a>
                            </li>

                            <li v-if="hasLogged">
                                <UserTriggerDropdown />
                            </li>

                            <li>
                                <a class="py-1 rounded-lg bg-brand-primary text-white px-3 pb-1 flex items-center hover:bg-brand-primary-dark font-medium text-[15px] shadow-[0_0.3259259164px_0.7333333492px_0_#0000001f,0_1.5407407284px_2.8666665554px_0_#00000012,0_4px_9px_0_#0000000d]"
                                    href="/eventos/novo-evento?tipo=presencial">
                                    <p>Publicar evento</p>
                                </a>
                            </li>
                        </ul>
                        <div class="flex items-center">
                            <button @click="toggleSidebar"
                                class="bg-transparent text-primary relative w-[38px] flex justify-center items-center lg:hidden">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22px" height="22px" viewBox="0 0 24 24"
                                    fill="none">
                                    <g clip-path="url(#clip0_429_11066)">
                                        <path d="M3 6.00092H21M3 12.0009H21M3 18.0009H21" stroke="currentColor"
                                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_429_11066">
                                            <rect width="24" height="24" fill="white"
                                                transform="translate(0 0.000915527)" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </button>

                        </div>
                    </div>
                </div>
            </Container>
        </div>
    </div>

</template>

<style scoped></style>