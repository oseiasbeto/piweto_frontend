<script setup>
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import { computed, ref } from "vue";
import { toast } from "vue3-toastify"
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { useUsers } from "@/repositories/users-repository.js";
import Cookies from "js-cookie";

const { logout, loading: logoutLoading } = useUsers()

const store = useStore()
const router = useRouter()
const route = useRoute()

const props = defineProps({
    showName: {
        type: Boolean,
        default: false
    },
    showMenu: {
        type: Boolean,
        default: true
    },
    showBorder: {
        type: Boolean,
        default: true
    }
})

const hasLogged = computed(() => {
    return store.getters.hasLogged
})
const openModal = (name) => {
    store.dispatch("setModal", {
        name,
        show: true,
        data: {
        }
    })
}

const user = computed(() => {
    return store.getters.currentUser
})

async function handlelogout() {
    const session_id = Cookies.get("session_id")
    await logout(session_id).then(() => {
        if (route.meta.rootPage !== 'marketplace') {
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
        
        if (route.meta.rootPage !== 'marketplace' || route.name !== 'Details event') {
            console.log("aki")
            router.push('/')
        }
    }).catch(err => {
        console.log(err)
        toast("Houve um erro.", {
            theme: "colored",
            position: "top-right",
            autoClose: 2517,
            type: "erro"
        })
    })
}
</script>


<template>
    <Menu v-if="hasLogged" as="div" class="relative border-none z-[1000] inline-block text-left">
        <div>
            <MenuButton
                class="py-1 rounded-lg px-3 pb-1 flex items-center hover:bg-[rgba(0,0,0,0.08)] font-medium text-[15px]">
                <p>{{ user.full_name }}</p>
                <svg class="ml-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m6 9 6 6 6-6"></path>
                </svg>
            </MenuButton>
        </div>

        <transition v-if="showMenu" enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0">
            <MenuItems
                class="absolute border border-gray-300 right-0 mt-2 w-[180px] overflow-hidden origin-top-right divide-y divide-gray-100 rounded-xl bg-white ring-1 ring-black/5 focus:outline-none"
                style="box-shadow: 0 6px 12px rgba(0,0,0,.175)">
                <router-link to="/meus-ingressos" class="relative border-none">
                    <MenuItem v-slot="{ active }">
                    <button :class="[
                        active ? 'bg-[rgba(0,0,0,0.08)]' : 'text-inherit',
                        'group flex w-full items-center px-4 py-2.5 gap-2.5 text-sm',
                    ]">
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-ticket-icon"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path><path d="M13 5v2"></path><path d="M13 17v2"></path><path d="M13 11v2"></path></svg>

                        <p>Meus tickets</p>

                    </button>
                    </MenuItem>
                </router-link>
                <div class="relative border-none">
                    <MenuItem v-slot="{ active }">
                    <button @click="openModal('my-account')" :class="[
                        active ? 'bg-[rgba(0,0,0,0.08)]' : 'text-inherit',
                        'group flex w-full items-center px-4 py-2.5 gap-2.5 text-sm',
                    ]">
                        <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"
                                d="M12 12C12.7911 12 13.5645 11.7654 14.2223 11.3259C14.8801 10.8864 15.3928 10.2616 15.6955 9.53074C15.9983 8.79983 16.0775 7.99556 15.9231 7.21964C15.7688 6.44372 15.3878 5.73098 14.8284 5.17157C14.269 4.61216 13.5563 4.2312 12.7804 4.07686C12.0044 3.92252 11.2002 4.00173 10.4693 4.30448C9.73836 4.60723 9.11365 5.11992 8.67412 5.77772C8.2346 6.43552 8 7.20888 8 8C8 9.06087 8.42143 10.0783 9.17157 10.8284C9.92172 11.5786 10.9391 12 12 12ZM12 10C12.3956 10 12.7822 9.8827 13.1111 9.66294C13.44 9.44318 13.6964 9.13082 13.8478 8.76537C13.9991 8.39992 14.0387 7.99778 13.9616 7.60982C13.8844 7.22186 13.6939 6.86549 13.4142 6.58579C13.1345 6.30608 12.7781 6.1156 12.3902 6.03843C12.0022 5.96126 11.6001 6.00087 11.2346 6.15224C10.8692 6.30362 10.5568 6.55996 10.3371 6.88886C10.1173 7.21776 10 7.60444 10 8C10 8.53044 10.2107 9.03914 10.5858 9.41422C10.9609 9.78929 11.4696 10 12 10ZM9 15C7.93913 15 6.92172 15.4214 6.17157 16.1716C5.42143 16.9217 5 17.9391 5 19V20C5 20.2652 4.89464 20.5196 4.70711 20.7071C4.51957 20.8946 4.26522 21 4 21C3.73478 21 3.48043 20.8946 3.29289 20.7071C3.10536 20.5196 3 20.2652 3 20V19C3 17.4087 3.63214 15.8826 4.75736 14.7574C5.88258 13.6321 7.4087 13 9 13H15C16.5913 13 18.1174 13.6321 19.2426 14.7574C20.3679 15.8826 21 17.4087 21 19V20C21 20.2652 20.8946 20.5196 20.7071 20.7071C20.5196 20.8946 20.2652 21 20 21C19.7348 21 19.4804 20.8946 19.2929 20.7071C19.1054 20.5196 19 20.2652 19 20V19C19 17.9391 18.5786 16.9217 17.8284 16.1716C17.0783 15.4214 16.0609 15 15 15H9Z">
                            </path>
                        </svg>
                        <p>Minha conta</p>
                    </button>

                    </MenuItem>
                </div>
                <div class="relative border-none">
                    <MenuItem v-slot="{ active }">
                    <a href="/eventos/meus-eventos" target="_blank" :class="[
                        active ? 'bg-[rgba(0,0,0,0.08)]' : 'text-inherit',
                        'group flex w-full items-center px-4 py-2.5 gap-2.5 text-sm',
                    ]">
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-days-icon"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path><path d="M8 14h.01"></path><path d="M12 14h.01"></path><path d="M16 14h.01"></path><path d="M8 18h.01"></path><path d="M12 18h.01"></path><path d="M16 18h.01"></path></svg>
                        <p>Meus eventos</p>
                    </a>

                    </MenuItem>
                </div>
                <hr class="my-0.5">
                <div class="relative border-none mb-2">
                    <MenuItem v-slot="{ active }">
                    <button :disabled="logoutLoading" @click="handlelogout()" :class="[
                        active ? 'bg-red-50' : 'text-inherit',
                        'group flex w-full  items-center text-red-500 px-4 py-2.5 gap-2.5 text-sm',
                    ]">
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-log-out-icon"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" x2="9" y1="12" y2="12"></line></svg>
                        Sair
                    </button>

                    </MenuItem>
                </div>
            </MenuItems>
        </transition>
    </Menu>
</template>

<style scoped>
.shx {
    box-shadow: 0 1px 20px 0 rgba(0, 0, 0, .04);
}
</style>