<script setup>
// Importe os pacotes necessários para o bom funcionamento deste componente.
import { useStore } from "vuex"
import { computed } from "vue"
import BatchForm from "../forms/batches/BatchForm.vue"

import {
    Dialog,
    DialogPanel,
    TransitionRoot,
    TransitionChild
} from '@headlessui/vue'
import MyAccount from "@/use-cases/marketplace/components/forms/auth/MyAccount.vue"
import ForgotPassword from "@/use-cases/marketplace/components/forms/auth/ForgotPassword.vue"
// importe as referências necessários para o bom funcionamento deste componente.
const store = useStore()

// esta função computada tem como finalidade retornar os dados da caixa de diálogo aberta.
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
        <Dialog as="div" class="relative z-[111]" @close="close(modal.name)">
            <TransitionChild as="div" enter="duration-300 ease-out" enter-from="opacity-100"
                leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-black bg-opacity-25"></div>
            </TransitionChild>

            <!--start body-->
            <div class="fixed inset-0 overflow-y-auto">
                <div class="flex items-center justify-center min-h-full p-4 text-center">
                    <TransitionChild as="div" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
                        enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
                        leave-to="opacity-0 scale-95">
                        <!--start body content-->
                        <DialogPanel
                            class="w-full max-w-5xl overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-sm">
                            <div>
                               <BatchForm @onclose="close(modal.name)" v-if="modal.name == 'form-batch'" />
                               <MyAccount @onclose="close(modal.name)" v-if="modal.name == 'my-account'"/>
                               <ForgotPassword @onclose="close(modal.name)" v-if="modal.name == 'forgot-password'"/>
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