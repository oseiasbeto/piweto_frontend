<template>
    <Menu v-slot="{ open }" as="div" class="relative lg:hidden">
        <!-- Botão do menu hambúrguer -->
        <MenuButton class="flex w-[32px] outline-none ml-3 h-[32px] justify-center lg:hidden items-center">
            <svg v-if="!open" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M22.502 12.487L9.49801 12.5C9.10131 12.4883 8.72327 12.3289 8.43801 12.053C8.29855 11.9128 8.18808 11.7465 8.11293 11.5636C8.03777 11.3807 7.9994 11.1847 8.00001 10.987C8.00343 10.5918 8.16271 10.2139 8.44321 9.93544C8.72371 9.65699 9.10277 9.50051 9.49801 9.5L22.502 9.513C22.8972 9.51351 23.2763 9.66999 23.5568 9.94844C23.8373 10.2269 23.9966 10.6048 24 11C23.9966 11.3952 23.8373 11.7731 23.5568 12.0516C23.2763 12.33 22.8972 12.4865 22.502 12.487ZM9.49801 14.5L22.502 14.513C22.8972 14.5135 23.2763 14.67 23.5568 14.9484C23.8373 15.2269 23.9966 15.6048 24 16C23.9966 16.3952 23.8373 16.7731 23.5568 17.0516C23.2763 17.33 22.8972 17.4865 22.502 17.487L9.49801 17.5C9.10127 17.4885 8.72317 17.3291 8.43801 17.053C8.2985 16.9128 8.18801 16.7465 8.11285 16.5636C8.03769 16.3807 7.99935 16.1848 8.00001 15.987C8.00343 15.5918 8.16271 15.2139 8.44321 14.9354C8.72371 14.657 9.10277 14.5005 9.49801 14.5ZM9.49801 19.5L22.502 19.513C22.8972 19.5135 23.2763 19.67 23.5568 19.9484C23.8373 20.2269 23.9966 20.6048 24 21C23.9966 21.3952 23.8373 21.7731 23.5568 22.0516C23.2763 22.33 22.8972 22.4865 22.502 22.487L9.49801 22.5C9.10131 22.4883 8.72327 22.3289 8.43801 22.053C8.15645 21.7698 7.9989 21.3864 8.00001 20.987C8.00343 20.5918 8.16271 20.2139 8.44321 19.9354C8.72371 19.657 9.10277 19.5005 9.49801 19.5Z"
                    fill="white" />
            </svg>
            <svg v-else viewBox="0 0 24 24" width="24px" height="24px">
                <path fill="#fff" fill-rule="evenodd" clip-rule="evenodd"
                    d="M6.70711 18.7071L18.7071 6.70711C19.0976 6.31658 19.0976 5.68342 18.7071 5.29289C18.3166 4.90237 17.6834 4.90237 17.2929 5.29289L12 10.5858L6.70711 5.29289C6.31658 4.90237 5.68342 4.90237 5.29289 5.29289C4.90237 5.68342 4.90237 6.31658 5.29289 6.70711L10.5858 12L5.29289 17.2929C4.90237 17.6834 4.90237 18.3166 5.29289 18.7071C5.68342 19.0976 6.31658 19.0976 6.70711 18.7071ZM17.2929 18.7071L13.8201 15.2343C13.4296 14.8438 13.4296 14.2106 13.8201 13.8201C14.2106 13.4296 14.8438 13.4296 15.2343 13.8201L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071Z">
                </path>
            </svg>
        </MenuButton>

        <!-- Menu dropdown -->
        <transition enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0">
            <MenuItems class="absolute left-0 right-0 top-[40px] w-screen origin-top focus:outline-none"
                style="font-size: 14px; background: rgba(0, 0, 0, 0.8);">
                <div class="px-1 py-1">
                    <!-- Itens do menu -->
                    <template v-if="isLoggedIn">
                        <MenuItem v-slot="{ active }">
                        <a href="/meus-ingressos" class="menu-item" :class="{ 'bg-gray-700': active }">
                            Meus ingressos
                        </a>
                        </MenuItem>
                        <MenuItem v-slot="{ active }">
                        <a href="/minha-conta" class="menu-item" :class="{ 'bg-gray-700': active }">
                            Minha conta
                        </a>
                        </MenuItem>
                        <MenuItem v-slot="{ active }">
                        <a href="https://api.whatsapp.com/send/?phone=948360831&text&type=phone_number&app_absent=0"
                            target="_blank" class="menu-item" :class="{ 'bg-gray-700': active }">
                            Fale Conosco
                        </a>
                        </MenuItem>
                        <MenuItem v-slot="{ active }">
                        <a href="https://api.whatsapp.com/send/?phone=948360831&text&type=phone_number&app_absent=0"
                            target="_blank" class="menu-item" :class="{ 'bg-gray-700': active }">
                            Sair
                        </a>
                        </MenuItem>
                    </template>
                    <template v-else>
                        <MenuItem v-slot="{ active }">
                        <a href="https://api.whatsapp.com/send/?phone=948360831&text&type=phone_number&app_absent=0"
                            target="_blank" class="menu-item" :class="{ 'bg-gray-700': active }">
                            Fale Conosco
                        </a>
                        </MenuItem>
                        <MenuItem v-slot="{ active }">
                        <a href="/conta/login" class="menu-item" :class="{ 'bg-gray-700': active }">
                            Login
                        </a>
                        </MenuItem>
                    </template>
                </div>
            </MenuItems>
        </transition>
    </Menu>
</template>

<script setup>
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { computed } from 'vue';
import { useStore } from "vuex";

const store = useStore()

// Defina isso como uma prop ou usando estado global (ex: Pinia)
const isLoggedIn = computed(() => {
    return store.getters.hasLogged
}) // Altere para true/false conforme necessário
</script>

<style scoped>
.menu-item {
    color: #ffffff;
    padding: 0 10px;
    cursor: pointer;
    font-size: 14px;
    min-height: 42px;
    font-weight: normal;
    --paper-item-focused-before_-_background: transparent;
    display: flex;
    align-items: center;
    width: 100%;
    text-decoration: none;
}
</style>