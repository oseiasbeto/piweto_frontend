<script setup>
import { useStore } from "vuex";
import { computed, ref } from "vue";
import DatePicker from '@jobinsjp/vue3-datepicker';
import { useCoupons } from "@/repositories/coupons-repository";
import { toast } from "vue3-toastify"

const store = useStore()

// Estas hooks tem como finalidade fazer requesicoes HTTPS
const { newCoupon, loading: loadingNewCoupon } = useCoupons()

// esta função computada tem como finalidade retornar os dados da caixa de diálogo aberta.
const modal = computed(() => {
    return store.getters.modal
})

// esta função computada tem como finalidade retornar os dados do corrente evento.
const event = computed(() => {
    return store.getters.event
})

// Define os eventos de emissão deste componente.
const emit = defineEmits(["onclose"])

// configura datepicker para o idioma PT-AO
const langConfig = computed(() => {
    return {
        days: ['DOM', '2ª', '3ª', '4ª', '5ª', '6ª', 'SÁB'],
        daysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
        months: [
            'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
            'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
        ],
        monthFormat: 'MM'
    }
})

const disabledStartsAtTime = computed(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Zera as horas para garantir que apenas a data seja comparada
    return (date) => date < today; // Retorna true para datas passadas
});

const form = ref({
    name: "",
    discount: 0,
    usePeopleCountType: 'no limit',
    eventType: 'specific',
    usePeopleCount: 0,
    expiresAt: null
})

// Referencia de erros
const errors = ref({
    name: {
        show: false,
        message: "",
        nameError: null
    },
    discount: {
        show: false,
        message: ""
    },
    usePeopleCount: {
        show: false,
        message: ""
    },
    expiresAt: {
        show: false,
        message: ""
    }
})

// Esta função tem como finalidade emitir um evento de fecho da caixa de diálogo aberta ou cancela.
const close = () => {
    emit("onclose")
}

const submit = async () => {
    await newCoupon({
        ...form.value,
        eventId: event.value._id
    }).then(newCoupon => {
        store.dispatch("addCouponFromCoupons", newCoupon)
        close()
        toast("Coupom adicionado!", {
            theme: "colored",
            position: "top-right",
            autoClose: 2500,
            type: 'success'
        })  
    })
    .catch(err => {
        console.log(err)
    })
}
</script>

<template>
    <div class="bg-white p-5 shadow-xl rounded-sm max-w-96">
        <div class="flex flex-col mb-3">
            <label class="text-xs w-min select-none cursor-pointer flex gap-0.5 mb-2" for="name">
                <p class="whitespace-nowrap">Nome do cupom</p>
                <span class="text-brand-danger">*</span>
            </label>

            <input autocomplete="off" :disabled="loading" type="text" id="name" v-model="form.name" :class="{ '!border-brand-danger': errors.name.show }
                ">

            <span class="text-brand-danger text-xs mt-1" v-show="errors.name.show">
                {{ errors.name.message }}
            </span>
        </div>

        <div class="mb-3">
            <div class="flex items-center mb-1 gap-2">
                <div class="flex flex-col">
                    <label class="text-xs w-min select-none cursor-pointer flex gap-0.5 mb-2" for="use-type-no-limit">
                        <input v-model="form.usePeopleCountType" @change="form.usePeopleCount = null" value="no limit"
                            id="use-type-no-limit" type="radio">
                        <p class="whitespace-nowrap">Sem limites</p>
                    </label>
                </div>
                <div class="flex flex-col">
                    <label class="text-xs w-min select-none cursor-pointer flex gap-0.5 mb-2" for="use-type-limit">
                        <input v-model="form.usePeopleCountType" value="limit" id="use-type-limit" type="radio">
                        <p class="whitespace-nowrap">Com limites</p>
                    </label>
                </div>
            </div>

            <div v-if="form.usePeopleCountType == 'limit'" class="flex flex-col">
                <input autocomplete="off" :disabled="loading" type="number" id="name" v-model="form.usePeopleCount"
                    :class="{ '!border-brand-danger': errors.usePeopleCount.show }
                        ">
                <span class="text-brand-danger text-xs mt-1" v-show="errors.usePeopleCount.show">
                    {{ errors.usePeopleCount.message }}
                </span>
            </div>
        </div>

        <div class="flex flex-col mb-3">
            <label class="text-xs w-min select-none cursor-pointer flex gap-0.5 mb-2" for="name">
                <p class="whitespace-nowrap">Desconto</p>
                <span class="text-brand-danger">*</span>
            </label>

            <input autocomplete="off" :disabled="loading" type="number" id="name" v-model="form.discount" :class="{ '!border-brand-danger': errors.discount.show }
                ">

            <span class="text-brand-danger text-xs mt-1" v-show="errors.discount.show">
                {{ errors.discount.message }}
            </span>
        </div>

        <div class="flex flex-col mb-3">
            <label class="text-xs w-min select-none cursor-pointer flex gap-0.5 mb-2" for="name">
                <p class="whitespace-nowrap">Data de validdade</p>
                <span class="text-brand-danger">*</span>
            </label>

            <date-picker :clearable="false" :disabled-date="disabledStartsAtTime" :lang="langConfig"
                v-model:value="form.expiresAt"></date-picker>

            <span class="text-brand-danger text-xs mt-1" v-show="errors.name.show">
                {{ errors.name.message }}
            </span>
        </div>

        <div class="flex gap-2 items-center">
            <button @click="close">Cancelar</button>
            <button @click="submit">Criar coupom</button>
        </div>
    </div>
</template>