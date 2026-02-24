<script setup>
const props = defineProps({
    placeholder: {
        type: String,
        default: 'Pesquisar eventos, shows, espetáculos, cursos...'
    }
})

const searchKeywords = defineModel()
const emits = defineEmits(['onsearch'])

const goToSearch = (keywords) => {
    if(!keywords) return
    else {
        emits('onsearch', keywords)
    }
}

</script>

<template>
    <div class="relative flex items-center w-full mt-1 md:m-auto md:w-auto order-4 md:order-2">
        <input
            class="h-11 w-full placeholder:text-gray-600 text-[15px] focus:border-[#0097ff] outline-none border border-gray-400/60 px-4"
            v-model="searchKeywords"
            @keyup.enter="goToSearch(searchKeywords)"
            type="searc" :placeholder="props.placeholder">
        <button @click="goToSearch(searchKeywords)" class="bg-[#0097ff] hover:opacity-[0.8] flex gap-1 items-center text-sm px-4 h-11 outline-none text-white font-bold uppercase">
            <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" width="22px"
                height="22px" viewBox="0 0 32 32" version="1.1">
                <title>search</title>
                <path
                    d="M16.906 20.188l5.5 5.5-2.25 2.281-5.75-5.781c-1.406 0.781-3.031 1.219-4.719 1.219-5.344 0-9.688-4.344-9.688-9.688s4.344-9.688 9.688-9.688 9.719 4.344 9.719 9.688c0 2.5-0.969 4.781-2.5 6.469zM3.219 13.719c0 3.594 2.875 6.469 6.469 6.469s6.469-2.875 6.469-6.469-2.875-6.469-6.469-6.469-6.469 2.875-6.469 6.469z">
                </path>
            </svg>
            <span class="hidden lg:block">Procurar</span>
        </button>
    </div>
</template>