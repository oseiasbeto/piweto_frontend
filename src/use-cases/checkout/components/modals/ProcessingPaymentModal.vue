<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" class="relative z-[9999] font-primary" :static="true">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-[rgba(25,31,40,0.6)]" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel
              class="w-full max-w-xs transform overflow-hidden bg-white text-left align-middle shadow-2xl transition-all">
              <DialogTitle as="h3" class="text-lg text-white bg-[#191f28] px-4 py-4 font-bold leading-6">
                {{ title }}
              </DialogTitle>

              <div class="mb-2 mt-3 py-4 px-8">
                <p class="text-sm text-gray-600">
                  {{ message }}
                </p>

                <!-- Timer para GPO -->
                <div v-if="paymentMethod === 'GPO'" class="mt-2 text-center">
                  <p class="text-xs text-gray-500">
                    Tempo restante: {{ formattedTime }}
                  </p>
                </div>

                <!-- Animação de loading -->
                <div class="mt-2 mb-5 flex justify-center">
                  <div class="w-8 mt-4 h-8">
                     <SpinnerSmall/>
                  </div>
                </div>

                <!-- Mensagem adicional para GPO -->
                <p v-if="paymentMethod === 'GPO'" class="text-xs text-center text-gray-500 mt-2">
                  Você será redirecionado após a confirmação<br>do pagamento no seu celular
                </p>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import SpinnerSmall from '../ui/SpinnerSmall.vue';
import { computed, ref, watch, onUnmounted } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  paymentMethod: {
    type: String,
    default: 'reference'
  }
});

const emit = defineEmits(['timeout']);

// Timer para GPO
const timeLeft = ref(90); // 90 segundos para GPO
const timerInterval = ref(null);

// Computed properties para título e mensagem baseados no método
const title = computed(() => {
  return props.paymentMethod === 'GPO' ? 'Aguardando Pagamento' : 'Aguarde';
});

const message = computed(() => {
  return props.paymentMethod === 'GPO' 
    ? 'Estamos aguardando a confirmação do pagamento no seu celular...' 
    : 'Estamos processando o seu pedido...';
});

const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

// Iniciar timer quando o modal abrir com GPO
watch(() => props.isOpen, (newValue) => {
  if (newValue && props.paymentMethod === 'GPO') {
    startTimer();
  } else {
    stopTimer();
  }
});

// Reiniciar timer quando mudar o método de pagamento
watch(() => props.paymentMethod, (newValue) => {
  if (props.isOpen && newValue === 'GPO') {
    resetTimer();
    startTimer();
  } else {
    stopTimer();
  }
});

function startTimer() {
  stopTimer(); // Limpa qualquer timer existente
  timeLeft.value = 90; // Reseta para 90 segundos
  
  timerInterval.value = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value -= 1;
    } else {
      // Tempo esgotado
      stopTimer();
      emit('timeout');
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
    timerInterval.value = null;
  }
}

function resetTimer() {
  timeLeft.value = 90;
}

// Limpar timer ao desmontar
onUnmounted(() => {
  stopTimer();
});
</script>