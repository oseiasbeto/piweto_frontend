<script setup>
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { computed, ref } from "vue";
import Logo from "@/components/Logo.vue";
import Container from "./Container.vue";
import UserMenu from "@/components/UserMenu";

const loading = ref(false)
const openSearch = ref(false)
const searchInputRef = ref(null);
const searchInputKeywords = ref("");

const store = useStore()
const router = useRouter()
const route = useRoute()

const sidebar = computed(() => {
    return store.getters.sidebar
})

const toggleOpenSearch = () => {
    if (openSearch.value) {
        openSearch.value = false
        searchInputKeywords.value = ''
    } else {
        openSearch.value = true
        searchInputRef.value?.focus();
    }
}

const goToSearch = () => {
    if (!searchInputKeywords.value) return
    else {
        openSearch.value = false
        router.push({ path: '/eventos/pesquisar', query: { ...route.query, s: searchInputKeywords.value || undefined } })
        searchInputKeywords.value = ""
    }
}

const toggleSidebar = () => {
    store.dispatch('setSidebar', {
        show: !sidebar.value.show
    })
}

const hasLogged = computed(() => {
    return store.getters.hasLogged
})
</script>

<template>
    <div class="sticky top-0 z-[90]">
        <div class="px-4 xl:px-0 relative bg-white h-[64px] py-3">
            <Container>
                <div class="flex justify-between">
                    <div>
                        <Logo size="w-[112px]" />
                    </div>
                    <div class="flex items-center">
                        <ul class="hidden lg:flex items-center gap-2">
                            <li v-if="hasLogged">
                                <router-link
                                    class="py-2.5 px-3 flex items-center border border-white text-gray-500 hover:text-brand-primary  font-semibold text-sm"
                                    to="/eventos/novo-evento?tipo=presencial">
                                    <p>Crie um evento</p>
                                </router-link>
                            </li>
                            <li v-if="!hasLogged">
                                <router-link to="/conta/login"
                                    class="py-2.5 px-3 flex items-center border border-white text-gray-500 hover:text-brand-primary  font-semibold text-sm">
                                    <p>Acessar minha conta</p>
                                </router-link>
                            </li>
                            <li v-if="hasLogged">
                                <router-link
                                    class="py-2.5 px-3 flex items-center border border-white text-gray-500 hover:text-brand-primary  font-semibold text-sm"
                                    to="/eventos/meus-eventos">
                                    <p style="line-height: 1;" class="text-sm">Área do promotor</p>
                                </router-link>
                            </li>
                            <li class="flex items-center gap-1.5">
                                <UserMenu />
                                <router-link
                                    class="py-2.5 px-3 flex items-center border border-white text-gray-500 hover:text-brand-primary  font-semibold text-sm"
                                    to="/conta/registrar-se" v-if="!hasLogged">
                                    Registrar-se
                                </router-link>
                            </li>
                        </ul>
                        <div class="flex items-center">
                            <div class="relative hidden lg:flex lg:justify-center w-[20px] h-[40px]">
                                <div class="absolute top-0 w-[1px] h-full bg-[#dee2e6]"></div>
                            </div>
                            <button @click="toggleSidebar"
                                class="bg-transparent opacity-80 relative w-[38px] h-[38px] flex justify-center items-center lg:hidden">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24"
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
                            <button @click="toggleOpenSearch"
                                class="bg-transparent relative w-[38px] h-[38px] flex justify-center items-center">
                                <svg class="absolute left-[30%]" xmlns="http://www.w3.org/2000/svg" fill="#32ba78"
                                    width="28px" height="28px" viewBox="0 0 32 32" version="1.1">
                                    <title>search</title>
                                    <path
                                        d="M16.906 20.188l5.5 5.5-2.25 2.281-5.75-5.781c-1.406 0.781-3.031 1.219-4.719 1.219-5.344 0-9.688-4.344-9.688-9.688s4.344-9.688 9.688-9.688 9.719 4.344 9.719 9.688c0 2.5-0.969 4.781-2.5 6.469zM3.219 13.719c0 3.594 2.875 6.469 6.469 6.469s6.469-2.875 6.469-6.469-2.875-6.469-6.469-6.469-6.469 2.875-6.469 6.469z" />
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