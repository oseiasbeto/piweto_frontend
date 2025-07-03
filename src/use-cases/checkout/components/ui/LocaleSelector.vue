<template>
    <Menu v-slot="{ open }">
        <MenuButton>
            <div class="py-2 cursor-pointer flex items-center px-3">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px"
                    height="24px" viewBox="0 0 36 36" aria-hidden="true" role="img" class="iconify iconify--twemoji"
                    preserveAspectRatio="xMidYMid meet">
                    <path fill="#060" d="M36 27a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V9a4 4 0 0 1 4-4h28a4 4 0 0 1 4 4v18z" />
                    <path fill="#D52B1E" d="M32 5H15v26h17a4 4 0 0 0 4-4V9a4 4 0 0 0-4-4z" />
                    <path fill="#FFCC4D"
                        d="M15 10a8 8 0 0 0-8 8a8 8 0 1 0 16 0a8 8 0 0 0-8-8zm-6.113 4.594l1.602 1.602l-2.46 1.23a6.95 6.95 0 0 1 .858-2.832zm-.858 3.979l4.4 2.207l-2.706 1.804l.014.021a6.963 6.963 0 0 1-1.708-4.032zM14 24.92a6.945 6.945 0 0 1-2.592-.92H14v.92zM14 23h-3.099L14 20.934V23zm0-3.268l-.607.405L9.118 18l2.116-1.058L14 19.707v.025zm0-1.439l-3.543-3.543l3.543.59v2.953zm0-3.992l-4.432-.713A6.983 6.983 0 0 1 14 11.08v3.221zm7.113.293a6.95 6.95 0 0 1 .858 2.833l-2.46-1.23l1.602-1.603zM16 11.08a6.987 6.987 0 0 1 4.432 2.508L16 14.301V11.08zm0 4.26l3.543-.591L16 18.293V15.34zm0 4.367l2.765-2.765L20.882 18l-4.274 2.137l-.608-.405v-.025zm0 5.213V24h2.592a6.945 6.945 0 0 1-2.592.92zM16 23v-2.066L19.099 23H16zm4.264-.395l.014-.021l-2.706-1.804l4.4-2.207a6.976 6.976 0 0 1-1.708 4.032z" />
                    <path fill="#D52B1E" d="M11 13v7a4 4 0 0 0 8 0v-7h-8z" />
                    <path fill="#FFF" d="M12 14v6a3 3 0 0 0 6 0v-6h-6z" />
                    <path fill="#829ACD" d="M13 17h4v2h-4z" />
                    <path fill="#829ACD" d="M14 16h2v4h-2z" />
                    <path fill="#039" d="M12 17h1v2h-1zm2 0h2v2h-2zm3 0h1v2h-1zm-3 3h2v2h-2zm0-6h2v2h-2z" />
                </svg>

                <span class="ml-1 lg:ml-2">
                    <svg class="w-2.5 h-2.5 opacity-80 transition-transform duration-200 ease-in-out"
                        xmlns="http://www.w3.org/2000/svg" :class="{ 'rotate-180': open }"
                        xmlns:xlink="http://www.w3.org/1999/xlink" fill="#fff" version="1.1" id="Capa_1"
                        viewBox="0 0 451.847 451.847" xml:space="preserve">
                        <g>
                            <path
                                d="M225.923,354.706c-8.098,0-16.195-3.092-22.369-9.263L9.27,151.157c-12.359-12.359-12.359-32.397,0-44.751   c12.354-12.354,32.388-12.354,44.748,0l171.905,171.915l171.906-171.909c12.359-12.354,32.391-12.354,44.744,0   c12.365,12.354,12.365,32.392,0,44.751L248.292,345.449C242.115,351.621,234.018,354.706,225.923,354.706z" />
                        </g>
                    </svg>
                </span>
            </div>

        </MenuButton>

        <transition enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0">
            <MenuItems
                class="absolute right-0 mt-2 w-auto overflow-hidden origin-top-right divide-y divide-gray-100 rounded-md bg-white ring-1 ring-black/5 focus:outline-none"
                style="box-shadow: 0 6px 12px rgba(0,0,0,.175)">
                <div class="relative border-none">
                    <MenuItem>
                    <button
                        class="group flex text-[rgb(25,31,40)] text-xs font-bold lg:text-sm items-center px-4 py-2.5 gap-2.5">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="20px"
                            height="20px" viewBox="0 0 36 36" aria-hidden="true" role="img"
                            class="iconify iconify--twemoji" preserveAspectRatio="xMidYMid meet">
                            <path fill="#060"
                                d="M36 27a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V9a4 4 0 0 1 4-4h28a4 4 0 0 1 4 4v18z" />
                            <path fill="#D52B1E" d="M32 5H15v26h17a4 4 0 0 0 4-4V9a4 4 0 0 0-4-4z" />
                            <path fill="#FFCC4D"
                                d="M15 10a8 8 0 0 0-8 8a8 8 0 1 0 16 0a8 8 0 0 0-8-8zm-6.113 4.594l1.602 1.602l-2.46 1.23a6.95 6.95 0 0 1 .858-2.832zm-.858 3.979l4.4 2.207l-2.706 1.804l.014.021a6.963 6.963 0 0 1-1.708-4.032zM14 24.92a6.945 6.945 0 0 1-2.592-.92H14v.92zM14 23h-3.099L14 20.934V23zm0-3.268l-.607.405L9.118 18l2.116-1.058L14 19.707v.025zm0-1.439l-3.543-3.543l3.543.59v2.953zm0-3.992l-4.432-.713A6.983 6.983 0 0 1 14 11.08v3.221zm7.113.293a6.95 6.95 0 0 1 .858 2.833l-2.46-1.23l1.602-1.603zM16 11.08a6.987 6.987 0 0 1 4.432 2.508L16 14.301V11.08zm0 4.26l3.543-.591L16 18.293V15.34zm0 4.367l2.765-2.765L20.882 18l-4.274 2.137l-.608-.405v-.025zm0 5.213V24h2.592a6.945 6.945 0 0 1-2.592.92zM16 23v-2.066L19.099 23H16zm4.264-.395l.014-.021l-2.706-1.804l4.4-2.207a6.976 6.976 0 0 1-1.708 4.032z" />
                            <path fill="#D52B1E" d="M11 13v7a4 4 0 0 0 8 0v-7h-8z" />
                            <path fill="#FFF" d="M12 14v6a3 3 0 0 0 6 0v-6h-6z" />
                            <path fill="#829ACD" d="M13 17h4v2h-4z" />
                            <path fill="#829ACD" d="M14 16h2v4h-2z" />
                            <path fill="#039" d="M12 17h1v2h-1zm2 0h2v2h-2zm3 0h1v2h-1zm-3 3h2v2h-2zm0-6h2v2h-2z" />
                        </svg>
                        <p>Português (PT)</p>
                    </button>

                    </MenuItem>
                </div>
            </MenuItems>
        </transition>
    </Menu>

</template>

<script setup>
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
</script>