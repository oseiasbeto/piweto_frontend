<script setup>
import { ref, computed } from "vue";

const isDroping = ref(false);
const imageInput = ref(null);

// Computed property
const onDropClass = computed(() => {
  return isDroping.value 
    ? "bg-[#0097ff] text-white border-white"
    : "bg-gray-50 text-gray-500 border-gray-400";
});

// Métodos
const toggleActive = () => {
  isDroping.value = !isDroping.value;
};

const triggerInput = () => {
  if (imageInput.value) {
    imageInput.value.click();
  }
};

// Emite eventos para o pai
const emit = defineEmits(['change', 'drop']);

const handleInputChange = (e) => {
  emit('change', e); // Emite o evento change quando o input muda
};

const handleDrop = (e) => {
  toggleActive();
  emit('drop', e); // Emite o evento drop quando algo é arrastado
};

// Exponha o método para o pai
defineExpose({
  triggerInput
});
</script>

<template>
  <label for="dropInput" class="w-full lg:w-auto">
    <div 
      @dragenter.prevent="toggleActive" 
      @dragleave.prevent="toggleActive" 
      @dragover.prevent
      @drop.prevent="handleDrop" 
      :class="onDropClass"
      class="w-full lg:w-[280px] h-[144px] select-none cursor-pointer flex justify-center flex-col border border-dashed items-center"
    >
      <div class="w-[24px] h-[24px] mb-2">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="100%" 
          height="100%" 
          viewBox="0 0 24 24" 
          fill="none"
          stroke="currentColor" 
          stroke-width="1.5" 
          stroke-linecap="round" 
          stroke-linejoin="round"
          class="feather feather-image"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
      <span class="text-sm font-medium">
        Clique ou arraste a imagem aqui
      </span>
      <input 
        type="file" 
        ref="imageInput" 
        id="dropInput" 
        accept="image/*" 
        @change="handleInputChange"
      >
    </div>
  </label>
</template>

<style scoped>
input {
  display: none;
}

.or {
  padding: 8px 0;
}

.active {
  background-color: red;
  color: #fff;
  border-color: #fff;
}

.active > .text {
  color: #fff;
}

.active > label {
  background-color: #fff;
  color: var(--success);
}
</style>