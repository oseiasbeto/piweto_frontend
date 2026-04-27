<script setup>
import { ref, computed } from "vue";

const isDroping = ref(false);
const imageInput = ref(null);

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

// Computed property
const onDropClass = computed(() => {
  return isDroping.value
    ? "bg-[#0097ff] !text-white !border-white"
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

const clearInput = () => {
  if (imageInput.value) {
    imageInput.value.value = null; // Limpa o valor do input
  }
}

// Emite eventos para o pai
const emit = defineEmits(['change', 'drop']);

const handleInputChange = (e) => {
  if (props.loading) return
  emit('change', e); // Emite o evento change quando o input muda
};

const handleDrop = (e) => {
  if (props.loading) return
  toggleActive();
  emit('drop', e); // Emite o evento drop quando algo é arrastado
};

// Exponha o método para o pai
defineExpose({
  triggerInput,
  clearInput
});
</script>

<template>
  <label for="dropInput" class="w-full lg:w-auto" :class="{'pointer-events-none': loading}">
    <div @dragenter.prevent="toggleActive" @dragleave.prevent="toggleActive" @dragover.prevent
      @drop.prevent="handleDrop" :class="onDropClass"
      class="w-full lg:w-[280px] h-[144px] select-none cursor-pointer flex justify-center flex-col border-2 border-dashed items-center border-[#bdcadb]">
      
      <div class="relative w-[24px] h-[24px] text-[#a8a9af] mb-2">
        <!-- Ícone de imagem (sempre visível e centralizado) -->
        <div class="icon-center" :class="{'opacity-50': loading, 'text-white': isDroping}">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
            class="feather feather-image">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
        
        <!-- Spinner girando em volta (aparece apenas quando loading) -->
        <div v-if="loading" class="spinner-overlay">
          <div class="spinner-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="#0097ff" stroke-width="0.75" stroke-linecap="round" stroke-linejoin="round" class="spinner">
              <circle cx="12" cy="12" r="10" stroke-dasharray="50" stroke-dashoffset="25" opacity="0.15"/>
              <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
            </svg>
          </div>
        </div>
      </div>
      
      <span class="text-xs font-medium mt-2" :class="isDroping ? 'text-white' : 'text-[#50525f]'">
        {{ isDroping ? 'Solte a imagem para fazer upload' : loading ? 'Carregando imagem...' : 'Clique ou arraste a imagem aqui' }}
      </span>
      <input type="file" ref="imageInput" id="dropInput" accept="image/*" @change="handleInputChange">
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

.active>.text {
  color: #fff;
}

.active>label {
  background-color: #fff;
  color: var(--success);
}

/* Ícone centralizado */
.icon-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  z-index: 1;
}

/* Container do spinner overlay - um pouco menor */
.spinner-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 64px;
  height: 64px;
  margin-left: -32px;
  margin-top: -32px;
  pointer-events: none;
  z-index: 0;
}

/* Wrapper para o spinner */
.spinner-wrapper {
  width: 100%;
  height: 100%;
  padding: 8px;
}

/* Spinner girando */
.spinner {
  animation: spin 1.2s linear infinite;
  color: currentColor;
  width: 100%;
  height: 100%;
  display: block;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>