<script setup>
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const store = useStore()
const route = useRoute()

const props = defineProps({
    isView: {
        type: Boolean,
        default: true
    }
})

const hasLogged = computed(() => {
    return store.getters.hasLogged
})

function close() {
    store.dispatch('setSidebar', {
        show: false
    })
}

</script>

<template>
    <div class="block lg:hidden">
        <div class="bg-[#292b2c] h-full transition-all fixed top-0 z-[100] w-[275px]"
            :class="props.isView ? 'right-0' : 'right-[-275px]'">
            <!--start list items-->
            <ul v-if="!hasLogged" class="px-0">
                <li class="block relative">
                    <router-link class="flex items-center h-[44px] border-b border-white/10 text-sm hover:bg-white/5 hover:text-white py-[9px] px-4" :class="route.path == '/' ? 'bg-brand-primary text-white' : 'bg-transparent text-white/75'" @click="close"
                        to="/">Home</router-link>
                </li>
                <li class="block relative">
                    <router-link class="flex items-center h-[44px] border-b border-white/10 text-sm hover:bg-white/5 hover:text-white py-[9px] px-4" :class="route.path == '/conta/login' ? 'bg-brand-primary text-white' : 'bg-transparent text-white/75'" @click="close"
                        to="/conta/login">Acessar minha conta</router-link>
                </li>
                <li class="block relative">
                    <router-link class="flex items-center h-[44px] border-b border-white/10 text-sm hover:bg-white/5 hover:text-white py-[9px] px-4" :class="route.path == '/conta/registrar-se' ? 'bg-brand-primary text-white' : 'bg-transparent text-white/75'" @click="close"
                        to="/conta/registrar-se">Registrar-se</router-link>
                </li>
            </ul>
            <ul v-else class="px-0">
                <li class="block relative">
                    <router-link class="flex items-center h-[44px] border-b border-white/10 text-sm hover:bg-white/5 hover:text-white py-[9px] px-4" :class="route.path == '/' ? 'bg-brand-primary text-white' : 'bg-transparent text-white/75'" @click="close"
                        to="/">Home</router-link>
                </li>
                <li class="block relative">
                    <router-link class="flex items-center h-[44px] border-b border-white/10 text-sm hover:bg-white/5 hover:text-white py-[9px] px-4" :class="route.path == '/meus-ingressos' ? 'bg-brand-primary text-white' : 'bg-transparent text-white/75'" @click="close"
                        to="/meus-ingressos">Meus ingressos</router-link>
                </li>
                <li class="block relative">
                    <router-link class="flex items-center h-[44px] border-b border-white/10 text-sm hover:bg-white/5 hover:text-white py-[9px] px-4" :class="route.path == '/eventos/meus-eventos' ? 'bg-brand-primary text-white' : 'bg-transparent text-white/75'" @click="close"
                        to="/eventos/meus-eventos">Área do promotor</router-link>
                </li>
                <li class="block relative">
                    <router-link class="flex items-center h-[44px] border-b border-white/10 text-sm hover:bg-white/5 hover:text-white py-[9px] px-4" :class="route.path == '/eventos/novo-evento?tipo=presencial' ? 'bg-brand-primary text-white' : 'bg-transparent text-white/75'" @click="close"
                        to="/eventos/novo-evento?tipo=presencial">Crie um novo evento</router-link>
                </li>
                <li class="block relative">
                    <router-link class="flex items-center h-[44px] border-b border-white/10 text-sm hover:bg-white/5 hover:text-white py-[9px] px-4" :class="route.path == '/conta/registrar-se' ? 'bg-brand-primary text-white' : 'bg-transparent text-white/75'" @click="close"
                        to="/conta/registrar-se">Minha conta</router-link>
                </li>
            </ul>
            <!--end list items-->
        </div>
        <div @click="close"
            class="fixed top-0 z-[90] transition-opacity left-0 right-0 w-screen h-screen bg-black/[0.6]"
            :class="props.isView ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"></div>
    </div>
</template>