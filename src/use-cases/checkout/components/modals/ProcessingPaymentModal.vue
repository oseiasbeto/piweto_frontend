<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" class="relative z-[9999]" :static="true">
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
              class="w-full max-w-xs transform overflow-hidden bg-white py-6 px-8 text-left align-middle shadow-2xl transition-all">
              <DialogTitle as="h3" class="text-lg font-bold leading-6 text-[#191f28]">
                Aguarde
              </DialogTitle>

              <div class="mt-3">
                <p class="text-sm text-gray-600">
                  Estamos processando o seu pedido...
                </p>

                <!-- Animação de loading -->
                <div class="mt-3 mb-2 flex justify-center">
                  <div class="w-8 h-8 border-4 border-[#0097ff] border-t-transparent rounded-full animate-spin"></div>
                </div>
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

defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  }
})
</script>