<script setup>
// Importe os pacotes necessários para o bom funcionamento deste componente.
import { useStore } from "vuex"
import { computed } from "vue"

import {
    Dialog,
    DialogPanel,
    TransitionRoot,
    TransitionChild
} from '@headlessui/vue'
import MyAccount from "../forms/auth/MyAccount.vue";

// Importe as referências necessários para o bom funcionamento deste componente.
const store = useStore()

// Esta função computada tem como finalidade retornar os dados da caixa de diálogo aberta.
const modal = computed(() => {
    return store.getters.modal
})

// Esta função tem como finalidade fechar a caixa de diálogo aberta.
const close = (name) => {
    store.dispatch("setModal", {
        show: false,
        name,
        data: {
            type: ""
        }
    })
}
</script>

<template>
    <TransitionRoot appear :show="modal.show" as="div">
        <Dialog as="div" class="relative z-[9999]" @close="close(modal.name)">
            <TransitionChild as="div" enter="duration-300 ease-out" enter-from="opacity-100"
                leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-black bg-opacity-25"></div>
            </TransitionChild>

            <!--start body-->
            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex items-center lg:justify-center w-full min-h-full p-4 text-center">
                    <TransitionChild class="w-full lg:w-auto" as="div" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95">
                        <!--start body content-->
                        <DialogPanel
                            class="w-full overflow-hidden text-left align-middle transition-all transform">
                            <div class="w-full">
                                <MyAccount @onclose="close(modal.name)" v-if="modal.name == 'my-account'"/>
                            </div>
                        </DialogPanel>
                        <!--end body content-->
                    </TransitionChild>
                </div>
            </div>
            <!--end body-->
        </Dialog>
    </TransitionRoot>
</template>