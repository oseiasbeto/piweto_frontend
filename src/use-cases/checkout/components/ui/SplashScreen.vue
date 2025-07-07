<template>
  <transition
    enter-active-class="transition-opacity duration-200"
    leave-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isVisible"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-white"
      @wheel.prevent
      @touchmove.prevent
    >
      <div class="h-8 w-8 animate-spin rounded-full border-[#0097ff] border-b-2"></div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const isVisible = ref(props.visible)

// Bloqueia/desbloqueia o scroll da página
const toggleScrollLock = (lock) => {
  if (lock) {
    document.body.style.overflow = 'hidden'
    document.body.style.touchAction = 'none'
  } else {
    document.body.style.overflow = ''
    document.body.style.touchAction = ''
  }
}

// Atualiza quando a prop visible muda
watch(() => props.visible, (newVal) => {
  isVisible.value = newVal
  toggleScrollLock(newVal)
})

// Limpa ao desmontar o componente
onBeforeUnmount(() => {
  toggleScrollLock(false)
})

// Inicializa com o estado correto
onMounted(() => {
  toggleScrollLock(isVisible.value)
})
</script>