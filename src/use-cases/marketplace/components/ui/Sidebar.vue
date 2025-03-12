<script setup>
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { computed, ref } from 'vue';
import { toast } from "vue3-toastify"
import { useUsers } from '@/repositories/users-repository';
import Cookies from "js-cookie";

const { logout, loading: logoutLoading } = useUsers()


const store = useStore()
const route = useRoute()

const props = defineProps({
    isView: {
        type: Boolean,
        default: true
    }
})

const showSubMenu = ref(false)

const hasLogged = computed(() => {
    return store.getters.hasLogged
})
const user = computed(() => {
    return store.getters.currentUser
})

function close() {
    store.dispatch('setSidebar', {
        show: false
    })
    showSubMenu.value = false
}

const openModal = (name) => {
    store.dispatch("setModal", {
        name,
        show: true,
        data: {
        }
    })
    close()
}

async function handlelogout() {
    if (logoutLoading.value) return

    const session_id = Cookies.get("session_id")
    await logout(session_id).then(() => {
        if (route.meta.rootPage != 'marketplace') {
            store.dispatch("setToast", {
                show: true,
                message: "Deslogado com sucesso.",
                type: "success",
                timeout: 2500
            })
        } else {
            toast("Deslogado com sucesso.", {
                theme: "colored",
                position: "top-right",
                autoClose: 2517,
                type: "success"
            })
        }
        close()
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
                    <router-link
                        class="flex items-center h-[44px] border-b border-white/10 text-sm hover:bg-white/5 hover:text-white py-[9px] px-4"
                        :class="route.path == '/' ? 'bg-brand-primary text-white' : 'bg-transparent text-white/75'"
                        @click="close" to="/">Home</router-link>
                </li>
                <li class="block relative">
                    <router-link
                        class="flex items-center h-[44px] border-b border-white/10 text-sm hover:bg-white/5 hover:text-white py-[9px] px-4"
                        :class="route.path == '/conta/login' ? 'bg-brand-primary text-white' : 'bg-transparent text-white/75'"
                        @click="close" to="/conta/login">Acessar minha conta</router-link>
                </li>
                <li class="block relative">
                    <router-link
                        class="flex items-center h-[44px] border-b border-white/10 text-sm hover:bg-white/5 hover:text-white py-[9px] px-4"
                        :class="route.path == '/conta/registrar-se' ? 'bg-brand-primary text-white' : 'bg-transparent text-white/75'"
                        @click="close" to="/conta/registrar-se">Registrar-se</router-link>
                </li>
            </ul>
            <ul v-else class="px-0">
                <li class="block relative">
                    <router-link
                        class="flex items-center h-[44px] border-b border-white/10 text-sm hover:bg-white/5 hover:text-white py-[9px] px-4"
                        :class="route.path == '/' ? 'bg-brand-primary text-white' : 'bg-transparent text-white/75'"
                        @click="close" to="/">Home</router-link>
                </li>
                <li class="block relative">
                    <router-link
                        class="flex items-center h-[44px] border-b border-white/10 text-sm hover:bg-white/5 hover:text-white py-[9px] px-4"
                        :class="route.path == '/meus-ingressos' ? 'bg-brand-primary text-white' : 'bg-transparent text-white/75'"
                        @click="close" to="/meus-ingressos">Meus ingressos</router-link>
                </li>
                <li class="block relative">
                    <router-link
                        class="flex items-center h-[44px] border-b border-white/10 text-sm hover:bg-white/5 hover:text-white py-[9px] px-4"
                        :class="route.path == '/eventos/meus-eventos' ? 'bg-brand-primary text-white' : 'bg-transparent text-white/75'"
                        @click="close" to="/eventos/meus-eventos">Área do promotor</router-link>
                </li>
                <li class="block relative">
                    <router-link
                        class="flex items-center h-[44px] border-b border-white/10 text-sm hover:bg-white/5 hover:text-white py-[9px] px-4"
                        :class="route.path == '/eventos/novo-evento?tipo=presencial' ? 'bg-brand-primary text-white' : 'bg-transparent text-white/75'"
                        @click="close" to="/eventos/novo-evento?tipo=presencial">Crie um novo evento</router-link>
                </li>
                <li class="block relative">
                    <p class="flex items-center h-[44px] border-b border-white/10 text-sm hover:bg-white/5 hover:text-white gap-1 py-[9px] px-4"
                        :class="route.path == '/conta/registrar-se' ? 'bg-brand-primary text-white' : 'bg-transparent text-white/75'"
                        @click="showSubMenu = !showSubMenu">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 16 16"
                            fill="none">
                            <path
                                d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z"
                                fill="currentColor" />
                            <path d="M14 12C14 10.3431 12.6569 9 11 9H5C3.34315 9 2 10.3431 2 12V15H14V12Z"
                                fill="currentColor" />
                        </svg>

                        {{ user.full_name }}

                        <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="12px" height="12px"
                            viewBox="0 0 1024 1024">
                            <path fill="currentColor"
                                d="M759.2 419.8L697.4 358 512 543.4 326.6 358l-61.8 61.8L512 667z" />
                        </svg>
                    </p>

                    <ul class="bg-white/5" v-if="showSubMenu">
                        <li @click="openModal('my-account')"
                            class="border-white/10 flex items-center text-white/75 text-sm hover:bg-white/5 hover:text-white gap-1 px-4 py-[9px]">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="18px" height="18px"
                                viewBox="0 0 1024 1024">
                                <path d="M419.3 264.8l-61.8 61.8L542.9 512 357.5 697.4l61.8 61.8L666.5 512z" />
                            </svg>
                            Minha conta
                        </li>
                        <li @click="handlelogout()"
                            class="border-white/10 flex items-center text-white/75 text-sm hover:bg-white/5 hover:text-white gap-1 px-4 py-[9px]">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="18px" height="18px"
                                viewBox="0 0 1024 1024">
                                <path d="M419.3 264.8l-61.8 61.8L542.9 512 357.5 697.4l61.8 61.8L666.5 512z" />
                            </svg>
                            Sair
                        </li>
                    </ul>
                </li>
            </ul>
            <!--end list items-->
        </div>
        <div @click="close"
            class="fixed top-0 z-[90] transition-opacity left-0 right-0 w-screen h-screen bg-black/[0.6]"
            :class="props.isView ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"></div>
    </div>
</template>