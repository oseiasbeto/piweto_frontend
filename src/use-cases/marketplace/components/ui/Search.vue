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
    if (!keywords) return
    else {
        emits('onsearch', keywords)
    }
}

</script>

<template>
    <div class="relative px-1 flex items-center w-full mt-1 group">

        <button class="text-black/[.46]
           pointer-events-none 
           absolute top-0 bottom-0 pb-[3px] left-[18px] lg:left-[22px]
           group-focus-within:text-brand-primary
           transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" class="
           transition-all duration-200
           [stroke-width:2]
           group-focus-within:[stroke-width:2.5]
         ">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
            </svg>
        </button>

        <input class="h-12 w-full pl-10 lg:pl-11 
           placeholder:text-gray-500/90
           shadow-[0_0_0_0.75px_rgb(0,0,0,0.0),0_20px_24px_-16px_rgb(0,0,0,0.16)]
           text-[15px] 
           rounded-3xl 
           px-4
           pb-0.5
           lg:pb-1
           truncate
           border border-black/[.16]
           focus:border-brand-primary
           focus:border-2
           outline-none
           transition-all duration-100" v-model="searchKeywords" @keyup.enter="goToSearch(searchKeywords)" type=""
            :placeholder="props.placeholder">
    </div>
</template>