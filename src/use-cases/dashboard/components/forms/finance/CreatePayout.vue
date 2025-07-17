<script setup>
import { useEvents } from '@/repositories/events-repository';
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import VueCleave from 'vue-cleave-component';
import { toast } from "vue3-toastify"
import Swal from "sweetalert2"
import formatAmount from '@/utils/formatAmount';
import { usePayouts } from '@/repositories/payouts-repository';

const { newPayout, loading } = usePayouts()
loading.value = false

const store = useStore()

// Define os eventos de emissão deste componente.
const emit = defineEmits(["onclose"])

const form = ref({
    amount: 0
});

const event = computed(() => {
    return store.getters.event
})

const cleaveConfigPrice = ref({
    numeral: true,
    numeralThousandsGroupStyle: "thousand",
    numeralDecimalMark: ",",
    delimiter: "."
})

const errors = ref({
    amount: {
        show: false,
        message: '',
    }
});


const submitForm = async () => {
    validateAmount()
    if (errors.value.amount.show || form.value.amount == 0 || form.value.amount > event.value.balance) return;

    await newPayout({
        event_id: event.value._id,
        amount: form.value.amount
    }).then((payout) => {
        Swal.fire({
            icon: "success",
            title: "Levantamento Solicitado!",
            text: "Seu pedido de levantamento foi enviado com sucesso. O valor estará disponível em sua conta bancária em até 72 horas.",
            confirmButtonText: "Entendi",
            confirmButtonColor: "#6366F1", // Cor roxa para combinar com o design
        }).then(() => {
            store.dispatch("addPayoutFromPayouts", payout)
        })
    })
        .catch((err) => {
            if (err.response.data.message == 'Já existe um saque pendente para este evento.') {
                Swal.fire({
                    icon: "error",
                    title: "Levantamento Pendente",
                    text: "Você já tem um pedido de levantamento em andamento. Aguarde até que seja processado antes de solicitar um novo.",
                    confirmButtonText: "Entendi"
                });
            } else {
                toast('Erro interno, tente novamente mais tarde!', {
                    theme: "colored",
                    position: "top-right",
                    autoClose: 2500,
                    type: 'error'
                })
            }
        })
        .finally(() => {
            closeModal()
        })
};
const validateAmount = (e) => {
    if (form.value.amount == 0) {
        errors.value.amount = {
            show: true,
            message: "Por favor, insira um valor válido para continuar."
        }
    } else if (form.value.amount < 5) {
        errors.value.amount = {
            show: true,
            message: "O valor mínimo para saque é de 5 Kz."
        }
    } else if (form.value.amount > event.value.balance) {
        errors.value.amount = {
            show: true,
            message: "O valor inserido excede o saldo disponível."
        }
    } else {
        errors.value.amount = {
            show: false,
            message: ""
        }
    }
}

const closeModal = () => {
    emit("onclose")
};
</script>

<template>
    <div class="bg-white p-6 rounded-sm shadow-lg w-full lg:w-96">
        <h2 class="text-xl font-semibold mb-4">Solicitar levantamento</h2>
        <div>
            <!-- IBAN -->
            <label class="text-xs flex items-center gap-0.5 text-gray-500 mb-2 font-bold">Valor do levantamento (KZ)
                <span class="flex items-center text-sm font-medium mt-1 text-[#ff4f4f]">*</span></label>
            <div>
                <vue-cleave
                    class="p-2 border w-full rounded-sm border-gray-300 h-[40px] text-[13px] focus:outline-none text-gray-600 placeholder:text-gray-400"
                    id="priceTicketField" v-model="form.amount" :options="cleaveConfigPrice" placeholder="0,00"
                    :class="{ '!border-red-500': errors.amount.show }" />
                <small class="text-xs text-red-500" :class="{ danger: errors.amount.show }">
                    <span v-if="errors.amount.show">
                        {{ errors.amount.message }}
                    </span>
                </small>
            </div>


            <div class="py-2">
                <p class="text-xs text-gray-500">Saldo disponível: <b>{{ formatAmount(event.balance) }}</b></p>
            </div>

            <!-- Buttons -->
            <div class="flex justify-center mt-6">
                <button :disabled="loading" type="button" @click="closeModal"
                    class="bg-white text-sm font-bold hover:opacity-80 text-brand-info py-2 px-4 rounded-full">Cancelar</button>
                <button :disabled="loading" type="submit" @click="submitForm"
                    class="bg-brand-info disabled:bg-gray-300 disabled:text-gray-500 text-sm font-bold hover:opacity-80 text-white py-2 px-4 rounded-full">
                    {{ loading ? 'Salvando...' : 'Solicitar' }}
                </button>
            </div>
        </div>
    </div>
</template>
