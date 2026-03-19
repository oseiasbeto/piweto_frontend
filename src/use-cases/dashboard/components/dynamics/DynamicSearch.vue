<!-- components/DynamicSearch.vue -->
<template>
  <div class="flex h-[40px] overflow-x-auto items-center w-full overflow-hidden border border-[#dfe0df] rounded-[3px] bg-white">
    <!-- Ícone de busca à esquerda -->
    <button @click="handleSearch" class="flex cursor-pointer text-brand-gray-500 items-center justify-center shrink-0 w-[36px] transition-colors hover:text-[#0097ff] py-2.5">
      <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 24 24" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.5 17c1.71 0 3.287-.573 4.55-1.537l4.743 4.744a1 1 0 0 0 1.414-1.414l-4.744-4.744A7.5 7.5 0 1 0 9.5 17zM15 9.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" fill="currentColor"/></svg>
    </button>

    <!-- Input de busca -->
    <input v-model="searchQuery" type="text" :placeholder="placeholder || 'Buscar...'"
      class="flex-1 text-[13px] h-full font-semibold text-inherit placeholder:text-brand-muted bg-transparent outline-none" @input="handleInput" @keydown.enter="handleSearch" />

    <!-- Ícone à direita: limpar ou spinner -->
    <div v-show="searchQuery.length" class="shrink-0 w-[36px] h-full">
      <div class="w-full flex items-center justify-center h-full cursor-pointer text-gray-600  transition-colors hover:text-[#0097ff]" v-if="searchQuery">
        <svg @click="clearSearch" class="w-5 h-5 "
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"
          stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Props
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: "",
  },
});

// Emits
const emit = defineEmits(['update:search', 'search']);

// Estado reativo
const searchQuery = ref('');

// Função para lidar com input
const handleInput = () => {
  emit('update:search', searchQuery.value);
};


// Função para busca ao pressionar Enter
const handleSearch = () => {
  if(!searchQuery.value) return;
  emit('search', searchQuery.value);
};


// Função para limpar o input
const clearSearch = () => {
  searchQuery.value = '';
  emit('update:search', '');
};

defineExpose({
  clearSearch
});
</script>