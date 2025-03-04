<script setup>
const props = defineProps({
    url: String,
    size: {
        type: String,
        default: "w-10 h-10"
    },
    name: String,
    showBorder: {
        type: Boolean,
        default: true
    }
})

function getFirstAndLastInitials(name) {
    if (!name) return "";

    // Divide o nome em palavras, removendo espaços extras
    const words = name.trim().split(/\s+/);

    // Pega a primeira letra do primeiro nome
    const initials = words[0][0].toUpperCase();

    return initials;
}
</script>

<template>
    <div class="bg-[#848c9b] border-[2.8px] flex justify-center items-center shadow-sm rounded-full"
        :class="`${size } ${!showBorder ? 'border-transparent shadow-none' : 'ssc border-white'}` ">
        <img class="w-full h-full object-cover" v-if="url" v-lazy="url" :alt="name || 'Avatar'">
        <p class="text-white font-semibold uppercase" v-else> {{ getFirstAndLastInitials(name) }} </p>
    </div>
</template>

<style scoped>
.ssc {
    box-shadow: rgba(25, 31, 40, 0.15) 0px 1px 2px 0px;
}
</style>